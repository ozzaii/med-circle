/**
 * Advanced Streaming Service for Turkish Medical AI
 * Provides real-time streaming responses for medical analysis and explanations
 * Optimized for Turkish medical education with chunked processing
 */

import { GoogleGenAI } from '@google/genai';
import type { MEPModule, ClinicalCase } from '../data/mep_modules';
import { getPersonaPrompt, getPersonaConfig, type AIPersona } from './aiPersonas';

interface StreamingOptions {
  chunkSize?: number;
  delayBetweenChunks?: number;
  enableTTS?: boolean;
  priority?: 'normal' | 'high' | 'emergency';
  aiPersona?: AIPersona;
}

interface StreamChunk {
  content: string;
  isComplete: boolean;
  chunkIndex: number;
  totalChunks: number;
  metadata?: {
    type: 'analysis' | 'explanation' | 'recommendation';
    confidence: number;
    medicalTerms: string[];
  };
}

class TurkishMedicalStreamingService {
  private genAI: GoogleGenAI;
  private model = 'gemini-2.5-flash';
  private abortController: AbortController | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Stream clinical case analysis with real-time feedback
   */
  async *streamClinicalCaseAnalysis(
    clinicalCase: ClinicalCase,
    studentResponse: string,
    userLevel: 'student' | 'resident',
    options: StreamingOptions = {}
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const { chunkSize = 50, delayBetweenChunks = 100 } = options;
    
    this.abortController = new AbortController();
    
    try {
      const basePrompt = this.buildClinicalAnalysisPrompt(clinicalCase, studentResponse, userLevel);
      const prompt = options.aiPersona ? getPersonaPrompt(options.aiPersona.id, basePrompt) : basePrompt;
      const config = options.aiPersona ? getPersonaConfig(options.aiPersona.id) : { maxTokens: 800, temperature: 0.6 };
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: 'MODE_DYNAMIC',
                dynamicThreshold: 0.7
              }
            }
          }
        ]
      });
      
      const stream = result.stream;

      let fullResponse = '';
      let chunkIndex = 0;
      let currentChunk = '';
      
      for await (const chunk of stream) {
        if (this.abortController?.signal.aborted) {
          break;
        }

        const chunkText = chunk.text || '';
        fullResponse += chunkText;
        currentChunk += chunkText;
        
        // Process chunks based on size or sentence boundaries
        if (currentChunk.length >= chunkSize || this.isNaturalBreakPoint(currentChunk)) {
          const processedChunk = this.processChunkContent(currentChunk, 'analysis');
          
          yield {
            content: processedChunk.content,
            isComplete: false,
            chunkIndex: chunkIndex++,
            totalChunks: -1, // Unknown until complete
            metadata: {
              type: 'analysis',
              confidence: this.calculateConfidence(processedChunk.content),
              medicalTerms: this.extractMedicalTerms(processedChunk.content)
            }
          };
          
          currentChunk = '';
          
          // Delay between chunks for better UX
          if (delayBetweenChunks > 0) {
            await this.delay(delayBetweenChunks);
          }
        }
      }
      
      // Send final chunk if there's remaining content
      if (currentChunk.length > 0) {
        const processedChunk = this.processChunkContent(currentChunk, 'analysis');
        yield {
          content: processedChunk.content,
          isComplete: true,
          chunkIndex: chunkIndex,
          totalChunks: chunkIndex + 1,
          metadata: {
            type: 'analysis',
            confidence: this.calculateConfidence(processedChunk.content),
            medicalTerms: this.extractMedicalTerms(processedChunk.content)
          }
        };
      }
      
    } catch (error) {
      console.error('Streaming Clinical Analysis Error:', error);
      yield {
        content: 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        isComplete: true,
        chunkIndex: 0,
        totalChunks: 1,
        metadata: {
          type: 'analysis',
          confidence: 0,
          medicalTerms: []
        }
      };
    }
  }

  /**
   * Stream medical terminology explanations
   */
  async *streamMedicalTermExplanation(
    term: string,
    context: string,
    userLevel: 'student' | 'resident',
    options: StreamingOptions = {}
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const { chunkSize = 40, delayBetweenChunks = 80 } = options;
    
    this.abortController = new AbortController();
    
    try {
      const basePrompt = this.buildTermExplanationPrompt(term, context, userLevel);
      const prompt = options.aiPersona ? getPersonaPrompt(options.aiPersona.id, basePrompt) : basePrompt;
      const config = options.aiPersona ? getPersonaConfig(options.aiPersona.id) : { maxTokens: 400, temperature: 0.5 };
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: 'MODE_DYNAMIC',
                dynamicThreshold: 0.8
              }
            }
          }
        ]
      });
      
      const stream = result.stream;

      let chunkIndex = 0;
      let currentChunk = '';
      
      for await (const chunk of stream) {
        if (this.abortController?.signal.aborted) break;

        const chunkText = chunk.text || '';
        currentChunk += chunkText;
        
        if (currentChunk.length >= chunkSize || this.isNaturalBreakPoint(currentChunk)) {
          const processedChunk = this.processChunkContent(currentChunk, 'explanation');
          
          yield {
            content: processedChunk.content,
            isComplete: false,
            chunkIndex: chunkIndex++,
            totalChunks: -1,
            metadata: {
              type: 'explanation',
              confidence: this.calculateConfidence(processedChunk.content),
              medicalTerms: this.extractMedicalTerms(processedChunk.content)
            }
          };
          
          currentChunk = '';
          await this.delay(delayBetweenChunks);
        }
      }
      
      if (currentChunk.length > 0) {
        const processedChunk = this.processChunkContent(currentChunk, 'explanation');
        yield {
          content: processedChunk.content,
          isComplete: true,
          chunkIndex: chunkIndex,
          totalChunks: chunkIndex + 1,
          metadata: {
            type: 'explanation',
            confidence: this.calculateConfidence(processedChunk.content),
            medicalTerms: this.extractMedicalTerms(processedChunk.content)
          }
        };
      }
      
    } catch (error) {
      console.error('Streaming Term Explanation Error:', error);
      yield {
        content: 'Terim açıklaması alınamadı. Lütfen tekrar deneyin.',
        isComplete: true,
        chunkIndex: 0,
        totalChunks: 1,
        metadata: {
          type: 'explanation',
          confidence: 0,
          medicalTerms: []
        }
      };
    }
  }

  /**
   * Stream personalized recommendations
   */
  async *streamPersonalizedRecommendations(
    userProgress: any,
    completedModules: string[],
    userLevel: 'student' | 'resident',
    weakAreas: string[],
    options: StreamingOptions = {}
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const { chunkSize = 60, delayBetweenChunks = 120 } = options;
    
    this.abortController = new AbortController();
    
    try {
      const basePrompt = this.buildRecommendationsPrompt(userProgress, completedModules, userLevel, weakAreas);
      const prompt = options.aiPersona ? getPersonaPrompt(options.aiPersona.id, basePrompt) : basePrompt;
      const config = options.aiPersona ? getPersonaConfig(options.aiPersona.id) : { maxTokens: 600, temperature: 0.7 };
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: 'MODE_DYNAMIC',
                dynamicThreshold: 0.75
              }
            }
          }
        ]
      });
      
      const stream = result.stream;

      let chunkIndex = 0;
      let currentChunk = '';
      
      for await (const chunk of stream) {
        if (this.abortController?.signal.aborted) break;

        const chunkText = chunk.text || '';
        currentChunk += chunkText;
        
        if (currentChunk.length >= chunkSize || this.isRecommendationBreakPoint(currentChunk)) {
          const processedChunk = this.processChunkContent(currentChunk, 'recommendation');
          
          yield {
            content: processedChunk.content,
            isComplete: false,
            chunkIndex: chunkIndex++,
            totalChunks: -1,
            metadata: {
              type: 'recommendation',
              confidence: this.calculateConfidence(processedChunk.content),
              medicalTerms: this.extractMedicalTerms(processedChunk.content)
            }
          };
          
          currentChunk = '';
          await this.delay(delayBetweenChunks);
        }
      }
      
      if (currentChunk.length > 0) {
        const processedChunk = this.processChunkContent(currentChunk, 'recommendation');
        yield {
          content: processedChunk.content,
          isComplete: true,
          chunkIndex: chunkIndex,
          totalChunks: chunkIndex + 1,
          metadata: {
            type: 'recommendation',
            confidence: this.calculateConfidence(processedChunk.content),
            medicalTerms: this.extractMedicalTerms(processedChunk.content)
          }
        };
      }
      
    } catch (error) {
      console.error('Streaming Recommendations Error:', error);
      yield {
        content: 'Öneriler şu anda yüklenemedi. Lütfen tekrar deneyin.',
        isComplete: true,
        chunkIndex: 0,
        totalChunks: 1,
        metadata: {
          type: 'recommendation',
          confidence: 0,
          medicalTerms: []
        }
      };
    }
  }

  /**
   * Cancel current streaming operation
   */
  cancelStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Private helper methods
  private buildClinicalAnalysisPrompt(case_: ClinicalCase, response: string, level: string): string {
    return `
      🧠 ULTRATHINK MODE: Deep Clinical Analysis with Real-World Evidence
      
      Case: ${case_.title}
      Student Response: ${response}
      Medical Level: ${level}
      
      ACTIVATE DEEP RESEARCH & THINKING:
      
      1. **SEARCH & VERIFY**: Use Google Search to find:
         - Latest Turkish Medical Society guidelines (TTB, Uzmanlık Dernekleri)
         - Recent clinical studies (PubMed references)
         - Current treatment protocols (2024-2025)
      
      2. **ULTRATHINK PROCESS**:
         - Analyze student's clinical reasoning depth
         - Cross-reference with evidence-based medicine
         - Identify critical thinking gaps
         - Compare to international best practices
      
      3. **STRUCTURED OUTPUT** (max 250 words):
         ✅ **Clinical Assessment**: Evidence-based evaluation
         🔍 **Research Findings**: Quote specific sources/guidelines
         ⚠️ **Critical Gaps**: What's missing from student response
         🎯 **Action Plan**: Specific, measurable next steps
         📚 **Evidence**: Include web sources/references
      
      REQUIREMENTS:
      - Quote specific medical sources and dates
      - Include Turkish medical guidelines with web citations
      - Provide evidence-based recommendations
      - Use critical thinking framework
      - Turkish language with precise medical terminology
      
      Think deeply, research thoroughly, respond concisely.
    `;
  }

  private buildTermExplanationPrompt(term: string, context: string, level: string): string {
    return `
      🔬 DEEP MEDICAL RESEARCH: Turkish Term Analysis with Web Evidence
      
      Term: "${term}"
      Context: ${context}
      Medical Level: ${level}
      
      ULTRATHINK & RESEARCH PROCESS:
      
      1. **WEB SEARCH**: Find latest sources:
         - Turkish Medical Dictionaries (online)
         - TTB medical terminology databases
         - Recent medical publications (2024-2025)
         - International medical term definitions
      
      2. **DEEP ANALYSIS**:
         - Etymology and medical origins
         - Current clinical usage patterns
         - Regional variations in Turkish medicine
         - International equivalents and standards
      
      3. **STRUCTURED OUTPUT** (max 180 words):
         📖 **Definition**: Precise medical definition with etymology
         🏥 **Clinical Context**: How it's used in Turkish hospitals
         🔍 **Evidence**: Quote specific medical sources/websites
         💡 **Key Insight**: Critical understanding point
         🌍 **Global Context**: International medical perspective
      
      REQUIREMENTS:
      - Search and quote specific Turkish medical sources
      - Include web citations and dates
      - Provide both Turkish medical context and international standards
      - Use evidence-based medical terminology
      - Cross-reference multiple authoritative sources
      
      Research deeply, synthesize expertly, explain clearly.
    `;
  }

  private buildRecommendationsPrompt(progress: any, modules: string[], level: string, weakAreas: string[]): string {
    return `
      ACTIONABLE Learning Recommendations - Evidence-Based Turkish Medical Education:
      
      Student Profile:
      - Level: ${level}
      - Completed: ${modules.join(', ')}
      - Weak Areas: ${weakAreas.join(', ')}
      
      Provide CONCISE recommendations (max 180 words):
      
      1. Priority Focus (top 2 areas)
      2. Specific Actions (bullet points)
      3. Timeline (realistic)
      
      Requirements:
      - Use current Turkish medical education standards
      - Include evidence-based study methods
      - ACTIONABLE and SPECIFIC
      - Verify with Google Search for latest TUS/medical exam trends
      
      Search for current Turkish medical education best practices.
    `;
  }

  private processChunkContent(chunk: string, type: 'analysis' | 'explanation' | 'recommendation'): { content: string } {
    // Clean and format chunk content
    let processed = chunk.trim();
    
    // Ensure chunks end at natural points for better readability
    if (type === 'analysis') {
      processed = this.formatAnalysisChunk(processed);
    } else if (type === 'explanation') {
      processed = this.formatExplanationChunk(processed);
    } else if (type === 'recommendation') {
      processed = this.formatRecommendationChunk(processed);
    }
    
    return { content: processed };
  }

  private formatAnalysisChunk(content: string): string {
    // Add medical formatting for analysis chunks
    return content
      .replace(/(\d+\.\s)/g, '\n**$1**')
      .replace(/(Değerlendirme|Öneri|Sonuç):/gi, '\n**$1:**')
      .trim();
  }

  private formatExplanationChunk(content: string): string {
    // Format explanation chunks with medical terminology emphasis
    return content
      .replace(/\*\*(.*?)\*\*/g, '**$1**')
      .replace(/([A-ZÇĞÖŞÜİ][a-zçğöşüı]+\s*\([A-Za-z\s]+\))/g, '**$1**')
      .trim();
  }

  private formatRecommendationChunk(content: string): string {
    // Format recommendation chunks with bullet points
    return content
      .replace(/^-\s/gm, '• ')
      .replace(/(\d+\.\s)/g, '\n**$1**')
      .trim();
  }

  private isNaturalBreakPoint(content: string): boolean {
    // Check if content ends at a natural break point
    const breakPoints = ['. ', '! ', '? ', '\n', ': ', '; '];
    return breakPoints.some(bp => content.endsWith(bp));
  }

  private isRecommendationBreakPoint(content: string): boolean {
    // Specific break points for recommendations
    const recBreakPoints = ['. ', '\n', '• ', ': '];
    return recBreakPoints.some(bp => content.endsWith(bp));
  }

  private calculateConfidence(content: string): number {
    // Simple confidence calculation based on content quality
    const medicalTerms = this.extractMedicalTerms(content).length;
    const wordCount = content.split(' ').length;
    const sentenceCount = content.split(/[.!?]/).length;
    
    // Basic heuristic for confidence scoring
    let confidence = 0.6; // Base confidence
    if (medicalTerms > 0) confidence += 0.1;
    if (wordCount > 10) confidence += 0.1;
    if (sentenceCount > 1) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private extractMedicalTerms(content: string): string[] {
    // Extract potential Turkish medical terms
    const medicalPatterns = [
      /\b(hipertansiyon|hipotansiyon|bradikardi|taşikardi)\b/gi,
      /\b(miyokard|infarktüs|angina|stenokardi)\b/gi,
      /\b(septik|şok|febril|nötropeni)\b/gi,
      /\b(epilepsi|epileptikus|status|konvülsiyon)\b/gi,
      /\b(diabetes|diabetik|ketoasidoz|hipoglisemi)\b/gi,
    ];
    
    const terms: string[] = [];
    medicalPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        terms.push(...matches.map(m => m.toLowerCase()));
      }
    });
    
    return [...new Set(terms)]; // Remove duplicates
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let streamingService: TurkishMedicalStreamingService | null = null;

export const getTurkishMedicalStreamingService = (apiKey?: string): TurkishMedicalStreamingService => {
  if (!streamingService && apiKey) {
    streamingService = new TurkishMedicalStreamingService(apiKey);
  }
  if (!streamingService) {
    throw new Error('Turkish Medical Streaming Service not initialized. Please provide API key.');
  }
  return streamingService;
};

export { TurkishMedicalStreamingService };
export type { StreamChunk, StreamingOptions };
export default TurkishMedicalStreamingService;