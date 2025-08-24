import type { MedicalBook } from '../types';

export const sampleBooks: MedicalBook[] = [
  {
    id: 'anatomy-101',
    title: 'Gray\'s Anatomy for Students',
    author: 'Richard Drake, A. Wayne Vogl, Adam W. M. Mitchell',
    category: 'anatomy',
    description: 'The most comprehensive and visually stunning anatomy textbook, featuring detailed illustrations and clinical correlations that bring anatomy to life.',
    coverImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop',
    difficulty: 'intermediate',
    keywords: ['anatomy', 'human body', 'medical illustration', 'clinical anatomy'],
    progress: 45,
    chapters: [
      {
        id: 'ch1',
        title: 'Introduction to Anatomy',
        pageStart: 1,
        pageEnd: 28,
        completed: true,
      },
      {
        id: 'ch2',
        title: 'Back',
        pageStart: 29,
        pageEnd: 98,
        completed: true,
      },
      {
        id: 'ch3',
        title: 'Thorax',
        pageStart: 99,
        pageEnd: 186,
        completed: false,
        subChapters: [
          { id: 'ch3-1', title: 'Chest Wall', pageStart: 99, pageEnd: 120 },
          { id: 'ch3-2', title: 'Mediastinum', pageStart: 121, pageEnd: 150 },
          { id: 'ch3-3', title: 'Pleural Cavities', pageStart: 151, pageEnd: 186 },
        ],
      },
    ],
  },
  {
    id: 'physiology-guide',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    author: 'John E. Hall, Michael E. Hall',
    category: 'physiology',
    description: 'The world\'s foremost medical physiology textbook, offering unparalleled depth in understanding how the human body functions at cellular and systemic levels.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=600&fit=crop',
    difficulty: 'advanced',
    keywords: ['physiology', 'body systems', 'cellular function', 'homeostasis'],
    progress: 23,
  },
  {
    id: 'pathology-basics',
    title: 'Robbins Basic Pathology',
    author: 'Vinay Kumar, Abul K. Abbas, Jon C. Aster',
    category: 'pathology',
    description: 'Essential pathology knowledge with stunning visual aids and clear explanations of disease mechanisms, perfect for medical students and residents.',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=600&fit=crop',
    difficulty: 'intermediate',
    keywords: ['pathology', 'disease', 'diagnosis', 'cellular pathology'],
    progress: 67,
  },
  {
    id: 'pharmacology-essentials',
    title: 'Katzung\'s Basic & Clinical Pharmacology',
    author: 'Bertram Katzung, Anthony Trevor',
    category: 'pharmacology',
    description: 'Comprehensive guide to pharmacology covering drug mechanisms, clinical applications, and the latest therapeutic developments.',
    coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=600&fit=crop',
    difficulty: 'advanced',
    keywords: ['drugs', 'pharmacology', 'therapeutics', 'drug interactions'],
    progress: 12,
  },
  {
    id: 'internal-medicine',
    title: 'Harrison\'s Principles of Internal Medicine',
    author: 'Dennis Kasper, Anthony Fauci, Stephen Hauser',
    category: 'internal-medicine',
    description: 'The most trusted resource in internal medicine, offering comprehensive coverage of pathophysiology and treatment of diseases.',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=600&fit=crop',
    difficulty: 'expert',
    keywords: ['internal medicine', 'diagnosis', 'treatment', 'clinical practice'],
    progress: 0,
  },
  {
    id: 'emergency-handbook',
    title: 'Tintinalli\'s Emergency Medicine Manual',
    author: 'Judith Tintinalli, J. Stephan Stapczynski',
    category: 'emergency-medicine',
    description: 'Quick-reference guide for emergency medicine practitioners with evidence-based protocols and life-saving procedures.',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=600&fit=crop',
    difficulty: 'advanced',
    keywords: ['emergency', 'acute care', 'trauma', 'critical care'],
    progress: 89,
  },
  {
    id: 'clinical-skills',
    title: 'Bates\' Guide to Physical Examination',
    author: 'Lynn Bickley, Peter Szilagyi',
    category: 'clinical-skills',
    description: 'Master the art of patient examination with this comprehensive guide featuring step-by-step techniques and clinical pearls.',
    coverImage: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=600&fit=crop',
    difficulty: 'beginner',
    keywords: ['physical exam', 'clinical skills', 'patient interaction', 'diagnosis'],
    progress: 78,
  },
  {
    id: 'radiology-fundamentals',
    title: 'Learning Radiology: Recognizing the Basics',
    author: 'William Herring',
    category: 'radiology',
    description: 'Essential radiology knowledge with clear explanations and numerous imaging examples to develop pattern recognition skills.',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=600&fit=crop',
    difficulty: 'intermediate',
    keywords: ['radiology', 'imaging', 'X-ray', 'MRI', 'CT scan'],
    progress: 34,
  },
];

// Helper function to get book content (for demo purposes)
export const getBookContent = (bookId: string, page: number): string => {
  // This would normally fetch actual PDF content
  // For demo, return sample medical content
  const sampleContent: Record<string, string> = {
    'anatomy-101': `Chapter 3: The Thorax

The thoracic cavity is bounded by the thoracic wall and contains vital organs including the heart, lungs, and great vessels. Understanding thoracic anatomy is crucial for interpreting clinical signs and symptoms.

Key Structures:
1. Thoracic Wall
   - Ribs and intercostal spaces
   - Muscles of respiration
   - Neurovascular supply

2. Mediastinum
   - Superior mediastinum: Contains great vessels, trachea, esophagus
   - Inferior mediastinum: Divided into anterior, middle, and posterior
   - The heart occupies the middle mediastinum

3. Pleural Cavities
   - Parietal and visceral pleura
   - Pleural recesses
   - Clinical significance of pleural effusions

Clinical Correlation:
Pneumothorax occurs when air enters the pleural space, causing lung collapse. Understanding the anatomy helps in performing emergency procedures like needle decompression at the 2nd intercostal space, midclavicular line.`,
    
    'physiology-guide': `Chapter 8: Cardiovascular Physiology

The cardiovascular system maintains tissue perfusion through coordinated cardiac and vascular function. This chapter explores the mechanisms of cardiac contraction, regulation of blood pressure, and tissue perfusion.

Cardiac Cycle:
1. Systole - Ventricular contraction
   - Isovolumetric contraction
   - Ejection phase
   
2. Diastole - Ventricular relaxation
   - Isovolumetric relaxation
   - Ventricular filling

Regulation of Cardiac Output:
CO = HR × SV
- Heart Rate regulation: Autonomic nervous system
- Stroke Volume determinants: Preload, afterload, contractility

Blood Pressure Regulation:
- Short-term: Baroreceptor reflex
- Long-term: Renin-angiotensin-aldosterone system`,
  };

  const bookContent = sampleContent[bookId];
  if (!bookContent) return 'Content not available for this page.';
  
  // Simulate different pages having different content
  return `Page ${page}\n\n${bookContent}\n\n[Additional content would appear here in actual implementation]`;
};