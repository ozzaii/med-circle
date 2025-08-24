export interface MedicalBook {
  id: string;
  title: string;
  author: string;
  category: MedicalCategory;
  description: string;
  coverImage: string;
  pdfUrl?: string;
  content?: string;
  chapters?: Chapter[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keywords: string[];
  lastAccessed?: Date;
  progress?: number;
  bookmarkedPages?: number[];
  notes?: Note[];
}

export interface Chapter {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  subChapters?: SubChapter[];
  completed?: boolean;
}

export interface SubChapter {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
}

export interface Note {
  id: string;
  page: number;
  content: string;
  timestamp: Date;
  highlight?: {
    text: string;
    position: { x: number; y: number };
  };
}

export type MedicalCategory = 
  | 'anatomy'
  | 'physiology'
  | 'pathology'
  | 'pharmacology'
  | 'surgery'
  | 'internal-medicine'
  | 'pediatrics'
  | 'psychiatry'
  | 'radiology'
  | 'emergency-medicine'
  | 'clinical-skills'
  | 'medical-ethics'
  | 'cardiology'
  | 'oncology'
  | 'neurology';

export interface AIContext {
  bookId: string;
  currentPage?: number;
  currentChapter?: string;
  recentTopics: string[];
  userLevel: 'student' | 'resident' | 'physician' | 'specialist';
}

export interface AIResponse {
  id: string;
  query: string;
  response: string;
  context: AIContext;
  timestamp: Date;
  relatedConcepts?: string[];
  references?: Reference[];
  confidence: number;
}

export interface Reference {
  bookId: string;
  page: number;
  excerpt: string;
}

export interface UserProgress {
  userId: string;
  totalStudyTime: number;
  booksCompleted: number;
  currentStreak: number;
  achievements: Achievement[];
  weakAreas: WeakArea[];
  studyHistory: StudySession[];
  completedModules?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WeakArea {
  topic: string;
  category: MedicalCategory;
  score: number;
  lastReviewed: Date;
  suggestedResources: string[];
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime: Date;
  bookId: string;
  pagesRead: number;
  notesCreated: number;
  aiInteractions: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: MedicalCategory;
  relatedConcepts: string[];
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  duration: string;
  modules: LearningModule[];
  prerequisites: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  resources: string[];
  assessments: string[];
  estimatedTime: number;
  completed: boolean;
}