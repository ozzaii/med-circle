/**
 * MedATLAS - Kişiselleştirilmiş Türk Tıp Eğitimi İçerik Sistemi
 * Öğrenci ve Asistan seviyeleri için ayrı içerik modülleri
 */

export interface MedATLASContent {
  id: string;
  title: string;
  category: string;
  duration: number; // dakika
  difficulty: 'temel' | 'orta' | 'ileri';
  type: 'vaka' | 'algoritma' | 'konsept' | 'quiz' | 'görsel';
  tags: string[];
  content: any;
  level: 'student' | 'resident';
}

export interface FlashTask {
  id: string;
  title: string;
  duration: 5 | 6 | 7;
  cognitiveLoad: number;
  sections: {
    title: string;
    duration: number;
    content: any;
    interactive: boolean;
  }[];
}

export interface FocusTask {
  id: string;
  title: string;
  duration: 12 | 13 | 14 | 15;
  cognitiveLoad: number;
  modules: any[];
}

// 🎓 MedATLAS Student İçerikleri
export const medATLASStudent: MedATLASContent[] = [
  {
    id: 'student-anatomy-1',
    title: 'Kalp Anatomisi - 3D Görsel Atlas',
    category: 'Temel Bilimler',
    duration: 10,
    difficulty: 'temel',
    type: 'görsel',
    tags: ['anatomi', 'kardiyoloji', 'TUS'],
    level: 'student',
    content: {
      description: 'Kalbin 4 odacığı, kapaklar ve büyük damarlar',
      keyPoints: [
        'Sağ ve sol atrium özellikleri',
        'Ventriküller arası farklar',
        'Triküspit ve mitral kapak anatomisi',
        'Koroner arter seyri'
      ],
      mnemonics: 'Kapak sırası: Tüm Tıp Müfredatı Anlaşılır (Triküspit, Pulmoner, Mitral, Aort)',
      tusFrequency: 'Yüksek'
    }
  },
  {
    id: 'student-physio-1',
    title: 'Glikoliz Yolağı - Adım Adım',
    category: 'Temel Bilimler',
    duration: 15,
    difficulty: 'orta',
    type: 'konsept',
    tags: ['biyokimya', 'metabolizma', 'TUS'],
    level: 'student',
    content: {
      steps: [
        'Glukoz → Glukoz-6-fosfat (Hekzokinaz)',
        'Rate-limiting step: Fosfofruktokinaz-1',
        'Net kazanç: 2 ATP, 2 NADH, 2 Piruvat'
      ],
      clinicalRelevance: 'Piruvat kinaz eksikliği → Hemolitik anemi',
      tusHighYield: true
    }
  },
  {
    id: 'student-symptom-1',
    title: 'Göğüs Ağrısı Algoritması - Temel',
    category: 'Klinik Giriş',
    duration: 8,
    difficulty: 'temel',
    type: 'algoritma',
    tags: ['acil', 'kardiyoloji', 'semptom'],
    level: 'student',
    content: {
      redFlags: [
        'Yırtılma tarzında ağrı → Aort diseksiyonu',
        'Nefes darlığı + D-dimer yüksekliği → PE',
        'ST elevasyonu → STEMI'
      ],
      basicApproach: 'OPQRST değerlendirmesi',
      differentials: ['MI', 'PE', 'Aort diseksiyonu', 'Pnömoni', 'GERD']
    }
  }
];

// 🩺 MedATLAS Resident İçerikleri
export const medATLASResident: MedATLASContent[] = [
  {
    id: 'resident-sepsis-1',
    title: 'Sepsis 1-Hour Bundle - Güncel Protokol',
    category: 'Acil Protokoller',
    duration: 15,
    difficulty: 'ileri',
    type: 'algoritma',
    tags: ['sepsis', 'acil', 'yoğun bakım'],
    level: 'resident',
    content: {
      oneHourBundle: [
        '1. Laktat ölçümü',
        '2. Kan kültürü (antibiyotik öncesi)',
        '3. Geniş spektrumlu antibiyotik',
        '4. 30 mL/kg kristaloid (hipotansiyon/laktat≥4)',
        '5. Vazopressör (MAP<65 sıvı sonrası)'
      ],
      guidelines: 'Surviving Sepsis Campaign 2024',
      localProtocol: 'Türk Yoğun Bakım Derneği önerileri',
      pearls: [
        'Laktat >2 mmol/L = kötü prognoz',
        'qSOFA: Hızlı tarama aracı',
        'Norepinefrin: İlk tercih vazopressör'
      ]
    }
  },
  {
    id: 'resident-stemi-1',
    title: 'STEMI Yönetimi - Door to Balloon',
    category: 'Kardiyoloji Aciller',
    duration: 12,
    difficulty: 'ileri',
    type: 'vaka',
    tags: ['STEMI', 'PCI', 'kardiyoloji'],
    level: 'resident',
    content: {
      timeline: {
        '0-10 dk': 'EKG çekilmesi ve STEMI tanısı',
        '10-30 dk': 'DAPT yükleme (ASA 300mg + Ticagrelor 180mg)',
        '30-90 dk': 'Primary PCI (hedef <90 dk)',
        'Alternatif': 'PCI yoksa <30 dk fibrinolitik'
      },
      ekgPatterns: {
        'Anterior': 'V1-V4 ST↑ → LAD',
        'İnferior': 'II,III,aVF ST↑ → RCA',
        'Lateral': 'I,aVL,V5-6 ST↑ → Cx'
      },
      complications: [
        'Reperfüzyon aritmileri',
        'No-reflow fenomeni',
        'Kardiyojenik şok'
      ]
    }
  },
  {
    id: 'resident-antibiotics-1',
    title: 'CAP Antibiyotik Seçimi - 2024 Rehberi',
    category: 'Enfeksiyon',
    duration: 10,
    difficulty: 'orta',
    type: 'algoritma',
    tags: ['pnömoni', 'antibiyotik', 'CAP'],
    level: 'resident',
    content: {
      riskStratification: {
        'Ayaktan': 'Amoksisilin-klavulanat + Makrolid VEYA Kinolon',
        'Servis yatış': 'Seftriakson + Makrolid',
        'YBÜ': 'Seftriakson + Makrolid + Anti-MRSA düşün'
      },
      localResistance: 'Türkiye S.pneumoniae penisilin direnci: %30-40',
      duration: 'Komplike değilse 5-7 gün yeterli',
      deEscalation: 'Kültür sonucuna göre daralt'
    }
  }
];

// 🚀 FLASH Görevler (5-7 dakika)
export const flashTasks: FlashTask[] = [
  {
    id: 'flash-dm-1',
    title: 'Diabetes Mellitus Tip 1 vs Tip 2 Ayırımı',
    duration: 6,
    cognitiveLoad: 3,
    sections: [
      {
        title: 'Hızlı Tanı',
        duration: 2,
        interactive: true,
        content: {
          case: '16 yaşında erkek, son 2 aydır poliüri, polidipsi ve 8 kg kilo kaybı. Açlık kan şekeri: 285 mg/dL',
          question: 'İlk düşüneceğiniz diabetes tipi?',
          options: [
            { text: 'Tip 1 DM', correct: true, feedback: 'Doğru! Genç yaş, akut başlangıç, kilo kaybı' },
            { text: 'Tip 2 DM', correct: false, feedback: 'Yaş ve prezentasyonu tekrar değerlendir' },
            { text: 'MODY', correct: false, feedback: 'Aile öyküsü yok, daha nadir' },
            { text: 'Sekonder DM', correct: false, feedback: 'Altta yatan neden belirtilmemiş' }
          ]
        }
      },
      {
        title: 'Patogenez Flash Card',
        duration: 2,
        interactive: false,
        content: {
          tip1: {
            mechanism: 'Beta hücre otoimmün destrüksiyonu',
            markers: 'GAD, IA-2, IAA (+)',
            genetics: 'HLA-DR3/DR4',
            treatment: 'İnsülin bağımlı'
          },
          tip2: {
            mechanism: 'İnsülin direnci + sekresyon ↓',
            markers: 'Metabolik sendrom bulguları',
            signs: 'Akantozis nigrikans',
            treatment: 'Oral antidiyabetik yanıt'
          }
        }
      },
      {
        title: 'Klinik Kontrol Listesi',
        duration: 2,
        interactive: true,
        content: {
          checklistChallenge: 'Tip 1 DM bulguları',
          items: [
            { item: 'Poliüri/Polidipsi', tip1: true },
            { item: 'Polifaji', tip1: true },
            { item: 'Kilo kaybı', tip1: true },
            { item: 'Ketonüri', tip1: true },
            { item: 'Obezite', tip1: false, note: 'Tip 2\'de görülür' },
            { item: 'Yavaş başlangıç', tip1: false, note: 'Tip 2 karakteristik' }
          ],
          bonusQuestion: 'DKA\'nın klasik triadı?',
          answer: ['Hiperglisemi', 'Ketonemi', 'Metabolik asidoz']
        }
      }
    ]
  },
  {
    id: 'flash-ekg-1',
    title: 'EKG\'de Miyokard İnfarktüsü Lokalizasyonu',
    duration: 7,
    cognitiveLoad: 4,
    sections: [
      {
        title: 'EKG Pattern Tanıma',
        duration: 3,
        interactive: true,
        content: {
          ekgFindings: 'V1-V4\'te 3mm ST elevasyonu, Resiprokal ST depresyonu II, III, aVF\'de',
          dragDropExercise: {
            instruction: 'Derivasyonları anatomik lokalizasyona yerleştir',
            locations: {
              'Anterior': ['V3', 'V4'],
              'Septal': ['V1', 'V2'],
              'Lateral': ['I', 'aVL', 'V5', 'V6'],
              'İnferior': ['II', 'III', 'aVF']
            }
          }
        }
      },
      {
        title: 'Koroner Anatomi Matching',
        duration: 2,
        interactive: true,
        content: {
          matching: [
            { mi: 'Anterior MI', artery: 'LAD', note: 'Left Anterior Descending' },
            { mi: 'İnferior MI', artery: 'RCA', note: 'Right Coronary Artery %80' },
            { mi: 'Lateral MI', artery: 'Cx', note: 'Circumflex' },
            { mi: 'Posterior MI', artery: 'RCA veya Cx', note: 'Dominant sisteme göre' }
          ]
        }
      },
      {
        title: 'Komplikasyon Farkındalığı',
        duration: 2,
        interactive: true,
        content: {
          rapidFire: 'Anterior MI\'da en sık komplikasyon?',
          timeLimit: 15,
          options: [
            { text: 'Papiller kas rüptürü', correct: false },
            { text: 'Sol ventrikül anevrizması', correct: true },
            { text: 'Sağ ventrikül infarktı', correct: false },
            { text: 'AV blok', correct: false }
          ],
          explanation: 'LAD geniş anterior duvarı besler → Pump failure riski yüksek → Apikal anevrizma gelişebilir',
          pearls: [
            'Anterior MI\'da mortalite inferior MI\'dan yüksektir',
            'V1-V4: Septal + Anterior = LAD proximal lezyonu düşün'
          ]
        }
      }
    ]
  }
];

// 🎯 FOCUS Görevler (12-15 dakika)
export const focusTasks: FocusTask[] = [
  {
    id: 'focus-pancreatitis-1',
    title: 'Akut Pankreatit - Tanıdan Tedaviye',
    duration: 14,
    cognitiveLoad: 6,
    modules: [
      {
        title: 'Tanı Kriterleri ve Klinik',
        duration: 3,
        content: {
          case: '42 yaşında kadın, alkol öyküsü yok, 6 saattir şiddetli epigastrik ağrı, sırta yayılım, kusma. Ateş: 37.8°C',
          atlantaCriteria: {
            description: '3\'ten 2\'si yeterli:',
            criteria: [
              'Tipik karın ağrısı',
              'Amilaz/Lipaz > 3x normal',
              'Görüntüleme bulgusu'
            ]
          },
          etiology: {
            mnemonic: 'GET SMASHED',
            causes: [
              'G - Gallstones (EN SIK %40)',
              'E - Ethanol (%30)',
              'T - Trauma',
              'S - Steroids',
              'M - Mumps',
              'A - Autoimmune',
              'S - Scorpion sting',
              'H - Hyperlipidemia/Hypercalcemia',
              'E - ERCP',
              'D - Drugs'
            ]
          }
        }
      },
      {
        title: 'Prognoz Değerlendirmesi',
        duration: 4,
        content: {
          ransonCriteria: {
            admission: [
              'Yaş >55',
              'WBC >16,000',
              'Glukoz >200',
              'LDH >350',
              'AST >250'
            ],
            at48Hours: [
              'Hct >%10 düşüş',
              'BUN >5 mg/dL artış',
              'Ca <8 mg/dL',
              'PO2 <60 mmHg',
              'Baz açığı >4',
              'Sıvı sekestrasyon >6L'
            ],
            interpretation: '≥3: Ağır pankreatit'
          },
          bisapScore: {
            B: 'BUN >25',
            I: 'Impaired mental status',
            S: 'SIRS ≥2 kriter',
            A: 'Age >60',
            P: 'Pleural effusion'
          }
        }
      },
      {
        title: 'Tedavi Yönetimi',
        duration: 4,
        content: {
          earlyManagement: {
            fluidResuscitation: '5-10 mL/kg/saat ilk saatler, Ringer laktat > SF',
            painControl: ['Meperidin', 'Fentanil', 'Morfin'],
            nutrition: 'Tolere edince oral başla (24-72 saat)',
            antibiotics: 'Sadece kanıtlanmış enfeksiyonda'
          },
          ercpTiming: {
            withCholangitis: '24 saat içinde',
            biliary: '48-72 saat',
            other: 'ERCP endikasyonu yok'
          }
        }
      }
    ]
  }
];

// Koleksiyon Örnekleri
export const collections = {
  student: [
    {
      id: 'col-student-1',
      title: 'TUS Endokrin Hızlı Bakış',
      contents: ['student-physio-1', 'flash-dm-1'],
      estimatedTime: 21,
      description: 'TUS\'ta sık çıkan endokrin konuları'
    },
    {
      id: 'col-student-2',
      title: 'Temel EKG Eğitimi',
      contents: ['flash-ekg-1'],
      estimatedTime: 7,
      description: 'EKG okuma temelleri ve MI lokalizasyonu'
    }
  ],
  resident: [
    {
      id: 'col-resident-1',
      title: 'Acil Sepsis Paketi',
      contents: ['resident-sepsis-1'],
      estimatedTime: 15,
      description: 'Sepsis tanı ve tedavi protokolü'
    },
    {
      id: 'col-resident-2',
      title: 'Kardiyoloji Acil Protokolleri',
      contents: ['resident-stemi-1', 'flash-ekg-1'],
      estimatedTime: 19,
      description: 'STEMI yönetimi ve EKG pattern tanıma'
    }
  ]
};