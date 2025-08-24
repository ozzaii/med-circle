import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIContext, AIResponse } from '../types';

const genAI = new GoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export class MedicalAIService {
  private model = 'gemini-2.5-flash-lite';
  private systemPrompt = `You are an advanced medical education AI assistant. You help medical students, residents, and healthcare professionals learn and understand complex medical concepts. 

Your responses should be:
- Accurate and evidence-based
- Clear and educational
- Contextually aware of the user's current study material
- Professional yet approachable
- Include relevant medical terminology with explanations

Always cite specific page numbers or chapters when referencing material from books the user is studying.`;

  async generateResponse(
    query: string,
    context: AIContext,
    bookContent?: string
  ): Promise<AIResponse> {
    try {
      const contextPrompt = this.buildContextPrompt(context, bookContent);
      
      const response = await genAI.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: this.systemPrompt },
              { text: contextPrompt },
              { text: query }
            ]
          }
        ],
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const responseText = response.text || '';
      const relatedConcepts = this.extractRelatedConcepts(responseText);
      const references = this.extractReferences(responseText, context.bookId);

      return {
        id: this.generateId(),
        query,
        response: responseText,
        context,
        timestamp: new Date(),
        relatedConcepts,
        references,
        confidence: 0.95,
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateQuizQuestions(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<any[]> {
    try {
      const prompt = `Generate ${count} multiple-choice questions about ${topic} in medicine. 
      Difficulty level: ${difficulty}
      
      Format each question as JSON with:
      - question: the question text
      - options: array of 4 possible answers
      - correctAnswer: index of correct option (0-3)
      - explanation: detailed explanation of the answer
      - relatedConcepts: array of related medical concepts
      
      Return only valid JSON array.`;

      const response = await genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const responseText = response.text || '[]';
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return [];
    }
  }

  async summarizeChapter(
    chapterContent: string,
    chapterTitle: string
  ): Promise<string> {
    try {
      const prompt = `Summarize the following medical chapter "${chapterTitle}" in a clear, structured format:
      
      ${chapterContent}
      
      Include:
      1. Key concepts
      2. Important definitions
      3. Clinical relevance
      4. Study tips`;

      const response = await genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return response.text || '';
    } catch (error) {
      console.error('Error summarizing chapter:', error);
      throw new Error('Failed to summarize chapter');
    }
  }

  async explainConcept(
    concept: string,
    userLevel: string
  ): Promise<string> {
    try {
      const prompt = `Explain the medical concept "${concept}" for a ${userLevel}.
      
      Include:
      - Definition
      - Clinical significance
      - Common examples
      - Related concepts
      - Memory aids or mnemonics if applicable`;

      const response = await genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return response.text || '';
    } catch (error) {
      console.error('Error explaining concept:', error);
      throw new Error('Failed to explain concept');
    }
  }

  private buildContextPrompt(context: AIContext, bookContent?: string): string {
    let prompt = `Current context:
    - Studying from book ID: ${context.bookId}
    - User level: ${context.userLevel}`;

    if (context.currentPage) {
      prompt += `\n- Currently on page: ${context.currentPage}`;
    }

    if (context.currentChapter) {
      prompt += `\n- Current chapter: ${context.currentChapter}`;
    }

    if (context.recentTopics.length > 0) {
      prompt += `\n- Recent topics studied: ${context.recentTopics.join(', ')}`;
    }

    if (bookContent) {
      prompt += `\n\nRelevant book content:\n${bookContent}`;
    }

    return prompt;
  }

  private extractRelatedConcepts(text: string): string[] {
    // Simple extraction - in production, this would be more sophisticated
    const concepts: string[] = [];
    const medicalTerms = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    
    medicalTerms.forEach(term => {
      if (term.length > 4 && !concepts.includes(term)) {
        concepts.push(term);
      }
    });

    return concepts.slice(0, 5);
  }

  private extractReferences(text: string, bookId: string): any[] {
    const references: any[] = [];
    const pageMatches = text.match(/page\s+(\d+)/gi) || [];
    
    pageMatches.forEach(match => {
      const pageNum = parseInt(match.replace(/page\s+/i, ''));
      references.push({
        bookId,
        page: pageNum,
        excerpt: text.substring(text.indexOf(match) - 50, text.indexOf(match) + 50),
      });
    });

    return references;
  }

  private generateId(): string {
    return `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const medicalAI = new MedicalAIService();