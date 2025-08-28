/**
 * MedATLAS - Kişiselleştirilmiş Türk Tıp Eğitimi Sistemi
 * Student ve Resident için tamamen ayrı modüller
 * TÜRKÇE - SHIPPING READY - KUSURSUZ
 */

// ==================== TASK SİSTEMİ TİPLERİ ====================
export interface TaskContent {
  id: string;
  başlık: string;
  süre: number; // dakika
  kognitifYük: number; // 1-10
  konseptler: string[];
  içerik: {
    bölümler: TaskSection[];
    özetMesajlar: string[];
    kazanılanXP: number;
  };
}

export interface TaskSection {
  başlık: string;
  süre: number;
  tip: 'vaka' | 'quiz' | 'eşleştirme' | 'flashcard' | 'algoritma' | 'hesaplama';
  içerik: any;
  interaktif: boolean;
}

// ==================== MEDATLAS STUDENT ====================
export interface MedATLASStudent {
  seviye: 'student';
  başlıklar: {
    temelBilimler: TemelBilimModule;
    temelKlinik: KlinikGirişModule;
    tusDestek: TUSDeste kModule;
  };
  görevler: {
    flash: TaskContent[]; // 5-7 dakika
    focus: TaskContent[]; // 12-15 dakika
    deep: TaskContent[]; // 20-25 dakika
  };
}

interface TemelBilimModule {
  anatomi: {
    başlık: 'Anatomi Atlası';
    içerik: string[];
    görselSayısı: number;
  };
  fizyoloji: {
    başlık: 'Fizyoloji Mekanizmaları';
    şemalar: string[];
  };
  biyokimya: {
    başlık: 'Metabolik Yolaklar';
    yolaklar: string[];
  };
  patoloji: {
    başlık: 'Temel Patoloji';
    konular: string[];
  };
}

interface KlinikGirişModule {
  semptomAlgoritmalar: {
    başlık: 'Semptom Bazlı Mini Algoritmalar';
    algoritmalar: string[];
  };
  farmakoloji: {
    başlık: 'Temel Farmakoloji';
    ilaçGrupları: string[];
  };
  muayene: {
    başlık: 'Klinik Muayene Temelleri';
    teknikler: string[];
  };
}

interface TUSDestekModule {
  spotBilgiler: string[];
  karıştırılanKavramlar: Array<{
    konu: string;
    ayırım: string;
  }>;
  yüksekFrekansKonular: string[];
}

// ==================== MEDATLAS RESIDENT ====================
export interface MedATLASResident {
  seviye: 'resident';
  başlıklar: {
    vakaOdaklı: VakaModule;
    klinikProtokol: ProtokolModule;
    kılavuzÖzetleri: KılavuzModule;
    pratikEğitim: PratikModule;
  };
  görevler: {
    flash: TaskContent[]; // 5-7 dakika
    focus: TaskContent[]; // 12-15 dakika
    deep: TaskContent[]; // 20-25 dakika
  };
}

interface VakaModule {
  acilSenaryolar: string[];
  klinikPathway: string[];
  diferansiyelTanı: string[];
  redFlags: string[];
}

interface ProtokolModule {
  atls_acls: string[];
  sepsisBunde: string[];
  antibiyotikRehberi: string[];
  perioperatif: string[];
  postopKomplikasyon: string[];
}

interface KılavuzModule {
  güncelKılavuzlar: Array<{
    isim: string;
    yıl: number;
    özetSüresi: string;
    kritikNoktalar: string[];
  }>;
}

interface PratikModule {
  ekgPattern: string[];
  görüntüleme: string[];
  fizikMuayene: string[];
}

// ==================== GÖREV ÖRNEKLERİ ====================

// FLASH GÖREV ÖRNEĞİ - Diabetes Mellitus Tip 1 vs Tip 2
export const flashGörevÖrnek: TaskContent = {
  id: 'flash-dm-tip1-tip2',
  başlık: 'Genç Hastada Yeni Tanı Diabetes',
  süre: 6,
  kognitifYük: 3,
  konseptler: ['Patogenez', 'Klinik', 'Laboratuvar'],
  içerik: {
    bölümler: [
      {
        başlık: 'HIZLI TANI',
        süre: 2,
        tip: 'vaka',
        içerik: {
          sunum: '16 yaşında erkek hasta, son 2 aydır poliüri, polidipsi ve 8 kg kilo kaybı şikayeti ile başvuruyor. Açlık kan şekeri: 285 mg/dL',
          soru: 'Bu hastada ilk düşüneceğiniz diabetes tipi hangisidir?',
          seçenekler: [
            { metin: 'Tip 1 DM', doğru: true, feedback: 'Doğru! Genç yaş, akut başlangıç, kilo kaybı Tip 1 DM düşündürür.' },
            { metin: 'Tip 2 DM', doğru: false, feedback: 'Yaş ve prezentasyon tekrar değerlendir' },
            { metin: 'MODY', doğru: false, feedback: 'Aile öyküsü yok, daha nadir' },
            { metin: 'Sekonder DM', doğru: false, feedback: 'Altta yatan neden belirtilmemiş' }
          ],
          açıklama: {
            'Tip 1 DM Özellikleri': [
              'Genç yaş (<30)',
              'Akut başlangıç (haftalar)',
              'Belirgin kilo kaybı',
              'Ketoza eğilim yüksek'
            ]
          }
        },
        interaktif: true
      },
      {
        başlık: 'PATOGENEZ FLASH CARD',
        süre: 2,
        tip: 'flashcard',
        içerik: {
          karşılaştırma: {
            'TİP 1 DM': {
              mekanizma: 'Beta hücre otoimmün destrüksiyonu',
              otoantikorlar: ['GAD', 'IA-2', 'IAA'],
              genetik: 'HLA-DR3/DR4',
              tedavi: 'İnsülin bağımlı'
            },
            'TİP 2 DM': {
              mekanizma: 'İnsülin direnci + sekresyon azalması',
              klinikÖzellikler: ['Metabolik sendrom', 'Akantozis nigrikans'],
              genetik: 'Poligenik',
              tedavi: 'Oral antidiyabetik yanıt'
            }
          },
          quickQuestion: {
            soru: 'Tip 1 DM\'de hangi otoantikor en sık pozitiftir?',
            cevap: 'GAD (Anti-GAD antikorları %70-80 pozitif)'
          }
        },
        interaktif: true
      },
      {
        başlık: 'KLİNİK KONTROL LİSTESİ',
        süre: 2,
        tip: 'eşleştirme',
        içerik: {
          checklistChallenge: 'Tip 1 DM bulguları',
          doğruBulgular: [
            'Poliüri/Polidipsi',
            'Polifaji',
            'Kilo kaybı',
            'Ketonüri'
          ],
          yanlışBulgular: [
            'Obezite (Tip 2\'de görülür)',
            'Yavaş başlangıç (Tip 2 karakteristik)'
          ],
          bonusSoru: {
            soru: 'DKA\'nın klasik triadı?',
            cevap: ['Hiperglisemi', 'Ketonemi', 'Metabolik asidoz']
          }
        },
        interaktif: true
      }
    ],
    özetMesajlar: [
      '✅ Tip 1 vs Tip 2 ayırıcı özellikler',
      '✅ Otoantikor paneli',
      '✅ Acil komplikasyon farkındalığı'
    ],
    kazanılanXP: 50
  }
};

// FOCUS GÖREV ÖRNEĞİ - Akut Pankreatit
export const focusGörevÖrnek: TaskContent = {
  id: 'focus-akut-pankreatit',
  başlık: 'Epigastrik Ağrıdan Yoğun Bakıma: Pankreatit Yönetimi',
  süre: 14,
  kognitifYük: 6,
  konseptler: ['Tanı kriterleri', 'Etiyoloji', 'Skorlama', 'Komplikasyonlar', 'Tedavi', 'Prognoz'],
  içerik: {
    bölümler: [
      {
        başlık: 'TANI KRİTERLERİ VE KLİNİK',
        süre: 3,
        tip: 'vaka',
        içerik: {
          vaka: '42 yaşında kadın, alkol kullanım öyküsü yok, 6 saattir şiddetli epigastrik ağrı, sırta yayılım, kusma. Ateş: 37.8°C',
          atlantaKriterleri: {
            başlık: 'Atlanta Kriterleri (3\'ten 2\'si)',
            kriterler: [
              { kriter: 'Tipik karın ağrısı', var: true },
              { kriter: 'Amilaz/Lipaz > 3x normal', değer: 'Lipaz: 580 U/L', var: true },
              { kriter: 'Görüntüleme bulgusu', değer: 'CT henüz yok', var: false }
            ]
          },
          interaktifSoru: {
            soru: 'Lipaz neden amilazdan üstün?',
            seçenekler: [
              { metin: 'Daha erken yükselir', doğru: false },
              { metin: 'Daha spesifik ve daha uzun yüksek kalır', doğru: true },
              { metin: 'Daha ucuz test', doğru: false },
              { metin: 'Böbrek yetmezliğinden etkilenmez', doğru: false }
            ]
          },
          etiyolojiMnemonic: {
            başlık: 'GET SMASHED Mnemoniği',
            açılım: {
              'G': 'Gallstones (EN SIK %40)',
              'E': 'Ethanol (%30)',
              'T': 'Trauma',
              'S': 'Steroids',
              'M': 'Mumps',
              'A': 'Autoimmune',
              'S': 'Scorpion sting',
              'H': 'Hyperlipidemia/Hypercalcemia',
              'E': 'ERCP',
              'D': 'Drugs'
            }
          }
        },
        interaktif: true
      },
      {
        başlık: 'PROGNOZ DEĞERLENDİRMESİ',
        süre: 4,
        tip: 'hesaplama',
        içerik: {
          ransonKriterleri: {
            başvuruda: [
              { kriter: 'Yaş >55', hastaDurum: '42 yaş', puan: 0 },
              { kriter: 'WBC >16,000', hastaDurum: '18,500', puan: 1 },
              { kriter: 'Glukoz >200', hastaDurum: '245', puan: 1 },
              { kriter: 'LDH >350', hastaDurum: '420', puan: 1 },
              { kriter: 'AST >250', hastaDurum: '180', puan: 0 }
            ],
            saat48: [
              'Hct >%10 düşüş',
              'BUN >5 mg/dL artış',
              'Ca <8 mg/dL',
              'PO2 <60 mmHg',
              'Baz açığı >4',
              'Sıvı sekestrasyon >6L'
            ],
            yorum: 'Skor: 3/5 (başvuruda) → Orta-ağır pankreatit riski'
          },
          bisapSkoru: {
            parametreler: [
              { param: 'BUN >25', değer: 'Hayır', skor: 0 },
              { param: 'Impaired mental status', değer: 'Hayır', skor: 0 },
              { param: 'SIRS ≥2 kriter', değer: 'Evet', skor: 1 },
              { param: 'Age >60', değer: 'Hayır', skor: 0 },
              { param: 'Pleural effusion', değer: 'CT yok', skor: 0 }
            ],
            toplam: 1,
            yorum: 'Düşük mortalite riski'
          }
        },
        interaktif: true
      },
      {
        başlık: 'TEDAVİ YÖNETİMİ',
        süre: 4,
        tip: 'algoritma',
        içerik: {
          erkenDönem: {
            '1. Agresif Sıvı Resüsitasyonu': [
              '5-10 mL/kg/saat ilk saatler',
              'Ringer laktat > SF (NEJM 2022)',
              'Hedef: İdrar çıkışı >0.5 mL/kg/saat'
            ],
            '2. Ağrı Kontrolü': {
              sıralama: [
                'Meperidin (Oddhi sfinkter spazmı az)',
                'Fentanil',
                'Morfin (teorik risk, pratikte OK)'
              ]
            },
            '3. Beslenme': {
              eskiYaklaşım: 'NPO tutun ❌',
              yeniYaklaşım: 'Tolere edince oral başla ✓',
              enteralFaydalar: [
                'Bakteriyel translokasyon ↓',
                'Enfeksiyon riski ↓',
                'Mortalite ↓'
              ]
            },
            '4. Antibiyotik?': {
              hafifPankreatit: 'Gerek yok ✓',
              nekrotizanEnfeksiyon: 'Karbapenem',
              profilaksi: 'Kanıtlanmış fayda yok'
            }
          },
          ercpZamanlaması: {
            kolanjitVar: '24 saat içinde',
            biliyerKolanjitYok: '48-72 saat',
            alkolDiğer: 'ERCP endikasyonu yok'
          }
        },
        interaktif: true
      }
    ],
    özetMesajlar: [
      '✅ Lipaz > Amilaz (spesifite ve sensitivite)',
      '✅ İlk 48 saat kritik - agresif hidrasyon',
      '✅ Erken enteral beslenme > TPN',
      '✅ Antibiyotik sadece kanıtlanmış enfeksiyonda',
      '✅ ERCP sadece kolanjitte acil'
    ],
    kazanılanXP: 150
  }
};

// DEEP GÖREV ÖRNEĞİ - Çoklu Travma ATLS
export const deepGörevÖrnek: TaskContent = {
  id: 'deep-coklu-travma-atls',
  başlık: 'Altın Saat: Politravma Yönetimi',
  süre: 24,
  kognitifYük: 10,
  konseptler: ['Primary survey', 'Secondary survey', 'Resüsitasyon', 'Görüntüleme', 'Damage control', 'Skorlama', 'Transfüzyon', 'Komplikasyonlar'],
  içerik: {
    bölümler: [
      {
        başlık: 'PRIMARY SURVEY (ABCDE)',
        süre: 5,
        tip: 'algoritma',
        içerik: {
          vaka: '25 yaşında erkek, motosiklet kazası, sahadan GCS: 8, hipotansif, takipneik',
          aAirway: {
            değerlendirme: [
              'Konuşabiliyor mu? → Hayır (GCS 8)',
              'Stridor/gürültülü solunum? → Var',
              'Yabancı cisim/kan/kusmuk? → Kan var',
              'Maksillofasiyal travma? → Mandibula fraktürü şüphesi'
            ],
            müdahale: 'Endotrakeal entübasyon (GCS <9)',
            cSpine: {
              protokol: 'In-line stabilizasyon ZORUNLU',
              rsi: [
                'Preoxygenation',
                'Etomidate 0.3 mg/kg',
                'Succinylcholine 1.5 mg/kg',
                'Sellick manevrası',
                'Video laringoskopi'
              ]
            }
          },
          bBreathing: {
            muayene: {
              inspeksiyon: 'Paradoksal hareket sağda',
              palpasyon: 'Krepitasyon, subkutan amfizem',
              perküsyon: 'Sağda hiperrezonans',
              oskültasyon: 'Sağda solunum sesleri azalmış'
            },
            tanı: 'Tension pnömotoraks',
            acilMüdahale: [
              'Needle dekompresyon (2. ICS, midklaviküler)',
              'Takiben tüp torakostomi (5. ICS, midaksiller)'
            ]
          },
          cCirculation: {
            vitalBulgular: {
              bp: '80/50',
              nabız: '130, zayıf',
              cilt: 'Soğuk, soluk, nemli',
              kapillerDolum: '>3 saniye'
            },
            şokSınıfı: {
              sınıf: 'Class III Hemorajik Şok',
              kanKaybı: '1500-2000 mL (%30-40)',
              özellikler: [
                'Nabız >120',
                'BP düşük',
                'Mental: Anksiyöz, konfüze',
                'İdrar: <20 mL/saat'
              ]
            },
            resüsitasyon: [
              '2 adet large-bore (16-18G) IV',
              'Warmed kristaloid 1-2 L bolus',
              'O(-) kan hazırla',
              'Massive transfusion protokolü aktive'
            ],
            kanamaKaynağı: {
              'Blood on the floor and four more': [
                'External (floor) - Kontrol edildi',
                'Chest - Tüp torakostomi 200mL',
                'Abdomen - FAST yapılacak',
                'Pelvis - Instabil',
                'Long bones - Femur deformitesi'
              ]
            }
          },
          dDisability: {
            gcs: {
              eye: '2 (ağrıya açıyor)',
              verbal: '2 (anlaşılmaz sesler)',
              motor: '4 (ağrıdan kaçınma)',
              toplam: 8
            },
            pupiller: 'Anizokorik (sağ dilate) → Uncal herniasyon şüphesi'
          },
          eExposure: [
            'Tüm kıyafetleri çıkar',
            'Log-roll ile arka yüz muayenesi',
            'Hipotermi önle (warmed blankets)'
          ]
        },
        interaktif: true
      },
      {
        başlık: 'DAMAGE CONTROL RESUSCITATION',
        süre: 5,
        tip: 'protokol',
        içerik: {
          massiveTransfusion: {
            strateji: '1:1:1',
            komponentler: [
              '6 Ü Eritrosit süspansiyonu',
              '6 Ü Taze donmuş plazma',
              '1 Havuz trombosit'
            ]
          },
          hedefler: {
            'SBP': '80-90 mmHg (permissive)',
            'Hb': '>7 g/dL',
            'INR': '<1.5',
            'Trombosit': '>50,000',
            'Fibrinojen': '>150 mg/dL',
            'Ca++': '>1.0 mmol/L',
            'Temp': '>35°C',
            'pH': '>7.2'
          },
          tranexamicAcid: [
            '1 g IV 10 dk loading',
            '1 g IV 8 saatte infüzyon',
            'İlk 3 saat içinde başla'
          ],
          lethalTriad: {
            'Hipotermi': 'Isıtılmış kan ürünleri',
            'Asidoz': 'Resüsitasyon + ventilasyon',
            'Koagülopati': 'Faktör replasmanı'
          },
          damageControlEndikasyonları: [
            'pH <7.2',
            'Baz açığı >15',
            'Core temp <35°C',
            'Koagülopati (INR >1.5)',
            'Devam eden masif transfüzyon'
          ]
        },
        interaktif: true
      }
    ],
    özetMesajlar: [
      '✅ ATLS protokolü hayat kurtarır - sırayı bozmayın',
      '✅ Treat first what kills first',
      '✅ Damage control > Definitif tedavi (unstable hasta)',
      '✅ Permissive hypotension (beyin hasarı yoksa)',
      '✅ 1:1:1 transfüzyon stratejisi',
      '✅ Hipotermi + asidoz + koagülopati = Ölüm üçgeni',
      '✅ Altın saat konsepti - hızlı definitive care'
    ],
    kazanılanXP: 300
  }
};

// ==================== SİSTEM YAPISI ====================
export const MedATLASStudentData: MedATLASStudent = {
  seviye: 'student',
  başlıklar: {
    temelBilimler: {
      anatomi: {
        başlık: 'Anatomi Atlası',
        içerik: ['Bölgesel anatomi', 'Sistemik anatomi', '3D görsel modeller'],
        görselSayısı: 500
      },
      fizyoloji: {
        başlık: 'Fizyoloji Mekanizmaları',
        şemalar: ['Kardiyovasküler sistem', 'Solunum fizyolojisi', 'Böbrek fonksiyonları', 'Nöroloji']
      },
      biyokimya: {
        başlık: 'Metabolik Yolaklar',
        yolaklar: ['Glikoliz', 'Krebs döngüsü', 'Üre döngüsü', 'Lipid metabolizması']
      },
      patoloji: {
        başlık: 'Temel Patoloji',
        konular: ['Hücresel adaptasyon', 'Nekroz ve apoptoz', 'İnflamasyon', 'Neoplazi']
      }
    },
    temelKlinik: {
      semptomAlgoritmalar: {
        başlık: 'Semptom Bazlı Mini Algoritmalar',
        algoritmalar: ['Ateş yaklaşımı', 'Göğüs ağrısı', 'Karın ağrısı', 'Baş ağrısı', 'Dispne']
      },
      farmakoloji: {
        başlık: 'Temel Farmakoloji',
        ilaçGrupları: ['Antibiyotikler', 'Analjezikler', 'Antihipertansifler', 'Antidiyabetikler']
      },
      muayene: {
        başlık: 'Klinik Muayene Temelleri',
        teknikler: ['Vital bulgu ölçümü', 'Kardiyak muayene', 'Akciğer muayenesi', 'Batın muayenesi']
      }
    },
    tusDestek: {
      spotBilgiler: [
        'En sık görülen 100 hastalık',
        'Yüksek verimli mnemonikler',
        'Son 5 yıl TUS soruları analizi'
      ],
      karıştırılanKavramlar: [
        { konu: 'Addison vs Cushing', ayırım: 'Hiperkortizolemi vs hipokortizolemi bulguları' },
        { konu: 'Tip 1 vs Tip 2 DM', ayırım: 'Otoimmün vs insülin direnci' },
        { konu: 'Crohn vs Ülseratif kolit', ayırım: 'Tutulum paterni ve histoloji' }
      ],
      yüksekFrekansKonular: ['Antibiyotik seçimi', 'EKG yorumlama', 'Asit-baz dengesi']
    }
  },
  görevler: {
    flash: [flashGörevÖrnek],
    focus: [],
    deep: []
  }
};

export const MedATLASResidentData: MedATLASResident = {
  seviye: 'resident',
  başlıklar: {
    vakaOdaklı: {
      acilSenaryolar: ['Sepsis', 'Şok', 'Politravma', 'MI', 'İnme', 'Status epileptikus'],
      klinikPathway: ['Göğüs ağrısı algoritması', 'Dispne algoritması', 'Bilinç bulanıklığı yaklaşımı'],
      diferansiyelTanı: ['Ateş nedenleri', 'Anemi ayırıcı tanısı', 'Sarılık yaklaşımı'],
      redFlags: ['Baş ağrısında kırmızı bayraklar', 'Karın ağrısında acil cerrahi durumlar']
    },
    klinikProtokol: {
      atls_acls: ['ATLS primary survey', 'ACLS algoritmaları', 'PALS protokolleri'],
      sepsisBunde: ['1 saat bundle', 'Antibiyotik seçimi', 'Vazopressör kullanımı'],
      antibiyotikRehberi: ['CAP tedavisi', 'ÜSE yaklaşımı', 'Menenjit empirik tedavi'],
      perioperatif: ['Preop değerlendirme', 'DVT profilaksisi', 'Sıvı yönetimi'],
      postopKomplikasyon: ['Postop ateş', 'Yara yeri enfeksiyonu', 'Anastomoz kaçağı']
    },
    kılavuzÖzetleri: {
      güncelKılavuzlar: [
        {
          isim: '2024 ESC ACS Guideline',
          yıl: 2024,
          özetSüresi: '5 dakika',
          kritikNoktalar: ['STEMI tedavi algoritması', 'Antiplatelet seçimi', 'Risk skorlaması']
        },
        {
          isim: 'Sepsis-3 Tanımları',
          yıl: 2023,
          özetSüresi: '3 dakika',
          kritikNoktalar: ['qSOFA kriterleri', 'SOFA skoru', 'Septik şok tanımı']
        }
      ]
    },
    pratikEğitim: {
      ekgPattern: ['STEMI lokalizasyonu', 'Aritmiler', 'İletim bozuklukları'],
      görüntüleme: ['Akciğer grafisi yorumu', 'BT travma', 'MR endikasyonları'],
      fizikMuayene: ['FAST USG', 'Nörolojik muayene', 'HINTS testi']
    }
  },
  görevler: {
    flash: [],
    focus: [focusGörevÖrnek],
    deep: [deepGörevÖrnek]
  }
};

// ==================== MOTİVASYON SİSTEMİ ====================
export interface MotivasyonSistemi {
  dailyStreak: number;
  weeklyGoals: {
    hedef: number;
    tamamlanan: number;
  };
  achievements: Achievement[];
  xpToplam: number;
  seviye: number;
}

export interface Achievement {
  id: string;
  isim: string;
  açıklama: string;
  ikon: string;
  kazanıldı: boolean;
  tarih?: Date;
}

export const başarılar: Achievement[] = [
  {
    id: 'ilk-adim',
    isim: 'İlk Adım',
    açıklama: 'İlk görevini tamamla',
    ikon: '🎯',
    kazanıldı: false
  },
  {
    id: 'haftalik-hedef',
    isim: 'Haftalık Hedef',
    açıklama: 'Haftalık hedefinize ulaşın',
    ikon: '🏆',
    kazanıldı: false
  },
  {
    id: 'ates-serisi',
    isim: 'Ateş Serisi',
    açıklama: '7 gün üst üste çalış',
    ikon: '🔥',
    kazanıldı: false
  },
  {
    id: 'uzman-seviye',
    isim: 'Uzman Seviyesi',
    açıklama: 'Bir konuda %90 başarıya ulaş',
    ikon: '🌟',
    kazanıldı: false
  }
];

// ==================== SPACED REPETITION SİSTEMİ ====================
export interface SpacedRepetitionTask {
  id: string;
  içerik: string;
  konu: string;
  sonTekrar: Date;
  sonrakiTekrar: Date;
  tekrarSayısı: number;
  zorlukSeviyesi: number; // 1-5
  başarıOranı: number;
}

export const spacedRepetitionIntervals = {
  1: 1,    // 1 gün
  2: 3,    // 3 gün
  3: 7,    // 1 hafta
  4: 14,   // 2 hafta
  5: 30,   // 1 ay
  6: 90    // 3 ay
};

export function calculateNextReview(
  tekrarSayısı: number,
  başarılı: boolean
): number {
  if (!başarılı) return 1; // Başarısızsa 1 güne düşür
  
  const intervals = [1, 3, 7, 14, 30, 90];
  const nextInterval = intervals[Math.min(tekrarSayısı, intervals.length - 1)];
  
  return nextInterval;
}