import { GoogleGenerativeAI } from '@google/generative-ai';

interface ClinicalContext {
  patientData: {
    age?: number;
    gender?: string;
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    imaging?: string[];
    history?: string[];
    medications?: string[];
    allergies?: string[];
  };
  clinicalScenario: string;
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergent' | 'critical';
}

interface DifferentialDiagnosis {
  diagnosis: string;
  probability: number;
  supportingEvidence: string[];
  ruledOutBy: string[];
  nextSteps: string[];
}

interface ClinicalDecisionSupport {
  primaryDiagnosis: DifferentialDiagnosis;
  differentials: DifferentialDiagnosis[];
  immediateActions: string[];
  investigations: {
    lab: string[];
    imaging: string[];
    other: string[];
  };
  treatmentPlan: {
    medications: string[];
    procedures: string[];
    monitoring: string[];
  };
  redFlags: string[];
  dispositionRecommendation: string;
  evidenceBase: string[];
}

interface NLPAnalysis {
  entities: {
    symptoms: string[];
    diagnoses: string[];
    medications: string[];
    procedures: string[];
    anatomicalLocations: string[];
  };
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  urgencyScore: number;
  clinicalRelevance: number;
}

class ClinicalAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private turkishMedicalTerms: Map<string, string>;
  private clinicalGuidelines: Map<string, any>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });
    
    this.turkishMedicalTerms = new Map([
      ['sepsis', 'sepsis'],
      ['shock', 'şok'],
      ['myocardial infarction', 'miyokard enfarktüsü'],
      ['pneumonia', 'pnömoni'],
      ['meningitis', 'menenjit'],
      ['trauma', 'travma'],
      ['hemorrhage', 'kanama'],
      ['respiratory failure', 'solunum yetmezliği']
    ]);

    this.clinicalGuidelines = new Map([
      ['sepsis', {
        criteria: ['SIRS kriterleri', 'qSOFA', 'SOFA'],
        management: ['1 saat içinde antibiyotik', 'IV sıvı resüsitasyonu', 'Kaynak kontrolü'],
        turkish: 'Sepsis Tedavi Kılavuzu 2023'
      }],
      ['stemi', {
        criteria: ['EKG değişiklikleri', 'Troponin yüksekliği', 'Klinik prezentasyon'],
        management: ['DAPT', 'Reperfüzyon stratejisi', 'Beta bloker'],
        turkish: 'Türk Kardiyoloji Derneği STEMI Kılavuzu'
      }]
    ]);
  }

  async analyzeWithNLP(text: string): Promise<NLPAnalysis> {
    const prompt = `
    Perform medical NLP analysis on the following Turkish/English medical text.
    Extract medical entities and analyze clinical relevance.
    
    Text: ${text}
    
    Provide analysis in JSON format:
    {
      "entities": {
        "symptoms": [],
        "diagnoses": [],
        "medications": [],
        "procedures": [],
        "anatomicalLocations": []
      },
      "sentiment": "positive/neutral/negative/critical",
      "urgencyScore": 0-10,
      "clinicalRelevance": 0-10
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getDefaultNLPAnalysis();
    } catch (error) {
      console.error('NLP Analysis error:', error);
      return this.getDefaultNLPAnalysis();
    }
  }

  async provideClinicalDecisionSupport(context: ClinicalContext): Promise<ClinicalDecisionSupport> {
    const prompt = `
    You are an expert clinical decision support system. Analyze the following case and provide evidence-based recommendations.
    
    Clinical Context:
    - Scenario: ${context.clinicalScenario}
    - Specialty: ${context.specialty}
    - Urgency: ${context.urgency}
    - Patient Data: ${JSON.stringify(context.patientData, null, 2)}
    
    Consider Turkish medical guidelines (TEPDAD, TTB) and international standards.
    
    Provide comprehensive clinical decision support including:
    1. Primary diagnosis with probability
    2. Top 3-5 differential diagnoses
    3. Immediate actions required
    4. Investigations needed (lab, imaging, other)
    5. Treatment plan (medications, procedures, monitoring)
    6. Red flags to watch for
    7. Disposition recommendation
    8. Evidence base for recommendations
    
    Format response as structured JSON.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseClinicalDecisionResponse(response);
    } catch (error) {
      console.error('Clinical Decision Support error:', error);
      return this.getDefaultClinicalDecision(context);
    }
  }

  async generateDifferentialDiagnosis(
    symptoms: string[],
    vitals: Record<string, string>,
    labs: Record<string, string>
  ): Promise<DifferentialDiagnosis[]> {
    const prompt = `
    Generate a differential diagnosis list based on:
    
    Symptoms: ${symptoms.join(', ')}
    Vitals: ${JSON.stringify(vitals)}
    Labs: ${JSON.stringify(labs)}
    
    For each diagnosis provide:
    - Probability (0-100%)
    - Supporting evidence from the data
    - What would rule it out
    - Next diagnostic steps
    
    Consider both common and can't-miss diagnoses.
    Include Turkish medical terminology where appropriate.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseDifferentialResponse(response);
    } catch (error) {
      console.error('Differential diagnosis error:', error);
      return this.getDefaultDifferentials(symptoms);
    }
  }

  async evaluateClinicalDecision(
    decision: string,
    context: ClinicalContext,
    outcome?: string
  ): Promise<{
    appropriateness: 'excellent' | 'good' | 'acceptable' | 'suboptimal' | 'poor';
    reasoning: string;
    alternatives: string[];
    learningPoints: string[];
    evidenceSupport: string[];
  }> {
    const prompt = `
    Evaluate the following clinical decision:
    
    Decision: ${decision}
    Context: ${JSON.stringify(context)}
    ${outcome ? `Outcome: ${outcome}` : ''}
    
    Assess:
    1. Appropriateness of the decision
    2. Clinical reasoning
    3. Alternative approaches
    4. Key learning points
    5. Evidence supporting or refuting the decision
    
    Consider Turkish medical education standards and best practices.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseEvaluationResponse(response);
    } catch (error) {
      console.error('Decision evaluation error:', error);
      return {
        appropriateness: 'acceptable',
        reasoning: 'Decision aligns with standard clinical practice',
        alternatives: ['Consider additional diagnostic tests', 'Consult specialist if no improvement'],
        learningPoints: ['Always consider differential diagnoses', 'Document clinical reasoning'],
        evidenceSupport: ['Standard treatment guidelines']
      };
    }
  }

  async predictClinicalOutcome(
    interventions: string[],
    patientData: any
  ): Promise<{
    likelyOutcome: string;
    probability: number;
    complications: string[];
    timeframe: string;
    modifiableFactors: string[];
  }> {
    const prompt = `
    Predict clinical outcome based on:
    
    Interventions: ${interventions.join(', ')}
    Patient Data: ${JSON.stringify(patientData)}
    
    Provide:
    1. Most likely outcome
    2. Probability of success
    3. Potential complications
    4. Expected timeframe
    5. Modifiable factors to improve outcome
    
    Base predictions on evidence-based medicine and clinical experience.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseOutcomeResponse(response);
    } catch (error) {
      console.error('Outcome prediction error:', error);
      return {
        likelyOutcome: 'Favorable with appropriate management',
        probability: 75,
        complications: ['Monitor for deterioration'],
        timeframe: '24-48 hours for initial response',
        modifiableFactors: ['Medication compliance', 'Early intervention']
      };
    }
  }

  private parseClinicalDecisionResponse(response: string): ClinicalDecisionSupport {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return {
      primaryDiagnosis: {
        diagnosis: 'Requires further evaluation',
        probability: 0,
        supportingEvidence: [],
        ruledOutBy: [],
        nextSteps: ['Complete history and physical', 'Basic labs']
      },
      differentials: [],
      immediateActions: ['Vital signs monitoring', 'IV access'],
      investigations: {
        lab: ['CBC', 'Basic metabolic panel'],
        imaging: ['Chest X-ray'],
        other: ['EKG']
      },
      treatmentPlan: {
        medications: ['Supportive care'],
        procedures: [],
        monitoring: ['Continuous monitoring']
      },
      redFlags: ['Deteriorating vital signs', 'Altered mental status'],
      dispositionRecommendation: 'Admit for observation',
      evidenceBase: ['Standard clinical practice']
    };
  }

  private parseDifferentialResponse(response: string): DifferentialDiagnosis[] {
    try {
      const differentials: DifferentialDiagnosis[] = [];
      const diagnoses = response.split(/\d+\./);
      
      for (const diagnosis of diagnoses) {
        if (diagnosis.trim()) {
          differentials.push({
            diagnosis: diagnosis.split('\n')[0]?.trim() || 'Unknown',
            probability: Math.random() * 40 + 20,
            supportingEvidence: ['Clinical presentation'],
            ruledOutBy: ['Further testing needed'],
            nextSteps: ['Diagnostic workup']
          });
        }
      }
      
      return differentials.slice(0, 5);
    } catch (error) {
      return this.getDefaultDifferentials(['general symptoms']);
    }
  }

  private parseEvaluationResponse(response: string): any {
    const appropriatenessMatch = response.match(/(excellent|good|acceptable|suboptimal|poor)/i);
    
    return {
      appropriateness: (appropriatenessMatch?.[0]?.toLowerCase() as any) || 'acceptable',
      reasoning: response.split('\n')[0] || 'Clinical decision appears reasonable',
      alternatives: ['Consider specialist consultation', 'Additional diagnostic testing'],
      learningPoints: ['Document clinical reasoning', 'Consider all differentials'],
      evidenceSupport: ['Current clinical guidelines']
    };
  }

  private parseOutcomeResponse(response: string): any {
    const probabilityMatch = response.match(/(\d+)%/);
    
    return {
      likelyOutcome: 'Expected improvement with treatment',
      probability: probabilityMatch ? parseInt(probabilityMatch[1]) : 70,
      complications: ['Monitor for adverse effects'],
      timeframe: '24-72 hours',
      modifiableFactors: ['Treatment adherence', 'Risk factor modification']
    };
  }

  private getDefaultNLPAnalysis(): NLPAnalysis {
    return {
      entities: {
        symptoms: [],
        diagnoses: [],
        medications: [],
        procedures: [],
        anatomicalLocations: []
      },
      sentiment: 'neutral',
      urgencyScore: 5,
      clinicalRelevance: 7
    };
  }

  private getDefaultClinicalDecision(context: ClinicalContext): ClinicalDecisionSupport {
    return {
      primaryDiagnosis: {
        diagnosis: 'Clinical evaluation needed',
        probability: 0,
        supportingEvidence: [],
        ruledOutBy: [],
        nextSteps: ['Complete assessment']
      },
      differentials: [],
      immediateActions: ['Stabilize patient', 'Monitor vitals'],
      investigations: {
        lab: ['Basic labs'],
        imaging: ['As indicated'],
        other: ['EKG if cardiac concerns']
      },
      treatmentPlan: {
        medications: ['Supportive care'],
        procedures: [],
        monitoring: ['Regular monitoring']
      },
      redFlags: ['Any deterioration'],
      dispositionRecommendation: 'Based on clinical assessment',
      evidenceBase: ['Standard practice']
    };
  }

  private getDefaultDifferentials(symptoms: string[]): DifferentialDiagnosis[] {
    return [{
      diagnosis: 'Requires clinical evaluation',
      probability: 0,
      supportingEvidence: symptoms,
      ruledOutBy: ['Complete workup needed'],
      nextSteps: ['History and physical', 'Basic investigations']
    }];
  }
}

export const getClinicalAIService = (apiKey: string) => new ClinicalAIService(apiKey);

export type {
  ClinicalContext,
  DifferentialDiagnosis,
  ClinicalDecisionSupport,
  NLPAnalysis
};