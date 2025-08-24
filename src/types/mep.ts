/**
 * Enhanced TypeScript Types for MEP (Medical Education Program) Integration
 * Compatible with existing MedCircle platform architecture
 */

// Import base types first
import type { 
  LearningModule, 
  MedicalCategory, 
  MedicalBook, 
  AIContext,
  UserProgress 
} from './index';

export interface MEPModule extends LearningModule {
  category: MedicalCategory;
  language: 'turkish' | 'english' | 'bilingual';
  aiPrompts: string[];
  clinicalCases: ClinicalCase[];
  requiredSkills: string[];
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'specialist';
  turkishMedicalTerms: { [key: string]: string };
  internationalGuidelines: string[];
  progressTracking: MEPProgress;
  aiPersonalization: AIPersonalization;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patient: PatientInfo;
  presentation: string;
  diagnosticApproach: string[];
  treatment: string[];
  learningObjectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  aiGuidedLearning: AIGuidedLearning;
  virtualPatient: VirtualPatientInteraction;
}

export interface PatientInfo {
  age: number;
  gender: 'male' | 'female';
  chiefComplaint: string;
  history: string;
  examination: string;
  investigations: string[];
  vitalSigns?: VitalSigns;
  labResults?: LabResults;
}

export interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
}

export interface LabResults {
  [testName: string]: {
    value: string | number;
    normalRange: string;
    unit: string;
    isAbnormal: boolean;
  };
}

export interface AIGuidedLearning {
  adaptiveQuestions: AdaptiveQuestion[];
  personalizedHints: string[];
  progressiveComplexity: boolean;
  realTimeFreedback: boolean;
  conceptMapping: string[];
}

export interface AdaptiveQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'open-ended' | 'image-based' | 'interactive';
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiHints: string[];
}

export interface VirtualPatientInteraction {
  enabled: boolean;
  scenarios: PatientScenario[];
  communicationSkills: CommunicationSkill[];
  empathyTraining: boolean;
}

export interface PatientScenario {
  id: string;
  scenario: string;
  patientPersonality: string;
  expectedInteractions: string[];
  evaluationCriteria: string[];
}

export interface CommunicationSkill {
  skill: string;
  description: string;
  practiceScenarios: string[];
  evaluationMethod: string;
}

export interface MEPProgress {
  completionPercentage: number;
  timeSpent: number; // in minutes
  skillsAcquired: string[];
  weakAreas: string[];
  strongAreas: string[];
  lastAccessed: Date;
  aiRecommendations: string[];
  nextMilestone: string;
}

export interface AIPersonalization {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  preferredLanguage: 'turkish' | 'english' | 'bilingual';
  difficultyPreference: 'gradual' | 'challenging' | 'adaptive';
  studySchedule: StudySchedule;
  personalizedContent: PersonalizedContent[];
}

export interface StudySchedule {
  dailyStudyTime: number; // in minutes
  preferredStudyTimes: string[];
  breakIntervals: number;
  weeklyGoals: string[];
}

export interface PersonalizedContent {
  contentType: 'video' | 'text' | 'interactive' | 'simulation';
  topic: string;
  personalizedFor: string[];
  adaptationReason: string;
}

// Turkish Medical Education Specific Types
export interface TurkishMedicalStandard {
  tepdadCompliance: boolean;
  tusPreparation: boolean;
  turkishGuidelines: string[];
  clinicalRotationRequirements: ClinicalRotation[];
  competencyMapping: TurkishCompetency[];
}

export interface ClinicalRotation {
  department: string;
  duration: number; // in weeks
  requiredCases: number;
  supervisorRequirements: string[];
  evaluationCriteria: string[];
}

export interface TurkishCompetency {
  competency: string;
  description: string;
  assessmentMethod: string[];
  milestones: string[];
}

// AI-Enhanced Learning Features
export interface IntelligentTutor {
  id: string;
  name: string;
  specialty: string;
  personality: 'supportive' | 'challenging' | 'encouraging' | 'analytical';
  turkishLanguageSupport: boolean;
  teachingMethods: string[];
}

export interface SmartAssessment {
  id: string;
  type: 'formative' | 'summative' | 'peer' | 'self';
  adaptiveScoring: boolean;
  instantFreedback: boolean;
  turkishLanguageSupport: boolean;
  aiProctoring: boolean;
}

export interface LearningAnalytics {
  userId: string;
  moduleId: string;
  engagementMetrics: EngagementMetrics;
  performanceMetrics: PerformanceMetrics;
  learningPatterns: LearningPattern[];
  predictiveInsights: PredictiveInsight[];
}

export interface EngagementMetrics {
  timeSpentPerSession: number[];
  interactionCount: number;
  contentCompletionRate: number;
  dropOffPoints: string[];
  reEngagementTriggers: string[];
}

export interface PerformanceMetrics {
  accuracyRate: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  strongConcepts: string[];
  weakConcepts: string[];
  masteryLevel: 'novice' | 'competent' | 'proficient' | 'expert';
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  context: string;
  recommendation: string;
}

export interface PredictiveInsight {
  insight: string;
  confidence: number;
  recommendation: string;
  timeline: string;
}

// Integration with existing MedCircle types
export interface EnhancedMedicalBook extends MedicalBook {
  mepModules?: MEPModule[];
  turkishTranslation?: boolean;
  aiEnhanced?: boolean;
  clinicalCasesIncluded?: boolean;
}

export interface EnhancedAIContext extends AIContext {
  mepModuleId?: string;
  clinicalCaseId?: string;
  turkishLanguagePreference?: boolean;
  learningObjectives?: string[];
  currentDifficulty?: string;
}

export interface MEPUserProgress extends UserProgress {
  mepModulesCompleted: string[];
  turkishProficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  clinicalSkillLevel: 'student' | 'resident' | 'specialist';
  preferredInstructionLanguage: 'turkish' | 'english' | 'bilingual';
  customLearningPath: string[];
}

// Export utility functions
export interface MEPUtilities {
  getModulesByLevel: (level: string) => MEPModule[];
  getRecommendedModules: (userProgress: MEPUserProgress) => MEPModule[];
  translateContent: (content: string, targetLanguage: 'turkish' | 'english') => Promise<string>;
  generatePersonalizedQuiz: (moduleId: string, difficulty: string) => Promise<AdaptiveQuestion[]>;
  trackProgress: (userId: string, moduleId: string, progress: MEPProgress) => void;
  generateAIInsights: (learningData: LearningAnalytics) => Promise<PredictiveInsight[]>;
}