import { GoogleGenAI } from '@google/genai';
import type { MEPModule, ClinicalCase } from '../data/mep_modules';

// Simple types for what we need
interface MEPProgress {
  completionPercentage: number;
  timeSpent: number;
  strongAreas?: string[];
}

interface AdaptiveQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiHints: string[];
}

/**
 * Advanced AI Service for Medical Education Program (MEP)
 * Specialized for Turkish Medical Education with multilingual support
 */
class MEPAIService {
  private genAI: GoogleGenAI;
  private model = 'gemini-2.5-flash';
  private turkishMedicalPrompt = `
    Sen Türk tıp eğitimi için özelleştirilmiş, gelişmiş bir tıbbi eğitim AI asistanısın. 
    Türk tıp öğrencileri ve asistan hekimler için:
    
    - TEPDAD standartlarına uygun eğitim içeriği sağla
    - TUS (Tıpta Uzmanlık Sınavı) hazırlığına yardımcı ol
    - Türkçe ve İngilizce tıbbi terminolojiyi öğret
    - Klinik vakaları Türk hasta profili ile örneklendir
    - Evidence-based medicine prensiplerini uygula
    - Türk Tabipleri Birliği ve uzmanlık dernekleri kılavuzlarını referans al
    
    Yanıtların:
    - Türkçe ve İngilizce karışık kullanabilir (medical terms için)
    - Klinik korelelasyonlar içerir
    - Türk sağlık sistemine özgü yaklaşımlar sunar
    - Güncel tıbbi kılavuzları referans alır
    - Öğrenci seviyesine uygun açıklamalar yapar
  `;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate personalized AI response for MEP modules
   */
  async generateMEPResponse(
    query: string,
    module: MEPModule,
    userLevel: 'student' | 'resident',
    language: 'turkish' | 'english' | 'bilingual' = 'bilingual'
  ): Promise<string> {
    try {
      const contextPrompt = this.buildMEPContextPrompt(module, userLevel, language);
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const response = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            { text: this.turkishMedicalPrompt },
            { text: contextPrompt },
            { text: query + "\n\nProvide CONCISE, evidence-based response (max 300 words). Verify facts with Google Search." }
          ]
        }],
        generationConfig: {
          temperature: 0.6,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 600,
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

      return response.text || '';
    } catch (error) {
      console.error('MEP AI Response Error:', error);
      throw new Error('MEP AI yanıt oluşturulamadı');
    }
  }

  /**
   * Generate adaptive quiz questions for MEP modules
   */
  async generateAdaptiveQuiz(
    module: MEPModule,
    difficulty: 'easy' | 'medium' | 'hard',
    questionCount: number = 10,
    language: 'turkish' | 'english' | 'bilingual' = 'bilingual'
  ): Promise<AdaptiveQuestion[]> {
    try {
      const languagePrompt = language === 'turkish' 
        ? 'Soruları Türkçe oluştur, tıbbi terimleri İngilizce karşılıkları ile birlikte ver.'
        : language === 'english'
        ? 'Generate questions in English with Turkish medical term translations.'
        : 'Use bilingual approach - Turkish explanations with English medical terms.';

      const prompt = `
        ${module.title} MEP modülü için ${questionCount} adet ${difficulty} seviye soru oluştur.
        
        Modül konuları: ${module.requiredSkills.join(', ')}
        Hedef seviye: ${module.difficulty}
        Dil: ${languagePrompt}
        
        Her soru için JSON formatında:
        {
          "id": "unique_id",
          "question": "soru metni",
          "type": "multiple-choice",
          "options": ["seçenek1", "seçenek2", "seçenek3", "seçenek4"],
          "correctAnswer": 0,
          "explanation": "detaylı açıklama",
          "difficulty": "${difficulty}",
          "aiHints": ["ipucu1", "ipucu2"],
          "turkishTerms": {"term": "türkçe_karşılık"},
          "clinicalCorrelation": "klinik korelasyon"
        }
        
        Sadece geçerli JSON array döndür.
      `;

      const model = this.genAI.getGenerativeModel({ model: this.model });
      
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt + "\n\nProvide CONCISE quiz (max 5 questions). Verify medical facts with Google Search." }] }],
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 800
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

      const responseText = response.text || '[]';
      try {
        return JSON.parse(responseText);
      } catch {
        // Fallback to basic questions if JSON parsing fails
        return this.generateFallbackQuestions(module, difficulty, questionCount);
      }
    } catch (error) {
      console.error('Adaptive Quiz Generation Error:', error);
      return this.generateFallbackQuestions(module, difficulty, questionCount);
    }
  }

  /**
   * Analyze clinical case and provide AI guidance
   */
  async analyzeClinicalCase(
    clinicalCase: ClinicalCase,
    studentResponse: string,
    userLevel: 'student' | 'resident'
  ): Promise<{
    feedback: string;
    suggestions: string[];
    correctApproach: string[];
    learningPoints: string[];
  }> {
    try {
      const prompt = `
        Klinik Vaka: ${clinicalCase.title}
        Hasta Bilgileri: ${JSON.stringify(clinicalCase.patient, null, 2)}
        Vaka Sunumu: ${clinicalCase.presentation}
        
        Öğrenci Yanıtı: ${studentResponse}
        Öğrenci Seviyesi: ${userLevel}
        
        Bu klinik vaka için öğrenci yanıtını değerlendir ve şunları sağla:
        1. Detaylı geri bildirim
        2. İyileştirme önerileri
        3. Doğru yaklaşım adımları
        4. Önemli öğrenme noktaları
        
        Türkçe açıkla, tıbbi terimleri İngilizce karşılıkları ile birlikte ver.
        ${userLevel === 'student' ? 'Tıp öğrencisi seviyesine uygun açıklamalar yap.' : 'Asistan hekim seviyesinde detaylı analiz yap.'}
      `;

      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: [{ 
          role: 'user', 
          parts: [
            { text: this.turkishMedicalPrompt },
            { text: prompt }
          ]
        }],
        config: { temperature: 0.6 }
      });

      const analysisText = response.text || '';
      
      // Parse the response to extract structured feedback
      return {
        feedback: analysisText,
        suggestions: this.extractSuggestions(analysisText),
        correctApproach: clinicalCase.diagnosticApproach,
        learningPoints: clinicalCase.learningObjectives
      };
    } catch (error) {
      console.error('Clinical Case Analysis Error:', error);
      return {
        feedback: 'Analiz şu anda yapılamıyor. Lütfen daha sonra tekrar deneyin.',
        suggestions: ['Vaka detaylarını tekrar gözden geçirin', 'Diferansiyel tanı listesi oluşturun'],
        correctApproach: clinicalCase.diagnosticApproach,
        learningPoints: clinicalCase.learningObjectives
      };
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  async generatePersonalizedRecommendations(
    userProgress: MEPProgress,
    completedModules: string[],
    userLevel: 'student' | 'resident',
    weakAreas: string[]
  ): Promise<string[]> {
    try {
      const prompt = `
        Öğrenci Profili:
        - Seviye: ${userLevel}
        - Tamamlanan Modüller: ${completedModules.join(', ')}
        - Zayıf Alanlar: ${weakAreas.join(', ')}
        - Toplam Çalışma Süresi: ${userProgress.timeSpent} dakika
        - Güçlü Alanlar: ${userProgress.strongAreas?.join(', ') || 'Henüz belirlenmemiş'}
        
        Bu profil için kişiselleştirilmiş öğrenme önerileri oluştur:
        1. Odaklanması gereken konular
        2. Önerilen çalışma sırası
        3. Zayıf alanları güçlendirme stratejileri
        4. Klinik vaka önerileri
        5. TUS/Uzmanlık sınav hazırlığı ipuçları
        
        Her öneriyi ayrı satırda, Türkçe olarak ver.
      `;

      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.7 }
      });

      const recommendationsText = response.text || '';
      return recommendationsText.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Personalized Recommendations Error:', error);
      return [
        'Temel anatomi ve fizyoloji konularını tekrar edin',
        'Klinik vaka çalışmalarına ağırlık verin',
        'Güncel tıbbi kılavuzları takip edin'
      ];
    }
  }

  /**
   * Generate Turkish medical terminology explanations
   */
  async explainTurkishMedicalTerm(
    term: string,
    context: string,
    userLevel: 'student' | 'resident'
  ): Promise<{
    turkish: string;
    english: string;
    definition: string;
    clinicalUse: string;
    examples: string[];
  }> {
    try {
      const prompt = `
        Tıbbi terim: "${term}"
        Bağlam: "${context}"
        Öğrenci seviyesi: ${userLevel}
        
        Bu terim için şunları sağla:
        1. Türkçe adı/tanımı
        2. İngilizce karşılığı
        3. Detaylı açıklama
        4. Klinik kullanım alanları
        5. Örnek kullanımlar
        
        JSON formatında döndür:
        {
          "turkish": "türkçe_terim",
          "english": "english_term", 
          "definition": "detaylı_tanım",
          "clinicalUse": "klinik_kullanım",
          "examples": ["örnek1", "örnek2", "örnek3"]
        }
      `;

      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.5 }
      });

      const responseText = response.text || '';
      try {
        return JSON.parse(responseText);
      } catch {
        return {
          turkish: term,
          english: term,
          definition: 'Tanım şu anda yüklenemedi',
          clinicalUse: 'Klinik kullanım bilgisi mevcut değil',
          examples: ['Örnek yüklenemedi']
        };
      }
    } catch (error) {
      console.error('Medical Term Explanation Error:', error);
      return {
        turkish: term,
        english: term,
        definition: 'Tanım şu anda yüklenemedi',
        clinicalUse: 'Klinik kullanım bilgisi mevcut değil',
        examples: ['Örnek yüklenemedi']
      };
    }
  }

  /**
   * Generate AI-powered study schedule
   */
  async generateStudySchedule(
    availableModules: MEPModule[],
    userLevel: 'student' | 'resident',
    dailyStudyTime: number, // in minutes
    weeklyGoals: string[]
  ): Promise<{
    weeklySchedule: { [day: string]: { modules: string[], duration: number, focus: string } };
    priorities: string[];
    tips: string[];
  }> {
    try {
      const prompt = `
        Kullanılabilir MEP Modülleri: ${availableModules.map(m => `${m.title} (${m.estimatedTime}h)`).join(', ')}
        Öğrenci seviyesi: ${userLevel}
        Günlük çalışma süresi: ${dailyStudyTime} dakika
        Haftalık hedefler: ${weeklyGoals.join(', ')}
        
        Kişiselleştirilmiş 7 günlük çalışma programı oluştur:
        - Her gün için modül önerileri
        - Çalışma süresi dağılımı
        - Odaklanılacak konular
        - Öncelik sıralaması
        - Çalışma ipuçları
        
        JSON formatında döndür.
      `;

      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.6 }
      });

      const responseText = response.text || '';
      try {
        return JSON.parse(responseText);
      } catch {
        return this.generateFallbackSchedule(availableModules, dailyStudyTime);
      }
    } catch (error) {
      console.error('Study Schedule Generation Error:', error);
      return this.generateFallbackSchedule(availableModules, dailyStudyTime);
    }
  }

  // Private helper methods
  private buildMEPContextPrompt(
    module: MEPModule,
    userLevel: 'student' | 'resident',
    language: 'turkish' | 'english' | 'bilingual'
  ): string {
    return `
      MEP Modül Bağlamı:
      - Modül: ${module.title}
      - Açıklama: ${module.description}
      - Seviye: ${module.difficulty}
      - Kategori: ${module.category}
      - Dil: ${language}
      - Öğrenci Seviyesi: ${userLevel}
      - Gerekli Beceriler: ${module.requiredSkills.join(', ')}
      - Türkçe Terimler: ${JSON.stringify(module.turkishMedicalTerms)}
      - Uluslararası Kılavuzlar: ${module.internationalGuidelines.join(', ')}
    `;
  }

  private generateFallbackQuestions(
    module: MEPModule,
    difficulty: string,
    count: number
  ): AdaptiveQuestion[] {
    const questions: AdaptiveQuestion[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `fallback-${i}`,
        question: `${module.title} modülü hakkında soru ${i + 1}`,
        type: 'multiple-choice',
        options: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
        correctAnswer: 0,
        explanation: 'Açıklama yüklenemedi',
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        aiHints: ['İpucu mevcut değil']
      });
    }
    return questions;
  }

  private extractSuggestions(text: string): string[] {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, 5); // Return first 5 non-empty lines as suggestions
  }

  private generateFallbackSchedule(
    modules: MEPModule[],
    dailyTime: number
  ): any {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const schedule: any = { weeklySchedule: {}, priorities: [], tips: [] };
    
    days.forEach((day, index) => {
      const moduleForDay = modules[index % modules.length];
      schedule.weeklySchedule[day] = {
        modules: [moduleForDay.title],
        duration: dailyTime,
        focus: moduleForDay.category
      };
    });
    
    schedule.priorities = ['Temel konulara odaklan', 'Klinik vakaları çöz', 'Tekrar yap'];
    schedule.tips = ['Düzenli çalış', 'Notlar al', 'Pratik yap'];
    
    return schedule;
  }
}

// Export singleton instance
let mepAIService: MEPAIService | null = null;

export const getMEPAIService = (apiKey?: string): MEPAIService => {
  if (!mepAIService && apiKey) {
    mepAIService = new MEPAIService(apiKey);
  }
  if (!mepAIService) {
    throw new Error('MEP AI Service not initialized. Please provide API key.');
  }
  return mepAIService;
};

export { MEPAIService };