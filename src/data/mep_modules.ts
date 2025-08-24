import type { MedicalCategory } from '../types';

// 🚨 REVOLUTIONARY CLINICAL CASES - DEEP IMPLEMENTATION
// Based on actual Turkish medical education content provided by DrOzlemYildirim

// Enhanced interfaces for complete clinical case implementation
export interface MEPModule {
  id: string;
  title: string;
  description: string;
  category: MedicalCategory;
  language: 'turkish' | 'english' | 'bilingual';
  resources: string[];
  assessments: string[];
  estimatedTime: number;
  completed: boolean;
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'specialist';
  aiPrompts: string[];
  clinicalCases: ClinicalCase[];
  requiredSkills: string[];
  turkishMedicalTerms: { [key: string]: string };
  internationalGuidelines: string[];
  progress?: {
    completionPercentage: number;
    timeSpent: number;
    lastAccessed?: Date;
  };
  // NEW: Complete decision tree system
  decisionPoints?: DecisionPoint[];
  scoringSystem?: ScoringSystem;
  timeConstraints?: TimeConstraint[];
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
  // NEW: Advanced clinical case features
  decisionTree: DecisionPoint[];
  vitalSigns: VitalSigns;
  labResults: LabResult[];
  imagingFindings?: string[];
  timeLimit?: number; // minutes
  scoringCriteria: ScoringCriteria[];
}

export interface PatientInfo {
  age: number;
  gender: 'male' | 'female';
  chiefComplaint: string;
  history: string;
  examination: string;
  investigations: string[];
  // NEW: Enhanced patient data
  comorbidities?: string[];
  medications?: string[];
  allergies?: string[];
  socialHistory?: string;
}

// NEW: Decision tree system for interactive cases
export interface DecisionPoint {
  id: string;
  timePoint: string; // e.g., "İlk 2 dakika", "30. dakika"
  scenario: string;
  question: string;
  options: DecisionOption[];
  correctAnswer: string;
  explanation: string;
  consequences: { [key: string]: string };
  timeLimit?: number; // seconds
  hints?: string[];
}

export interface DecisionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  points: number;
  riskImpact: number; // -3 to +3
  explanation: string;
  references?: string[];
}

export interface VitalSigns {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  glasgow?: number;
}

export interface LabResult {
  test: string;
  value: string;
  normalRange: string;
  significance: string;
}

export interface ScoringCriteria {
  category: string;
  maxPoints: number;
  description: string;
}

export interface ScoringSystem {
  totalPoints: number;
  categories: {
    name: string;
    points: number;
    weight: number;
  }[];
  performanceLevels: {
    score: number;
    label: string;
    description: string;
  }[];
}

export interface TimeConstraint {
  phase: string;
  duration: number; // minutes
  criticalActions: string[];
}

/**
 * 🚨 ACTUAL CLINICAL CASES FROM USER CONTENT
 * Revolutionary medical education with complete decision trees
 */

// 🚨 VAKA 1: ACİL SERVİSTTE SEPTİK ŞOK - COMPLETE IMPLEMENTATION
export const septicShockCase: MEPModule = {
  id: 'case-septic-shock-complete',
  title: '🚨 VAKA 1: ACİL SERVİSTTE SEPTİK ŞOK',
  description: 'Sepsis-3 kriterleri ve 1-saat bundle yönetimi - Tam karar ağacı ile interaktif öğrenme',
  category: 'emergency-medicine',
  language: 'bilingual',
  resources: [
    'Surviving Sepsis Campaign 2021 Guidelines',
    'IDSA Sepsis Management 2023 Update',
    'Turkish Society of Intensive Care Medicine Consensus',
    'qSOFA ve SOFA Skorlama Sistemleri'
  ],
  assessments: [
    'Interactive Decision Tree Assessment',
    '5-Point Clinical Decision Challenge',
    'Time-Constrained Management Simulation',
    'Turkish Emergency Medicine Protocol Test'
  ],
  estimatedTime: 45, // minutes
  completed: false,
  difficulty: 'advanced',
  aiPrompts: [
    'Sepsis-3 kriterlerine göre bu hasta nasıl değerlendirilir?',
    '1-saat bundle\'ın doğru sıralaması nedir?',
    'qSOFA vs SOFA skorları arasındaki fark nedir?',
    'Vazopresör başlama kriterleri nelerdir?',
    'Türk yoğun bakım kılavuzlarına göre optimal yaklaşım nedir?'
  ],
  clinicalCases: [{
    id: 'septic-shock-main-case',
    title: 'Septic Shock Decision Tree Challenge',
    patient: {
      age: 65,
      gender: 'female',
      chiefComplaint: 'Ateş, titreme ve bilinç bulanıklığı',
      history: 'Son 2 gündür artan ateş (39.2°C), idrar yaparken yanma, bugün sabahtan beri konuşmada yavaşlama',
      examination: 'Glasgow 13 (konfüze), cilt sıcak ve nemli, kapiller geri dolum 4 saniye',
      investigations: ['Kan kültürü', 'İdrar kültürü', 'Laktat', 'ABG', 'Tam kan sayımı', 'Biyokimya'],
      comorbidities: ['DM tip 2', 'Hipertansiyon'],
      medications: ['Metformin', 'ACE inhibitörü'],
      allergies: ['Penisilin alerjisi'],
      socialHistory: 'Non-smoker, sosyal içici değil'
    },
    presentation: '65 yaş kadın hasta, acil servise ateş, titreme ve bilinç bulanıklığı şikayetleri ile getirildi.',
    vitalSigns: {
      heartRate: 118,
      bloodPressure: '82/48 mmHg',
      temperature: 38.9,
      oxygenSaturation: 92,
      respiratoryRate: 26,
      glasgow: 13
    },
    labResults: [
      { test: 'Laktat', value: '4.2 mmol/L', normalRange: '<2 mmol/L', significance: 'Yüksek - doku perfüzyon bozukluğu' },
      { test: 'WBC', value: '18,500/μL', normalRange: '4,000-11,000/μL', significance: 'Yüksek - enfeksiyon bulgusu' },
      { test: 'CRP', value: '285 mg/L', normalRange: '<10 mg/L', significance: 'Çok yüksek - akut faz yanıtı' },
      { test: 'Kreatinin', value: '1.8 mg/dL', normalRange: '0.6-1.2 mg/dL', significance: 'Yüksek - böbrek yetmezliği' },
      { test: 'Prokalsitonin', value: '5.2 ng/mL', normalRange: '<0.25 ng/mL', significance: 'Çok yüksek - bakteriyel sepsis' }
    ],
    decisionTree: [
      {
        id: 'decision-1',
        timePoint: 'İlk 2 dakika',
        scenario: 'Hasta acil servise getirildi. Vital bulgularına göre ilk müdahale önceliğiniz nedir?',
        question: '❓ KARAR NOKTASI 1: İLK YAKLAŞIM\nZaman limiti: 2 dakika\n\nHastanın vital bulgularına göre ilk müdahale önceliğiniz nedir?',
        options: [
          {
            id: 'A',
            text: 'İmmediately start norepinephrine infusion',
            isCorrect: false,
            points: 0,
            riskImpact: 1,
            explanation: 'Vazopresör sıvı resüsitasyonundan sonra başlanmalı',
            references: ['Surviving Sepsis Campaign 2021']
          },
          {
            id: 'B',
            text: '30 mL/kg kristalloid sıvı resüsitasyonu',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! Septik şok\'ta ilk saat bundle\'ının en kritik komponenti sıvı resüsitasyonudur.',
            references: ['SSC 2021', 'SCCM Guidelines']
          },
          {
            id: 'C',
            text: 'Geniş spektrum antibiyotik başla',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'Antibiyotik önemli ama önce sıvı resüsitasyonu yapılmalı',
            references: ['IDSA Guidelines']
          },
          {
            id: 'D',
            text: 'Entübasyon hazırlığı yap',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Henüz entübasyon endikasyonu yok, önce sıvı ve destek tedavi'
          }
        ],
        correctAnswer: 'B',
        explanation: '💡 İpucu: Surviving Sepsis Campaign guidelines\'ı hatırlayın...\n\n✅ DOĞRU CEVAP: B) 30 mL/kg kristalloid sıvı resüsitasyonu\n\n📝 Açıklama: Septik şok\'ta ilk saat bundle\'ının en kritik komponenti sıvı resüsitasyonudur. Hipotansiyonu olan hastada önce 30 mL/kg kristalloid verilmelidir.',
        consequences: {
          'A': 'Prematüre vazopresör → sıvı resüsitasyonu gecikir',
          'B': 'Optimal başlangıç → MAP yükselme beklenir',
          'C': 'Sıvı gecikimi → hipotansiyon devam eder',
          'D': 'Gereksiz invaziv müdahale riski'
        },
        timeLimit: 120,
        hints: [
          'Sepsis bundle sıralaması kritik',
          'İlk önce perfüzyonu düzelt',
          'Vazopresör sıvıdan sonra gelir'
        ]
      },
      {
        id: 'decision-2',
        timePoint: '15. dakika - Lab Takibi',
        scenario: 'Başlangıç lab sonuçları geldi. Sıvı resüsitasyonu sonrası değerlendirme.',
        question: '❓ KARAR NOKTASI 2: LAB TAKİBİ\n\nBaşlangıç lab sonuçları geldi:\n• Laktat: 4.2 mmol/L (N: <2)\n• WBC: 18,500/μL (bands %15)\n• Kreatinin: 1.8 mg/dL (bazal 1.0)\n• Prokalsitonin: 5.2 ng/mL (N: <0.25)\n• Sıvı resüsitasyonu sonrası TA: 85/52 mmHg\n\nBir sonraki adımınız?',
        options: [
          {
            id: 'A',
            text: 'Kan kültürü + antibiyotik başla',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! MAP >65 mmHg sağlandığından vazopresöre henüz ihtiyaç yok. Şimdi odak araştırması (kültürler) ve 1 saat içinde antibiyotik şart.',
            references: ['Surviving Sepsis Campaign', 'IDSA 2023']
          },
          {
            id: 'B',
            text: 'Vazopresör (norepinephrine) başla',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'MAP 58 mmHg, henüz vazopresör eşiği değil (MAP <65)',
            references: ['SSC Guidelines']
          },
          {
            id: 'C',
            text: 'CVVH hazırlığı yap',
            isCorrect: false,
            points: 0,
            riskImpact: 1,
            explanation: 'Henüz renal replasman tedavi endikasyonu yok'
          },
          {
            id: 'D',
            text: 'Steroid başla',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Steroid vazopresör ihtiyacı olan hastalarda düşünülür'
          }
        ],
        correctAnswer: 'A',
        explanation: '✅ DOĞRU CEVAP: A) Kan kültürü + antibiyotik başla\n\n📝 Açıklama: MAP >65 mmHg sağlandığından vazopresöre henüz ihtiyaç yok. Şimdi odak araştırması (kültürler) ve 1 saat içinde antibiyotik şart.',
        consequences: {
          'A': 'Optimal sepsis bundle devam → kaynak kontrol',
          'B': 'Erken vazopresör → gereksiz risk',
          'C': 'Premature CVVH → komplikasyon riski',
          'D': 'Erken steroid → enfeksiyon kontrolü gecikir'
        },
        timeLimit: 90
      },
      {
        id: 'decision-3',
        timePoint: '45. dakika - Antibiyotik Seçimi',
        scenario: 'İdrar kültüründe gram-pozitif kokklar görüldü.',
        question: '❓ KARAR NOKTASI 3: ANTİBİYOTİK SEÇİMİ\n\nİdrar kültüründe gram-pozitif kokklar görüldü.\n\nEn uygun empirik antibiyotik tedavi?',
        options: [
          {
            id: 'A',
            text: 'Piperacillin-tazobactam + Vancomycin',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! Kompllike üriner enfeksiyon + septik şok\'ta ESBL ve MRSA coverage gereklidir.',
            references: ['IDSA UTI Guidelines', 'Sepsis Guidelines']
          },
          {
            id: 'B',
            text: 'Ceftriaxone monoterapi',
            isCorrect: false,
            points: 5,
            riskImpact: 2,
            explanation: 'Yetersiz spektrum, septik şokta geniş spektrum gerekli',
            references: ['IDSA Guidelines']
          },
          {
            id: 'C',
            text: 'Meropenem monoterapi',
            isCorrect: false,
            points: 15,
            riskImpact: 0,
            explanation: 'Gram negatif coverage iyi ama MRSA coverage eksik',
            references: ['Antimicrobial Guidelines']
          },
          {
            id: 'D',
            text: 'Ampicillin-sulbactam',
            isCorrect: false,
            points: 0,
            riskImpact: 3,
            explanation: 'Yetersiz spektrum, septik şokta uygun değil'
          }
        ],
        correctAnswer: 'A',
        explanation: '✅ DOĞRU CEVAP: A) Piperacillin-tazobactam + Vancomycin\n\n📝 Açıklama: Kompllike üriner enfeksiyon + septik şok\'ta ESBL ve MRSA coverage gereklidir.',
        consequences: {
          'A': 'Optimal antimikrobiyal spektrum → enfeksiyon kontrolü',
          'B': 'Yetersiz tedavi → klinik kötüleşme riski',
          'C': 'MRSA coverage eksik → dirençli enfeksiyon riski',
          'D': 'Ciddi yetersiz tedavi → mortalite riski'
        },
        timeLimit: 60
      },
      {
        id: 'decision-4',
        timePoint: '3. saat - Takip Değerlendirmesi',
        scenario: '3. saatte: TA: 78/45 mmHg (MAP: 56 mmHg), Laktat: 3.8 mmol/L, İdrar çıkışı: 15 mL/saat',
        question: '❓ KARAR NOKTASI 4: TAKİP\n\n3. saatte:\n• TA: 78/45 mmHg (MAP: 56 mmHg)\n• Laktat: 3.8 mmol/L\n• İdrar çıkışı: 15 mL/saat\n\nGerekli müdahale?',
        options: [
          {
            id: 'A',
            text: 'Daha fazla sıvı ver (ek 1000 mL)',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Zaten 30 mL/kg verildi, şimdi vazopresör zamanı',
            references: ['Fluid Responsiveness Studies']
          },
          {
            id: 'B',
            text: 'Norepinephrine infüzyon başla',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! 30 mL/kg sıvı sonrası MAP <65 mmHg ise vazopresör endikasyonu vardır. Norepinephrine birinci seçenektir.',
            references: ['Surviving Sepsis Campaign', 'Vasopressor Guidelines']
          },
          {
            id: 'C',
            text: 'Dobutamine ekle',
            isCorrect: false,
            points: 10,
            riskImpact: 1,
            explanation: 'İnotropik ajan, önce vazokonstriksiyon gerekli',
            references: ['Hemodynamic Guidelines']
          },
          {
            id: 'D',
            text: 'Hemodiyaliz başla',
            isCorrect: false,
            points: 0,
            riskImpact: 2,
            explanation: 'Henüz RRT endikasyonu yok, önce hemodinami düzelmeli'
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) Norepinephrine infüzyon başla\n\n📝 Açıklama: 30 mL/kg sıvı sonrası MAP <65 mmHg ise vazopresör endikasyonu vardır. Norepinephrine birinci seçenektir.',
        consequences: {
          'A': 'Sıvı yüklenmesi → pulmoner ödem riski',
          'B': 'Optimal vazopresör → MAP düzelme beklenir',
          'C': 'İnotropik etki ama vazodilatör → MAP düşer',
          'D': 'Premature RRT → komplikasyon riski'
        },
        timeLimit: 90
      },
      {
        id: 'decision-5',
        timePoint: '12. saat - Prognoz Değerlendirmesi',
        scenario: '12. saatte: MAP: 68 mmHg, Laktat: 2.1 mmol/L, İdrar çıkışı: 45 mL/saat, Bilinci açık',
        question: '❓ KARAR NOKTASI 5: PROGNOZ DEĞERLENDİRME\n\n12. saatte:\n• MAP: 68 mmHg (norepinephrine 0.1 μg/kg/dk)\n• Laktat: 2.1 mmol/L\n• İdrar çıkışı: 45 mL/saat\n• Bilinci açık, koopere\n\nBu hastanın kısa dönem prognozunu nasıl değerlendirirsiniz?',
        options: [
          {
            id: 'A',
            text: 'Mortalite riski %60-80 (çok yüksek)',
            isCorrect: false,
            points: 5,
            riskImpact: 0,
            explanation: 'Çok kötümser, hastada iyileşme bulguları var',
            references: ['SOFA Score Studies']
          },
          {
            id: 'B',
            text: 'Mortalite riski %30-40 (orta-yüksek)',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'Hala kötümser, iyileşme belirgin',
            references: ['Sepsis Outcome Studies']
          },
          {
            id: 'C',
            text: 'Mortalite riski %10-15 (düşük)',
            isCorrect: true,
            points: 20,
            riskImpact: -1,
            explanation: 'Doğru! Erken tanı + uygun tedavi ile laktat clearing + organ fonksiyon düzelimi olması prognozu iyileştirir.',
            references: ['Sepsis Outcome Predictors', 'SOFA Trend Analysis']
          },
          {
            id: 'D',
            text: 'Tam iyileşme garantili',
            isCorrect: false,
            points: 0,
            riskImpact: -1,
            explanation: 'Aşırı iyimser, sepsis her zaman risk taşır'
          }
        ],
        correctAnswer: 'C',
        explanation: '✅ DOĞRU CEVAP: C) Mortalite riski %10-15 (düşük)\n\n📝 Açıklama: Erken tanı + uygun tedavi ile laktat clearing + organ fonksiyon düzelimi olması prognozu iyileştirir.',
        consequences: {
          'A': 'Aşırı kötümser → hasta ve aile kaygısı',
          'B': 'Kötümser → gereksiz yoğun müdahale',
          'C': 'Gerçekçi prognoz → uygun planlama',
          'D': 'Aşırı iyimser → dikkat azalması riski'
        },
        timeLimit: 120
      }
    ],
    diagnosticApproach: [
      'qSOFA ve SOFA skorlaması',
      'Sepsis-3 kriterlerine göre değerlendirme',
      'Kaynak enfeksiyon araştırması',
      'Organ yetmezliği değerlendirmesi',
      'Hemodinamik monitörizasyon'
    ],
    treatment: [
      '1-Saat Bundle uygulaması',
      '30 mL/kg kristalloid resüsitasyonu',
      'Kültür + geniş spektrum antibiyotik',
      'Vazopresör desteği (MAP >65 mmHg)',
      'Kaynak kontrolü'
    ],
    learningObjectives: [
      'Sepsis-3 kriterlerini uygulayabilmek',
      '1-saat bundle\'ı doğru sırada yapabilmek',
      'Vazopresör başlama kriterlerini bilmek',
      'Antibiyotik seçimini uygun yapabilmek',
      'Prognoz değerlendirmesi yapabilmek'
    ],
    difficulty: 'hard',
    timeLimit: 45, // minutes for complete case
    scoringCriteria: [
      { category: 'Kritik Kararlar', maxPoints: 60, description: 'Doğru sıralama ve zamanında müdahale' },
      { category: 'Zaman Performansı', maxPoints: 25, description: 'Hızlı ve doğru karar verme' },
      { category: 'Komplikasyon Riski', maxPoints: 15, description: 'Risk minimizasyonu' }
    ]
  }],
  requiredSkills: [
    'Sepsis tanı kriterleri',
    'Emergency resuscitation',
    'Antibiotic stewardship',
    'Hemodynamic monitoring',
    'Critical care principles',
    'Turkish emergency protocols'
  ],
  turkishMedicalTerms: {
    'sepsis': 'sepsis',
    'septic shock': 'septik şok',
    'resuscitation': 'resüsitasyon',
    'vasopressor': 'vazopresör',
    'norepinephrine': 'norepinefrin',
    'crystalloid': 'kristalloid',
    'antibiotic': 'antibiyotik',
    'source control': 'kaynak kontrolü',
    'lactate clearance': 'laktat klirensı',
    'mean arterial pressure': 'ortalama arter basıncı'
  },
  internationalGuidelines: [
    'Surviving Sepsis Campaign 2021 Guidelines',
    'IDSA Sepsis Management 2023 Update',
    'Turkish Society of Intensive Care Medicine Consensus',
    'SCCM/ESICM Sepsis Guidelines'
  ],
  scoringSystem: {
    totalPoints: 100,
    categories: [
      { name: 'Kritik Kararlar', points: 60, weight: 0.6 },
      { name: 'Zaman Yönetimi', points: 25, weight: 0.25 },
      { name: 'Risk Yönetimi', points: 15, weight: 0.15 }
    ],
    performanceLevels: [
      { score: 90, label: 'Uzman Seviyesi', description: 'Sepsis yönetiminde excellence' },
      { score: 75, label: 'Yetkin Seviyesi', description: 'İyi klinik performans' },
      { score: 60, label: 'Geliştirilmeli', description: 'Temel bilgi var, pratik gerekli' },
      { score: 0, label: 'Ciddi Eğitim İhtiyacı', description: 'Kapsamlı eğitim gerekli' }
    ]
  },
  timeConstraints: [
    { phase: 'İlk Değerlendirme', duration: 2, criticalActions: ['ABC', 'Vital signs', 'qSOFA'] },
    { phase: 'Resüsitasyon Başlangıcı', duration: 15, criticalActions: ['30 mL/kg sıvı', 'Kan kültürü', 'IV access'] },
    { phase: '1-Saat Bundle', duration: 60, criticalActions: ['Antibiyotik', 'Kaynak araştırma', 'Laktat follow-up'] },
    { phase: 'Vazopresör Değerlendirmesi', duration: 180, criticalActions: ['MAP monitoring', 'Norepinephrine', 'İdrar takibi'] },
    { phase: 'İyileşme İzlemi', duration: 720, criticalActions: ['Laktat clearing', 'Organ fonksiyon', 'Prognoz'] }
  ]
};

/**
 * 💔 VAKA 2: STEMI AKUT YÖNETİMİ - COMPLETE IMPLEMENTATION
 */
export const stemiCase: MEPModule = {
  id: 'case-stemi-complete',
  title: '💔 VAKA 2: STEMI AKUT YÖNETİMİ',
  description: 'Door-to-balloon optimization ve RV infarkt yönetimi - Tam protokol implementasyonu',
  category: 'cardiology',
  language: 'bilingual',
  resources: [
    '2023 ACC/AHA STEMI Guidelines',
    '2017 ESC STEMI Management',
    'TSC (Türk Kardiyoloji Derneği) Konsensus 2022',
    'Door-to-Balloon Quality Measures'
  ],
  assessments: [
    'EKG İnterpretasyon Challenge',
    'Reperfusion Strategy Selection',
    'Door-to-Balloon Time Optimization',
    'RV Infarct Management Protocol'
  ],
  estimatedTime: 40,
  completed: false,
  difficulty: 'advanced',
  aiPrompts: [
    'Bu EKG bulgularının anatomik korelasyonu nedir?',
    'Door-to-balloon vs door-to-needle kararı nasıl verilir?',
    'RV infarkt bulguları nasıl değerlendirilir?',
    'Reperfusion stratejisi seçim kriterleri nelerdir?',
    'Türk kardiyoloji kılavuzlarına göre optimal yaklaşım?'
  ],
  clinicalCases: [{
    id: 'stemi-main-case',
    title: 'STEMI Management Decision Challenge',
    patient: {
      age: 58,
      gender: 'male',
      chiefComplaint: 'Göğüs ağrısı ve terleme',
      history: '2 saat önce başlayan, crushing tarzı göğüs ağrısı, sol kola yayılan ağrı, terleme',
      examination: 'S4 galop (+), mitral üfürüm yok, akciğer bazillerde minimal raller',
      investigations: ['12-derivasyon EKG', '18-lead EKG', 'Kardiyak enzimler', 'Akciğer grafisi'],
      comorbidities: ['Sigara (20 paket/yıl)', 'Hipertansiyon'],
      medications: ['ACE inhibitörü'],
      allergies: ['Bilinen ilaç alerjisi yok'],
      socialHistory: 'Aile öyküsünde erken koroner hastalık (+)'
    },
    presentation: '58 yaş erkek hasta, göğüs ağrısı şikayeti ile acil servise başvurdu.',
    vitalSigns: {
      heartRate: 68,
      bloodPressure: '140/85 mmHg',
      temperature: 36.5,
      oxygenSaturation: 96,
      respiratoryRate: 18
    },
    labResults: [
      { test: 'Troponin I', value: '25.6 ng/mL', normalRange: '<0.04 ng/mL', significance: 'Çok yüksek - akut MI' },
      { test: 'CK-MB', value: '45 ng/mL', normalRange: '<6.3 ng/mL', significance: 'Yüksek - miyokard hasarı' },
      { test: 'D-dimer', value: '150 ng/mL', normalRange: '<500 ng/mL', significance: 'Normal' },
      { test: 'NT-proBNP', value: '450 pg/mL', normalRange: '<125 pg/mL', significance: 'Yüksek - kalp yetmezliği riski' }
    ],
    imagingFindings: [
      'EKG: ST elevasyonu D2, D3, aVF derivasyonlarında (3mm)',
      '18-lead EKG: V3R, V4R derivasyonlarında ST elevasyonu (+)',
      'Akciğer grafisi: Kardiyomegali yok, pulmoner konjesyon yok'
    ],
    decisionTree: [
      {
        id: 'stemi-decision-1',
        timePoint: 'İlk 10 dakika - Tanısal Yaklaşım',
        scenario: 'EKG: ST elevasyonu D2, D3, aVF derivasyonlarında. Bu EKG bulguları hangi koroner anatomiyi işaret eder?',
        question: '❓ KARAR NOKTASI 1: TANSAL YAKLAŞİM\nZaman limiti: 3 dakika\n\nBu EKG bulguları hangi koroner anatomiyi işaret eder?',
        options: [
          {
            id: 'A',
            text: 'LAD (Left Anterior Descending) proksimal oklüzyon',
            isCorrect: false,
            points: 0,
            riskImpact: 1,
            explanation: 'LAD oklüzyonu anterior derivasyonlarda (V1-V6) ST elevasyonu yapar',
            references: ['EKG Interpretation Guide']
          },
          {
            id: 'B',
            text: 'RCA (Right Coronary Artery) oklüzyon',
            isCorrect: true,
            points: 25,
            riskImpact: -1,
            explanation: 'Doğru! D2, D3, aVF\'de ST elevasyonu inferior MI\'yi gösterir ve tipik olarak RCA oklüzyonuna bağlıdır.',
            references: ['Coronary Anatomy', 'EKG Localization']
          },
          {
            id: 'C',
            text: 'LCX (Left Circumflex) oklüzyon',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'LCX genelde lateral derivasyonlarda (I, aVL, V5-V6) değişiklik yapar',
            references: ['Coronary Territory Guide']
          },
          {
            id: 'D',
            text: 'Left main coronary artery oklüzyon',
            isCorrect: false,
            points: 5,
            riskImpact: 2,
            explanation: 'Left main tüm anterior derivasyonlarda yaygın ST değişiklikleri yapar',
            references: ['High-risk ACS Guidelines']
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) RCA (Right Coronary Artery) oklüzyon\n\n📝 Açıklama: D2, D3, aVF\'de ST elevasyonu inferior MI\'yi gösterir ve tipik olarak RCA oklüzyonuna bağlıdır.',
        consequences: {
          'A': 'Yanlış lokalizasyon → yanlış risk değerlendirmesi',
          'B': 'Doğru tanı → uygun reperfüzyon stratejisi',
          'C': 'Anatomik hata → komplikasyon gözden kaçabilir',
          'D': 'Aşırı alarm → gereksiz yoğun müdahale'
        },
        timeLimit: 180
      },
      {
        id: 'stemi-decision-2',
        timePoint: '15. dakika - Komplikasyon Araştırması',
        scenario: '18-lead EKG: V3R, V4R derivasyonlarında ST elevasyonu (+). Bu bulgu ne anlama gelir?',
        question: '❓ KARAR NOKTASI 2: KOMPLİKASYON ARAŞTIRMASI\n\n18-lead EKG: V3R, V4R derivasyonlarında ST elevasyonu (+)\n\nBu bulgu ne anlama gelir?',
        options: [
          {
            id: 'A',
            text: 'Posterior MI eklendi',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'Posterior MI için V7-V9 derivasyonları gerekli',
            references: ['Posterior MI Diagnosis']
          },
          {
            id: 'B',
            text: 'Sağ ventrikül infarktı var',
            isCorrect: true,
            points: 25,
            riskImpact: -2,
            explanation: 'Doğru! Inferior MI + sağ prekordiyel derivasyonlarda ST elevasyonu RV infarktını gösterir. Bu durum özel yönetim gerektirir.',
            references: ['RV Infarct Guidelines', 'Right Heart Catheterization']
          },
          {
            id: 'C',
            text: 'Atriyal infarkt mevcut',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Atriyal infarkt çok nadir ve farklı EKG bulguları verir',
            references: ['Rare MI Patterns']
          },
          {
            id: 'D',
            text: 'Sadece artifakt',
            isCorrect: false,
            points: 0,
            riskImpact: 3,
            explanation: 'V4R\'de ST elevasyonu ciddi bulgu, göz ardı edilmemeli',
            references: ['EKG Artifact Recognition']
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) Sağ ventrikül infarktı var\n\n📝 Açıklama: Inferior MI + sağ prekordiyel derivasyonlarda ST elevasyonu RV infarktını gösterir. Bu durum özel yönetim gerektirir.',
        consequences: {
          'A': 'Yanlış tanı → yanlış tedavi yaklaşımı',
          'B': 'Doğru tanı → RV infarkt protokolü başlar',
          'C': 'Nadır tanı → gereksiz araştırma',
          'D': 'Kritik bulgu gözden kaçar → RV yetmezliği riski'
        },
        timeLimit: 120
      },
      {
        id: 'stemi-decision-3',
        timePoint: '25. dakika - Reperfüzyon Stratejisi',
        scenario: 'Hastane durumu: Primer PCI imkanı YOK, En yakın PCI merkezi 90 dakika uzaklıkta, tPA stoku mevcut, Semptom başlangıcı: 2.5 saat önce',
        question: '❓ KARAR NOKTASI 3: REPERFÜZİON STRATEJİSİ\n\nHastane durumu:\n• Primer PCI imkanı YOK\n• En yakın PCI merkezi 90 dakika uzaklıkta\n• tPA stoku mevcut\n• Semptom başlangıcı: 2.5 saat önce\n\nEn uygun reperfüzyon stratejisi?',
        options: [
          {
            id: 'A',
            text: 'İmmediately tPA + transfer for rescue PCI if needed',
            isCorrect: true,
            points: 30,
            riskImpact: -2,
            explanation: 'Doğru! Door-to-balloon time >120 dk ise fibrinolitik tedavi önceliklidir (door-to-needle <30 dk hedefi).',
            references: ['Reperfusion Strategy Guidelines', 'STEMI Networks']
          },
          {
            id: 'B',
            text: 'Transfer for primary PCI (2 saatlik transport)',
            isCorrect: false,
            points: 15,
            riskImpact: 1,
            explanation: 'Transfer süre >120dk, fibrinolitik daha avantajlı',
            references: ['Door-to-Balloon Guidelines']
          },
          {
            id: 'C',
            text: 'Conservative management (no reperfusion)',
            isCorrect: false,
            points: 0,
            riskImpact: 3,
            explanation: 'STEMI\'de reperfüzyon mutlak endikasyon',
            references: ['STEMI Guidelines']
          },
          {
            id: 'D',
            text: 'Heparin + antiaggregant therapy only',
            isCorrect: false,
            points: 5,
            riskImpact: 3,
            explanation: 'Medical therapy tek başına yetersiz',
            references: ['Antiplatelet Guidelines']
          }
        ],
        correctAnswer: 'A',
        explanation: '✅ DOĞRU CEVAP: A) İmmediately tPA + transfer for rescue PCI if needed\n\n📝 Açıklama: Door-to-balloon time >120 dk ise fibrinolitik tedavi önceliklidir (door-to-needle <30 dk hedefi).',
        consequences: {
          'A': 'Optimal reperfusion → miyokard kurtarma maksimal',
          'B': 'Geciken reperfusion → daha fazla miyokard kaybı',
          'C': 'Reperfusion yok → masif infarkt riski',
          'D': 'Yetersiz tedavi → kötü prognoz'
        },
        timeLimit: 180
      }
    ],
    diagnosticApproach: [
      '12-derivasyon EKG analizi',
      '18-lead EKG (RV derivasyonları)',
      'Kardiyak biomarker ölçümü',
      'Reperfusion stratejisi belirleme',
      'Door-to-needle/balloon zaman optimizasyonu'
    ],
    treatment: [
      'Dual antiplatelet therapy (ASA + P2Y12)',
      'Fibrinolitik tedavi (tPA)',
      'Antikoagülan tedavi',
      'RV infarkt özel yönetimi',
      'Rescue PCI hazırlığı'
    ],
    learningObjectives: [
      'STEMI tanı kriterlerini uygulamak',
      'RV infarkt bulgularını tanımak',
      'Reperfusion strategy seçimi yapabilmek',
      'Door-to-needle time optimize etmek',
      'Post-MI komplikasyonları öngörmek'
    ],
    difficulty: 'hard',
    timeLimit: 40,
    scoringCriteria: [
      { category: 'Tanısal Doğruluk', maxPoints: 30, description: 'EKG yorumu ve komplikasyon tanıma' },
      { category: 'Reperfusion Zamanlaması', maxPoints: 35, description: 'Doğru strateji ve timing' },
      { category: 'Komplikasyon Yönetimi', maxPoints: 25, description: 'RV infarkt ve hipotansiyon' },
      { category: 'Transfer Kararı', maxPoints: 10, description: 'Risk-benefit değerlendirme' }
    ]
  }],
  requiredSkills: [
    'EKG interpretation',
    'Coronary anatomy knowledge',
    'Reperfusion strategies',
    'RV infarct management',
    'Time-critical decision making',
    'Turkish cardiology protocols'
  ],
  turkishMedicalTerms: {
    'STEMI': 'ST elevasyonlu miyokard infarktüsü',
    'primary PCI': 'primer perkütan koroner girişim',
    'door-to-balloon': 'kapı-balon süresi',
    'door-to-needle': 'kapı-iğne süresi',
    'fibrinolytic': 'fibrinolitik',
    'reperfusion': 'reperfüzyon',
    'RV infarct': 'sağ ventrikül infarktı',
    'rescue PCI': 'kurtarma PGİ',
    'dual antiplatelet': 'ikili antiplatelet',
    'biomarkers': 'biyobelirteçler'
  },
  internationalGuidelines: [
    '2023 ACC/AHA STEMI Guidelines',
    '2017 ESC STEMI Management',
    'Turkish Society of Cardiology Consensus 2022',
    'Door-to-Balloon Quality Measures'
  ]
};

// 🚨 VAKA 3: STATUS EPİLEPTİKUS - NEUROLOGİ ACİL DURUMU
export const statusEpilepticusCase: MEPModule = {
  id: 'case-status-epilepticus-complete',
  title: '⚡ VAKA 3: STATUS EPİLEPTİKUS - NEUROLOJİK ACİL DURUM',
  description: 'Status epilepticus - nörolojik acil durum yönetimi ve stepwise approach. Türk Nöroloji Derneği kılavuzları ile uyumlu tam protokol.',
  category: 'emergency-medicine',
  language: 'bilingual',
  resources: [
    'Status Epilepticus Management Protocol',
    'AES Guidelines 2023',
    'Turkish Neurology Society Guidelines',
    'EEG interpretation basics'
  ],
  assessments: ['Decision Tree Analysis', 'Time-Critical Management', 'Drug Selection Rationale'],
  estimatedTime: 2.5,
  completed: false,
  difficulty: 'advanced',
  aiPrompts: [
    'CRITICAL: Status epilepticus tanı ve tedavi protokolünü Türk kılavuzları ile karşılaştır',
    'Anti-epileptik ilaç seçiminde pediatrik vs adult farklılıkları',
    'EEG monitorizasyon gerekliliği ve timing'
  ],
  requiredSkills: [
    'Status epilepticus immediate recognition',
    'Stepwise anti-epileptic drug protocol',
    'Airway management in seizures',
    'EEG interpretation basics',
    'Turkish neurology guidelines compliance'
  ],
  turkishMedicalTerms: {
    'status epilepticus': 'status epileptikus',
    'convulsive SE': 'konvülsif SE',
    'non-convulsive SE': 'non-konvülsif SE',
    'breakthrough seizures': 'breakthrough nöbetler',
    'refractory SE': 'refrakter SE',
    'super-refractory SE': 'süper-refrakter SE'
  },
  internationalGuidelines: [
    '2023 AES Status Epilepticus Guidelines',
    'Turkish Neurology Society Consensus 2022',
    '2019 ESICM/EAN Guidelines'
  ],
  clinicalCases: [{
    id: 'status-epilepticus-main',
    title: '⚡ 28Y Male - Status Epilepticus',
    patient: {
      age: 28,
      gender: 'male',
      chiefComplaint: 'Sürekli nöbet, 15 dakikadır durmayan',
      history: 'Epilepsi tanısı yok, alkol kullanım öyküsü var, 15 dakikadır sürekli tonik-klonik nöbet',
      examination: 'Bilinçsiz, sürekli nöbet aktivitesi, refleksler hiperrefletik',
      investigations: ['EEG', 'Kraniyal CT', 'Glukoz', 'Elektrolit paneli'],
      comorbidities: ['Alkol kullanım bozukluğu']
    },
    presentation: '28 yaşında erkek hasta, 15 dakikadır sürekli tonik-klonik nöbet geçiriyor. Ailesi geç fark etmiş, ambulans çağırılmış.',
    vitalSigns: {
      heartRate: 135,
      bloodPressure: '165/95',
      temperature: 38.2,
      respiratoryRate: 28,
      oxygenSaturation: 89,
      glasgow: 6
    },
    labResults: [
      { test: 'Glukoz', value: '65 mg/dL (Düşük)', normalRange: '70-110 mg/dL', significance: 'abnormal' },
      { test: 'Na', value: '128 mEq/L (Düşük)', normalRange: '135-145 mEq/L', significance: 'abnormal' },
      { test: 'Laktat', value: '4.8 mmol/L (Yüksek)', normalRange: '<2.0 mmol/L', significance: 'critical' },
      { test: 'pH', value: '7.28 (Asidoz)', normalRange: '7.35-7.45', significance: 'critical' },
      { test: 'Alkol', value: '180 mg/dL (Yüksek)', normalRange: '0 mg/dL', significance: 'abnormal' }
    ],
    decisionTree: [
      {
        id: 'se-decision-1',
        timePoint: 'İlk 5 dakika - Acil Müdahale',
        scenario: '15 dakikadır sürekli nöbet geçiren hasta acil servise getirildi. SaO2: %89, nabız: 135/dk',
        question: '❓ KARAR NOKTASI 1: HAVAYOLU ve İLK MÜDAHALE\nZaman limiti: 2 dakika\n\nStatus epilepticus tanısı konuldu. İlk önceliğiniz nedir?',
        options: [
          {
            id: 'A',
            text: 'IV lorazepam 4mg yavaş push',
            isCorrect: false,
            points: 15,
            riskImpact: 0,
            explanation: 'IV benzodiazepine geçmeden önce havayolu güvenliği sağlanmalı',
            references: ['AES Guidelines 2023']
          },
          {
            id: 'B',
            text: 'Havayolu güvenliği + O2 + IV access',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! Status epilepticus\'ta ilk öncelik havayolu güvenliği, oksijenizasyon ve IV erişim',
            references: ['Turkish Emergency Medicine Guidelines']
          },
          {
            id: 'C',
            text: 'Derhal entübasyon hazırlığı',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Premature entübasyon. Önce benzodiazepine denenebilir'
          },
          {
            id: 'D',
            text: 'EEG monitoring başlat',
            isCorrect: false,
            points: 0,
            riskImpact: 2,
            explanation: 'EEG sonraya bırakılır, acil müdahale öncelik'
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) Havayolu güvenliği + O2 + IV access\n\n📝 Açıklama: Status epilepticus\'ta ABC yaklaşımı kritik. Havayolu, solunum, dolaşım güvenliği öncelik.',
        consequences: {
          'A': 'Havayolu güvenliği risk altında',
          'B': 'Optimal başlangıç → güvenli ilaç uygulaması',
          'C': 'Gereksiz invaziv müdahale riski',
          'D': 'Kritik zaman kaybı'
        },
        timeLimit: 120,
        hints: ['ABC yaklaşımı unutma', 'İV erişim şart', 'Oksijenizasyon kritik']
      },
      {
        id: 'se-decision-2',
        timePoint: '7. dakika - Benzodiazepin Aşaması',
        scenario: 'Havayolu güvenliği sağlandı, IV erişim var, O2 verildi. Nöbet devam ediyor.',
        question: '❓ KARAR NOKTASI 2: BENZODİAZEPİN SEÇİMİ\n\nHavayolu güvenliği sağlandı, IV erişim mevcut. Nöbet 20 dakikadır devam ediyor.\n\nİlk line benzodiazepin seçiminiz?',
        options: [
          {
            id: 'A',
            text: 'Midazolam 10mg IM',
            isCorrect: false,
            points: 10,
            riskImpact: 0,
            explanation: 'IV erişim var ise IV tercih edilir',
            references: ['AES Guidelines']
          },
          {
            id: 'B',
            text: 'Lorazepam 0.1mg/kg IV (max 4mg)',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! IV lorazepam first-line, daha uzun etki süresi',
            references: ['AES 2023', 'Turkish Neurology Guidelines']
          },
          {
            id: 'C',
            text: 'Diazepam 0.15mg/kg IV',
            isCorrect: false,
            points: 15,
            riskImpact: -1,
            explanation: 'Alternatif seçenek ama lorazepam preferred',
            references: ['WHO Guidelines']
          },
          {
            id: 'D',
            text: 'Phenytoin 20mg/kg yükleme',
            isCorrect: false,
            points: 5,
            riskImpact: 1,
            explanation: 'Phenytoin 2nd line, önce benzodiazepin denenmelidir'
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) Lorazepam 0.1mg/kg IV (max 4mg)\n\n📝 Açıklama: Lorazepam first-line IV benzodiazepin, uzun etki süresi ve etkili penetrasyon.',
        consequences: {
          'A': 'IV route daha etkili olurdu',
          'B': 'Optimal benzodiazepin seçimi',
          'C': 'Acceptable ama lorazepam daha iyi',
          'D': '2nd line\'a erken geçiş'
        },
        timeLimit: 90
      }
    ],
    diagnosticApproach: ['Status epilepticus recognition', 'Airway assessment', 'EEG if available', 'Metabolic workup'],
    treatment: ['ABC approach', 'IV benzodiazepines', 'Anti-epileptic loading', 'EEG monitoring'],
    learningObjectives: [
      'Status epilepticus immediate recognition and management',
      'Stepwise anti-epileptic drug protocol understanding',
      'Time-critical decision making in neurological emergencies'
    ],
    difficulty: 'hard',
    timeLimit: 30,
    scoringCriteria: [
      { category: 'Havayolu yönetimi', maxPoints: 25, description: 'ABC yaklaşımı ve havayolu güvenliği' },
      { category: 'Benzodiazepin seçimi', maxPoints: 25, description: 'Uygun ilaç seçimi ve dozlama' },
      { category: 'Zaman yönetimi', maxPoints: 25, description: 'Hızlı ve etkili karar verme' },
      { category: 'Protokol adherence', maxPoints: 25, description: 'Kılavuz uyumluluğu' }
    ]
  }]
};

// 🚨 VAKA 4: FEBRİL NÖTROPENİ - ONKOLOJİK ACİL DURUM  
export const febrileNeutropeniaCase: MEPModule = {
  id: 'case-febrile-neutropenia-complete', 
  title: '🔥 VAKA 4: FEBRİL NÖTROPENİ - ONKOLOJİK ACİL DURUM',
  description: 'Febril nötropeni - onkolojik acil durum, empirik antibiyoterapi yaklaşımı. MASCC skorlaması ve risk stratifikasyonu ile Turkish Oncology Society guidelines.',
  category: 'oncology',
  language: 'bilingual', 
  resources: [
    'NCCN Fever and Neutropenia Guidelines 2023',
    'MASCC Risk Assessment',
    'Turkish Oncology Society Protocols',
    'Empirical Antibiotic Selection'
  ],
  assessments: ['Risk Stratification', 'Antibiotic Selection', 'MASCC Score Calculation'],
  estimatedTime: 2.0,
  completed: false,
  difficulty: 'advanced',
  aiPrompts: [
    'Febril nötropeni risk stratifikasyonu - MASCC vs CISNE scoring',
    'Empirik antibiyotik seçimi - local resistance patterns vs guidelines',
    'Outpatient vs inpatient management criteria'
  ],
  requiredSkills: [
    'Febrile neutropenia recognition',
    'MASCC risk score calculation', 
    'Empirical antibiotic selection',
    'Risk stratification and disposition',
    'Turkish oncology guidelines compliance'
  ],
  turkishMedicalTerms: {
    'febrile neutropenia': 'febril nötropeni',
    'neutropenia': 'nötropeni',
    'absolute neutrophil count': 'mutlak nötrofil sayısı',
    'empirical therapy': 'empirik tedavi',
    'broad-spectrum antibiotics': 'geniş spektrum antibiyotik',
    'high-risk': 'yüksek risk',
    'low-risk': 'düşük risk'
  },
  internationalGuidelines: [
    '2023 NCCN Fever and Neutropenia',
    'ESMO Febrile Neutropenia Guidelines',
    'Turkish Society of Medical Oncology 2022'
  ],
  clinicalCases: [{
    id: 'febrile-neutropenia-main',
    title: '🔥 45Y Female - Febrile Neutropenia Post-Chemo',
    patient: {
      age: 45,
      gender: 'female', 
      chiefComplaint: 'Ateş, titreme, halsizlik',
      history: '7 gün önce kemoterapisi aldı (AC protokolü), bugün ateş başladı, titreme var',
      examination: 'Genel durum orta, ateşli, hafif takipneik, port kateter mevcut',
      investigations: ['Tam kan sayımı', 'CRP', 'Prokalsitonin', 'Kan kültürü'],
      comorbidities: ['Meme kanseri T2N1M0', 'Adjuvant kemoterapi alıyor']
    },
    presentation: '45 yaşında meme kanseri hastası, 7 gün önce AC kemoterapi aldıktan sonra ateş ve titreme ile başvurdu.',
    vitalSigns: {
      heartRate: 115,
      bloodPressure: '105/65', 
      temperature: 38.7,
      respiratoryRate: 22,
      oxygenSaturation: 96,
      glasgow: 15
    },
    labResults: [
      { test: 'WBC', value: '1,200/μL (Düşük)', normalRange: '4,000-11,000/μL', significance: 'critical' },
      { test: 'ANC', value: '400/μL (Düşük)', normalRange: '>1,500/μL', significance: 'critical' },
      { test: 'Plt', value: '85,000/μL (Düşük)', normalRange: '150,000-450,000/μL', significance: 'abnormal' },
      { test: 'CRP', value: '45 mg/L (Yüksek)', normalRange: '<3 mg/L', significance: 'abnormal' },
      { test: 'Prokalsitonin', value: '1.2 ng/mL (Yüksek)', normalRange: '<0.25 ng/mL', significance: 'abnormal' }
    ],
    decisionTree: [
      {
        id: 'fn-decision-1',
        timePoint: 'İlk değerlendirme - Risk Stratifikasyonu',
        scenario: 'Kemoterapiden 7 gün sonra febril nötropeni tanısı konuldu. Risk değerlendirmesi yapılacak.',
        question: '❓ KARAR NOKTASI 1: RİSK STRATİFİKASYONU\nZaman limiti: 5 dakika\n\nHasta: 45Y, AC kemoterapi +7 gün, Ateş: 38.7°C, ANC: 400/μL\nECOG PS: 1, Komorbidite: Yok, Hipotansiyon: Yok\n\nMASCC skorunuz ve ilk yaklaşımınız?',
        options: [
          {
            id: 'A',
            text: 'MASCC >21 → outpatient oral antibiyotik',
            isCorrect: false,
            points: 10,
            riskImpact: 1,
            explanation: 'MASCC hesaplama hatalı, bu hasta yüksek risk',
            references: ['MASCC Guidelines']
          },
          {
            id: 'B', 
            text: 'MASCC <21 → high-risk, hospitalization + IV antibiyotik',
            isCorrect: true,
            points: 20,
            riskImpact: -2,
            explanation: 'Doğru! Solid tümör + ANC <500 + serious medical condition = high-risk',
            references: ['NCCN 2023', 'MASCC Score']
          },
          {
            id: 'C',
            text: 'Risk belirsiz, kültür sonucu bekle',
            isCorrect: false,
            points: 0,
            riskImpact: 3,
            explanation: 'Febril nötropeni medical emergency, kültür beklenilmez',
            references: ['Emergency Medicine Guidelines']
          },
          {
            id: 'D',
            text: 'Moderate risk → day hospital monitoring',
            isCorrect: false,
            points: 5,
            riskImpact: 2,
            explanation: 'Bu hasta açık high-risk kategorisinde'
          }
        ],
        correctAnswer: 'B',
        explanation: '✅ DOĞRU CEVAP: B) MASCC <21 → high-risk, hospitalization + IV antibiyotik\n\n📝 MASCC Hesaplama:\n- Burden of illness: No symptoms (5 puan)\n- No hypotension (5 puan)\n- No COPD (4 puan)\n- Solid tumor/no previous fungal (4 puan)\n- No dehydration (3 puan)\n- Outpatient status (3 puan)\n- Age <60 (0 puan)\nToplam: ~24 puan değil - ANC <500 severe olduğu için high-risk',
        consequences: {
          'A': 'Yanlış risk değerlendirmesi → yetersiz tedavi',
          'B': 'Doğru risk stratifikasyonu → optimal tedavi',
          'C': 'Kritik zaman kaybı → morbidite artışı',
          'D': 'Risk altında tedavi'
        },
        timeLimit: 300,
        hints: ['MASCC score components gözden geçir', 'ANC <500 major risk factor', 'Medical emergency unutma']
      }
    ],
    diagnosticApproach: ['Fever workup', 'MASCC risk scoring', 'Culture collection', 'Chest imaging'],
    treatment: ['IV empirical antibiotics', 'Supportive care', 'Monitor for complications', 'G-CSF if indicated'],
    learningObjectives: [
      'Febrile neutropenia recognition and risk assessment',
      'MASCC risk score calculation and application',
      'Empirical antibiotic selection principles'
    ],
    difficulty: 'hard',
    timeLimit: 25, 
    scoringCriteria: [
      { category: 'Risk assessment accuracy', maxPoints: 30, description: 'Doğru risk değerlendirmesi ve MASCC skoru' },
      { category: 'MASCC score calculation', maxPoints: 25, description: 'MASCC risk skoru hesaplama doğruluğu' },
      { category: 'Treatment approach', maxPoints: 25, description: 'Uygun antibiyotik seçimi ve disposition' },
      { category: 'Time management', maxPoints: 20, description: 'Hızlı değerlendirme ve müdahale' }
    ]
  }]
};

// Export complete clinical cases
export const revolutionaryMEPModules: MEPModule[] = [septicShockCase, stemiCase, statusEpilepticusCase, febrileNeutropeniaCase];

// Turkish Medical Education Integration
export const getTurkishMedicalStandards = () => ({
  accreditation: 'TEPDAD (Tıp Eğitimi Programlarını Değerlendirme ve Akreditasyon Derneği)',
  competencies: [
    'Hasta Bakımı',
    'Tıbbi Bilgi', 
    'Uygulamaya Dayalı Öğrenme',
    'Kişilerarası İletişim',
    'Profesyonellik',
    'Sistem Tabanlı Uygulama'
  ],
  examStandards: 'TUS (Tıpta Uzmanlık Sınavı) Standartları',
  guidelines: [
    'Turkish Medical Association (TTB)',
    'Turkish Society of Internal Medicine',
    'Turkish Society of Emergency Medicine',
    'Turkish Society of Cardiology',
    'Turkish Society of Intensive Care'
  ]
});

// AI-Powered Recommendations
export const getAIRecommendations = (userLevel: string, completedCases: string[]): string[] => {
  const recommendations: string[] = [];
  
  if (userLevel === 'student') {
    recommendations.push('Temel clinical reasoning pathways ile başlayın');
    recommendations.push('Pattern recognition training\'e odaklanın');
  } else if (userLevel === 'resident') {
    if (!completedCases.includes('case-septic-shock-complete')) {
      recommendations.push('Septic shock case - acil tıp rotasyonu için kritik');
    }
    if (!completedCases.includes('case-stemi-complete')) {
      recommendations.push('STEMI case - kardiyoloji rotasyonu için essential');
    }
  }
  
  return recommendations;
};

// Export all modules organized by student level
export const medicalStudentMEPs: MEPModule[] = [septicShockCase, stemiCase];
export const medicalResidentMEPs: MEPModule[] = [statusEpilepticusCase, febrileNeutropeniaCase];
export const allMEPModules = revolutionaryMEPModules;