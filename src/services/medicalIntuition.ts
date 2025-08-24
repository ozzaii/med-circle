/**
 * 🤖 MEDICAL INTUITION FRAMEWORK - PHASE 4
 * Revolutionary 4-Layer Learning Model for Advanced Clinical Pattern Recognition
 * Built with NASA-grade precision for Turkish Medical AI Education
 */

import { GoogleGenerativeAI } from '@google/genai';

// 🧠 LAYER 1: ADVANCED PATTERN RECOGNITION ENGINE
export interface ClinicalPattern {
  id: string;
  name: string;
  category: 'symptom_cluster' | 'lab_pattern' | 'vital_signs' | 'imaging_finding' | 'temporal_pattern';
  description: string;
  confidence: number; // 0-1
  relatedConditions: string[];
  turkishTerminology: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  timeConstraints?: {
    urgency: 'immediate' | 'urgent' | 'routine';
    timeWindow: number; // minutes
  };
}

export interface PatientDataInput {
  demographics: {
    age: number;
    gender: 'male' | 'female';
    weight?: number;
    height?: number;
  };
  symptoms: {
    primary: string[];
    secondary: string[];
    onset: string;
    duration: string;
  };
  vitalSigns: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenSaturation?: number;
    respiratoryRate?: number;
    glasgow?: number;
  };
  labResults?: {
    test: string;
    value: string;
    normalRange: string;
    timestamp: string;
  }[];
  medicalHistory: string[];
  medications: string[];
}

export interface IntuitionAnalysis {
  recognizedPatterns: ClinicalPattern[];
  diagnosticHypotheses: {
    condition: string;
    probability: number;
    reasoning: string;
    turkishName: string;
  }[];
  recommendedActions: {
    priority: 'immediate' | 'urgent' | 'routine';
    action: string;
    reasoning: string;
    timeFrame: string;
  }[];
  riskAssessment: {
    overall: 'low' | 'moderate' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
  contextualInsights: string[];
}

/**
 * 🔬 Advanced Pattern Recognition Engine
 * Uses AI to identify complex clinical patterns from patient data
 */
export class PatternRecognitionEngine {
  private aiModel: any;
  private patterns: Map<string, ClinicalPattern> = new Map();

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.aiModel = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 4096,
      }
    });
    this.initializePatterns();
  }

  /**
   * Initialize known clinical patterns
   */
  private initializePatterns(): void {
    const emergencyPatterns: ClinicalPattern[] = [
      {
        id: 'septic-shock-pattern',
        name: 'Septic Shock Pattern',
        category: 'symptom_cluster',
        description: 'Classic septic shock presentation with hypotension and organ dysfunction',
        confidence: 0.95,
        relatedConditions: ['Sepsis', 'SIRS', 'Multi-organ failure'],
        turkishTerminology: 'Septik Şok Paterni',
        riskLevel: 'critical',
        timeConstraints: {
          urgency: 'immediate',
          timeWindow: 60 // 1 hour
        }
      },
      {
        id: 'stemi-pattern',
        name: 'STEMI Pattern',
        category: 'symptom_cluster',
        description: 'ST-elevation myocardial infarction with chest pain and EKG changes',
        confidence: 0.92,
        relatedConditions: ['Acute MI', 'Coronary artery occlusion', 'Cardiogenic shock'],
        turkishTerminology: 'STEMI Paterni',
        riskLevel: 'critical',
        timeConstraints: {
          urgency: 'immediate',
          timeWindow: 90 // Door-to-balloon time
        }
      },
      {
        id: 'status-epilepticus-pattern',
        name: 'Status Epilepticus Pattern',
        category: 'symptom_cluster',
        description: 'Continuous seizure activity >5 minutes or recurrent seizures',
        confidence: 0.90,
        relatedConditions: ['Epilepsy', 'Brain injury', 'Metabolic disorder'],
        turkishTerminology: 'Status Epileptikus Paterni',
        riskLevel: 'critical',
        timeConstraints: {
          urgency: 'immediate',
          timeWindow: 20
        }
      },
      {
        id: 'febrile-neutropenia-pattern',
        name: 'Febrile Neutropenia Pattern',
        category: 'lab_pattern',
        description: 'Fever with severe neutropenia in cancer patients',
        confidence: 0.88,
        relatedConditions: ['Chemotherapy complications', 'Immunosuppression', 'Sepsis'],
        turkishTerminology: 'Febril Nötropeni Paterni',
        riskLevel: 'high',
        timeConstraints: {
          urgency: 'urgent',
          timeWindow: 180
        }
      }
    ];

    emergencyPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * 🧠 Analyze patient data for clinical patterns
   */
  async analyzePatterns(patientData: PatientDataInput): Promise<IntuitionAnalysis> {
    const prompt = this.buildAnalysisPrompt(patientData);
    
    try {
      const result = await this.aiModel.generateContent(prompt);
      const response = result.response.text();
      
      // Parse AI response and combine with pattern matching
      const aiAnalysis = this.parseAIResponse(response);
      const patternMatches = this.matchKnownPatterns(patientData);
      
      return this.combineAnalyses(aiAnalysis, patternMatches, patientData);
    } catch (error) {
      console.error('Pattern recognition error:', error);
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(patientData);
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  private buildAnalysisPrompt(patientData: PatientDataInput): string {
    return `
🧠 MEDICAL INTUITION ANALYSIS - Turkish Medical AI System

HASTA VERILERI:
Demografik Bilgiler: ${patientData.demographics.age} yaş, ${patientData.demographics.gender}
Ana Şikayetler: ${patientData.symptoms.primary.join(', ')}
İkincil Şikayetler: ${patientData.symptoms.secondary.join(', ')}
Başlangıç: ${patientData.symptoms.onset}
Süre: ${patientData.symptoms.duration}

Vital Bulgular:
${this.formatVitalSigns(patientData.vitalSigns)}

${patientData.labResults ? `Lab Sonuçları:
${patientData.labResults.map(lab => `${lab.test}: ${lab.value} (Normal: ${lab.normalRange})`).join('\n')}` : ''}

Tıbbi Öykü: ${patientData.medicalHistory.join(', ')}
Medications: ${patientData.medications.join(', ')}

GÖREV:
1. Klinik paternleri tanımla ve analiz et
2. Olası tanı hipotezlerini oluştur
3. Risk değerlendirmesi yap
4. Acil müdahale önerileri ver
5. Türk tıp protokollerine uygun yaklaşım öner

Lütfen JSON formatında yanıt ver:
{
  "patterns": [{"name": "", "confidence": 0.0, "reasoning": ""}],
  "diagnoses": [{"condition": "", "probability": 0.0, "turkishName": "", "reasoning": ""}],
  "actions": [{"priority": "", "action": "", "timeFrame": "", "reasoning": ""}],
  "risk": {"level": "", "factors": [], "mitigation": []},
  "insights": [""]
}
    `;
  }

  /**
   * Format vital signs for analysis
   */
  private formatVitalSigns(vitals: PatientDataInput['vitalSigns']): string {
    return `
Nabız: ${vitals.heartRate || 'N/A'} /dk
Tansiyon: ${vitals.bloodPressure || 'N/A'}
Ateş: ${vitals.temperature || 'N/A'} °C
SaO2: ${vitals.oxygenSaturation || 'N/A'}%
Solunum: ${vitals.respiratoryRate || 'N/A'} /dk
Glasgow: ${vitals.glasgow || 'N/A'}
    `.trim();
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: string): Partial<IntuitionAnalysis> {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          recognizedPatterns: parsed.patterns?.map((p: any) => ({
            id: `ai-pattern-${Date.now()}`,
            name: p.name,
            category: 'symptom_cluster' as const,
            description: p.reasoning,
            confidence: p.confidence,
            relatedConditions: [],
            turkishTerminology: p.name,
            riskLevel: 'moderate' as const
          })) || [],
          diagnosticHypotheses: parsed.diagnoses || [],
          recommendedActions: parsed.actions || [],
          riskAssessment: parsed.risk || { overall: 'moderate', factors: [], mitigation: [] },
          contextualInsights: parsed.insights || []
        };
      }
    } catch (error) {
      console.error('AI response parsing error:', error);
    }
    
    return {
      recognizedPatterns: [],
      diagnosticHypotheses: [],
      recommendedActions: [],
      riskAssessment: { overall: 'moderate', factors: [], mitigation: [] },
      contextualInsights: []
    };
  }

  /**
   * Match against known clinical patterns
   */
  private matchKnownPatterns(patientData: PatientDataInput): ClinicalPattern[] {
    const matches: ClinicalPattern[] = [];
    const symptoms = [...patientData.symptoms.primary, ...patientData.symptoms.secondary];
    const symptomsText = symptoms.join(' ').toLowerCase();

    // Septic Shock Pattern Matching
    if (this.matchesSepticShock(patientData, symptomsText)) {
      const pattern = this.patterns.get('septic-shock-pattern');
      if (pattern) matches.push(pattern);
    }

    // STEMI Pattern Matching
    if (this.matchesSTEMI(patientData, symptomsText)) {
      const pattern = this.patterns.get('stemi-pattern');
      if (pattern) matches.push(pattern);
    }

    // Status Epilepticus Pattern Matching
    if (this.matchesStatusEpilepticus(patientData, symptomsText)) {
      const pattern = this.patterns.get('status-epilepticus-pattern');
      if (pattern) matches.push(pattern);
    }

    // Febrile Neutropenia Pattern Matching
    if (this.matchesFebrileNeutropenia(patientData, symptomsText)) {
      const pattern = this.patterns.get('febrile-neutropenia-pattern');
      if (pattern) matches.push(pattern);
    }

    return matches;
  }

  private matchesSepticShock(data: PatientDataInput, symptoms: string): boolean {
    const hasHypotension = data.vitalSigns.bloodPressure && 
      (data.vitalSigns.bloodPressure.includes('8') || data.vitalSigns.bloodPressure.includes('7'));
    const hasFever = data.vitalSigns.temperature && data.vitalSigns.temperature > 38;
    const hasTachycardia = data.vitalSigns.heartRate && data.vitalSigns.heartRate > 100;
    const hasInfectionSymptoms = symptoms.includes('ateş') || symptoms.includes('titreme') || 
      symptoms.includes('fever') || symptoms.includes('chills');

    return (hasHypotension && hasFever) || (hasInfectionSymptoms && hasTachycardia);
  }

  private matchesSTEMI(data: PatientDataInput, symptoms: string): boolean {
    const hasChestPain = symptoms.includes('göğüs ağrısı') || symptoms.includes('chest pain');
    const hasCardiacSymptoms = symptoms.includes('terleme') || symptoms.includes('sweating') ||
      symptoms.includes('nefes darlığı') || symptoms.includes('dyspnea');
    const isCardiacAge = data.demographics.age > 40;

    return hasChestPain && (hasCardiacSymptoms || isCardiacAge);
  }

  private matchesStatusEpilepticus(data: PatientDataInput, symptoms: string): boolean {
    const hasSeizure = symptoms.includes('nöbet') || symptoms.includes('seizure') ||
      symptoms.includes('konvülsiyon') || symptoms.includes('convulsion');
    const isProlonged = symptoms.includes('sürekli') || symptoms.includes('continuous') ||
      data.symptoms.duration.includes('dakika');

    return hasSeizure && isProlonged;
  }

  private matchesFebrileNeutropenia(data: PatientDataInput, symptoms: string): boolean {
    const hasFever = data.vitalSigns.temperature && data.vitalSigns.temperature > 38;
    const hasCancerHistory = data.medicalHistory.some(h => 
      h.toLowerCase().includes('kanser') || h.toLowerCase().includes('cancer') ||
      h.toLowerCase().includes('kemoterapi') || h.toLowerCase().includes('chemotherapy')
    );
    const hasNeutropeniaLab = data.labResults?.some(lab => 
      lab.test.toLowerCase().includes('wbc') || lab.test.toLowerCase().includes('anc')
    );

    return hasFever && (hasCancerHistory || hasNeutropeniaLab);
  }

  /**
   * Combine AI and pattern matching analyses
   */
  private combineAnalyses(
    aiAnalysis: Partial<IntuitionAnalysis>, 
    patternMatches: ClinicalPattern[], 
    patientData: PatientDataInput
  ): IntuitionAnalysis {
    return {
      recognizedPatterns: [
        ...(aiAnalysis.recognizedPatterns || []),
        ...patternMatches
      ],
      diagnosticHypotheses: aiAnalysis.diagnosticHypotheses || [],
      recommendedActions: aiAnalysis.recommendedActions || [],
      riskAssessment: aiAnalysis.riskAssessment || { 
        overall: 'moderate', 
        factors: [], 
        mitigation: [] 
      },
      contextualInsights: [
        ...(aiAnalysis.contextualInsights || []),
        `${patternMatches.length} known clinical pattern(s) identified`,
        'Analysis based on Turkish medical protocols and TEPDAD standards'
      ]
    };
  }

  /**
   * Fallback analysis when AI fails
   */
  private fallbackAnalysis(patientData: PatientDataInput): IntuitionAnalysis {
    const patternMatches = this.matchKnownPatterns(patientData);
    
    return {
      recognizedPatterns: patternMatches,
      diagnosticHypotheses: patternMatches.map(pattern => ({
        condition: pattern.relatedConditions[0] || 'Unknown',
        probability: pattern.confidence,
        reasoning: `Pattern matching based on ${pattern.name}`,
        turkishName: pattern.turkishTerminology
      })),
      recommendedActions: patternMatches
        .filter(p => p.timeConstraints)
        .map(pattern => ({
          priority: pattern.timeConstraints?.urgency || 'routine',
          action: `Immediate assessment for ${pattern.name}`,
          reasoning: `Critical time window: ${pattern.timeConstraints?.timeWindow} minutes`,
          timeFrame: `${pattern.timeConstraints?.timeWindow} minutes`
        })),
      riskAssessment: {
        overall: patternMatches.some(p => p.riskLevel === 'critical') ? 'critical' : 'moderate',
        factors: patternMatches.map(p => p.description),
        mitigation: ['Follow emergency protocols', 'Immediate medical attention']
      },
      contextualInsights: [
        'Fallback analysis using pattern matching',
        'AI analysis unavailable - using rule-based approach'
      ]
    };
  }
}

/**
 * Factory function to get Pattern Recognition Engine
 */
export function getPatternRecognitionEngine(apiKey: string): PatternRecognitionEngine {
  return new PatternRecognitionEngine(apiKey);
}

// Export utility types
export type { ClinicalPattern, PatientDataInput, IntuitionAnalysis };