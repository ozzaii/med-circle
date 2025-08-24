/**
 * Clinical Case Presentation Generator
 * AI-powered generation of Turkish medical case presentations
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPersonaPrompt, getPersonaConfig, AI_PERSONAS } from './aiPersonas';

interface CaseGenerationOptions {
  specialty: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caseType: 'emergency' | 'outpatient' | 'inpatient' | 'icu';
  patientAge: string;
  gender: 'male' | 'female';
  chiefComplaint: string;
  duration?: string;
  teachingPoints?: string[];
}

interface GeneratedCase {
  title: string;
  patient: {
    age: string;
    gender: string;
    occupation?: string;
    chiefComplaint: string;
    history: string;
    pastMedicalHistory: string[];
    medications: string[];
    socialHistory: string;
    familyHistory: string;
    reviewOfSystems: string;
  };
  physicalExam: {
    vitalSigns: {
      heartRate: string;
      bloodPressure: string;
      temperature: string;
      respiratoryRate: string;
      oxygenSaturation: string;
      glasgow?: number;
    };
    generalAppearance: string;
    systemicExam: { [system: string]: string };
  };
  investigations: {
    laboratory: { test: string; value: string; normalRange: string; significance: string }[];
    imaging: { type: string; findings: string; significance: string }[];
    other: { type: string; findings: string; significance: string }[];
  };
  clinicalQuestions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    teachingPoint: string;
  }[];
  diagnosis: {
    primary: string;
    differential: string[];
    icd10: string;
  };
  management: {
    immediate: string[];
    ongoing: string[];
    monitoring: string[];
    patientEducation: string[];
  };
  prognosis: string;
  teachingPoints: string[];
  references: string[];
}

class ClinicalCaseGenerator {
  private genAI: GoogleGenerativeAI;
  private model = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI({ apiKey });
  }

  async generateCase(options: CaseGenerationOptions): Promise<GeneratedCase> {
    const model = this.genAI.getGenerativeModel({ model: this.model });
    
    // Use Clinical Expert persona for case generation
    const clinicalExpert = AI_PERSONAS[1]; // Prof. Dr. Klinik
    const config = getPersonaConfig(clinicalExpert.id);
    
    const prompt = this.buildCaseGenerationPrompt(options);
    const enhancedPrompt = getPersonaPrompt(clinicalExpert.id, prompt);

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
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

      const responseText = result.response.text();
      return this.parseGeneratedCase(responseText, options);
      
    } catch (error) {
      console.error('Case Generation Error:', error);
      return this.generateFallbackCase(options);
    }
  }

  private buildCaseGenerationPrompt(options: CaseGenerationOptions): string {
    return `
      🏥 CLINICAL CASE PRESENTATION GENERATOR - Turkish Medical Education

      **Case Requirements:**
      - Specialty: ${options.specialty}
      - Difficulty: ${options.difficulty}
      - Setting: ${options.caseType}
      - Patient: ${options.patientAge} year old ${options.gender}
      - Chief Complaint: ${options.chiefComplaint}
      ${options.duration ? `- Duration: ${options.duration}` : ''}

      **GENERATE COMPREHENSIVE CASE:**

      🔍 **DEEP RESEARCH REQUIRED:**
      - Search for latest Turkish medical guidelines for this condition
      - Find current evidence-based management protocols
      - Include Turkish medical society recommendations
      - Reference international best practices adapted for Turkey

      📋 **CASE STRUCTURE:**

      1. **PATIENT PRESENTATION**
         - Realistic Turkish patient demographics
         - Authentic chief complaint and HPI
         - Relevant PMH, medications, social/family history
         - Comprehensive ROS

      2. **PHYSICAL EXAMINATION**
         - Age-appropriate vital signs
         - Systematic physical findings
         - Relevant positive and negative findings

      3. **INVESTIGATIONS**
         - Appropriate laboratory tests with realistic values
         - Relevant imaging with detailed findings
         - Other investigations as indicated
         - Include normal ranges and clinical significance

      4. **CLINICAL REASONING QUESTIONS** (5 questions)
         - Progressive difficulty
         - Multiple choice with 4 options
         - Detailed explanations with teaching points
         - Based on Turkish medical practice

      5. **DIAGNOSIS & MANAGEMENT**
         - Primary diagnosis with ICD-10
         - Comprehensive differential diagnosis
         - Evidence-based management plan
         - Turkish healthcare system considerations

      **REQUIREMENTS:**
      - Use current Turkish medical terminology
      - Include Turkish medical society guidelines
      - Reference recent evidence (2024-2025)
      - Make clinically authentic and educational
      - Include teaching points for medical students
      - Ensure cultural and healthcare system relevance

      **OUTPUT FORMAT:** Return structured JSON with all sections.

      Research thoroughly, create authentically, educate comprehensively.
    `;
  }

  private parseGeneratedCase(responseText: string, options: CaseGenerationOptions): GeneratedCase {
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('JSON Parsing Error:', error);
    }

    // Fallback to structured parsing
    return this.generateFallbackCase(options);
  }

  private generateFallbackCase(options: CaseGenerationOptions): GeneratedCase {
    const caseId = `case-${Date.now()}`;
    
    return {
      title: `${options.specialty} Vakası - ${options.chiefComplaint}`,
      patient: {
        age: options.patientAge,
        gender: options.gender,
        occupation: options.gender === 'male' ? 'Öğretmen' : 'Hemşire',
        chiefComplaint: options.chiefComplaint,
        history: `${options.patientAge} yaşında ${options.gender === 'male' ? 'erkek' : 'kadın'} hasta, ${options.duration || '2 gündür'} devam eden ${options.chiefComplaint} şikayeti ile başvurdu.`,
        pastMedicalHistory: ['Bilinen kronik hastalık yok'],
        medications: ['Düzenli ilaç kullanımı yok'],
        socialHistory: 'Sigara (-), alkol (-)',
        familyHistory: 'Aile öyküsünde özellik yok',
        reviewOfSystems: 'Sistem sorgulamasında özellik yok'
      },
      physicalExam: {
        vitalSigns: {
          heartRate: '80/dk',
          bloodPressure: '120/80 mmHg',
          temperature: '36.5°C',
          respiratoryRate: '16/dk',
          oxygenSaturation: '98%',
          glasgow: 15
        },
        generalAppearance: 'Genel durumu iyi, bilinç açık',
        systemicExam: {
          'Kardiyovasküler': 'Ritmik, ek ses yok',
          'Respiratuar': 'Bilateral eşit havalanma',
          'Abdomen': 'Batın yumuşak, hassasiyet yok'
        }
      },
      investigations: {
        laboratory: [
          { test: 'Hemoglobin', value: '12.5 g/dL', normalRange: '12-16 g/dL', significance: 'Normal' },
          { test: 'Kreatinin', value: '0.9 mg/dL', normalRange: '0.6-1.2 mg/dL', significance: 'Normal' }
        ],
        imaging: [
          { type: 'Göğüs X-Ray', findings: 'Kalp ve akciğer alanları normal', significance: 'Patoloji saptanmadı' }
        ],
        other: []
      },
      clinicalQuestions: [
        {
          id: `q1-${caseId}`,
          question: `Bu hastada ilk değerlendirmede öncelik verilmesi gereken parametre hangisidir?`,
          options: ['Vital bulgular', 'Laboratuvar testleri', 'Görüntüleme', 'Konsültasyon'],
          correctAnswer: 0,
          explanation: 'Acil serviste ilk değerlendirmede vital bulgular önceliklidir.',
          teachingPoint: 'ABCDE yaklaşımı temel prensiptir'
        }
      ],
      diagnosis: {
        primary: 'Değerlendirme devam ediyor',
        differential: ['Değerlendirme için veri yetersiz'],
        icd10: 'Z00.0'
      },
      management: {
        immediate: ['Vital bulgu takibi', 'Semptomatik tedavi'],
        ongoing: ['Takip önerisi', 'Hasta eğitimi'],
        monitoring: ['Semptom takibi'],
        patientEducation: ['Genel sağlık önerileri']
      },
      prognosis: 'İyi',
      teachingPoints: ['Sistematik hasta yaklaşımı önemlidir'],
      references: ['Turkish Medical Guidelines 2024']
    };
  }

  async generateMultipleCases(
    options: CaseGenerationOptions, 
    count: number = 3
  ): Promise<GeneratedCase[]> {
    const cases: GeneratedCase[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const caseVariant = {
          ...options,
          // Vary some parameters for diversity
          patientAge: this.randomizeAge(options.patientAge),
          gender: i % 2 === 0 ? 'male' : 'female' as 'male' | 'female'
        };
        
        const generatedCase = await this.generateCase(caseVariant);
        cases.push(generatedCase);
        
        // Delay between generations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating case ${i + 1}:`, error);
        cases.push(this.generateFallbackCase(options));
      }
    }
    
    return cases;
  }

  private randomizeAge(baseAge: string): string {
    const age = parseInt(baseAge);
    const variation = Math.floor(Math.random() * 10) - 5; // ±5 years
    return Math.max(18, age + variation).toString();
  }
}

// Singleton instance
let caseGenerator: ClinicalCaseGenerator | null = null;

export const getClinicalCaseGenerator = (apiKey?: string): ClinicalCaseGenerator => {
  if (!caseGenerator && apiKey) {
    caseGenerator = new ClinicalCaseGenerator(apiKey);
  }
  if (!caseGenerator) {
    throw new Error('Clinical Case Generator not initialized. Please provide API key.');
  }
  return caseGenerator;
};

export { ClinicalCaseGenerator };
export type { CaseGenerationOptions, GeneratedCase };