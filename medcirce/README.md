# MedCircle - AI-Powered Medical Education Platform 🏥🤖

> **Türk Tıp Eğitimi için Gelişmiş AI Destekli Öğrenme Platformu**
> 
> Advanced AI-Supported Learning Platform for Turkish Medical Education

## 🚀 Proje Özeti / Project Overview

MedCircle, Türk tıp öğrencileri ve asistan hekimler için özel olarak tasarlanmış, Gemini 2.5 Flash-Lite AI teknolojisi ile desteklenmiş devrimsel bir tıbbi eğitim platformudur.

MedCircle is a revolutionary medical education platform specifically designed for Turkish medical students and residents, powered by Gemini 2.5 Flash-Lite AI technology.

## ✨ Temel Özellikler / Core Features

### 🧠 AI-Destekli Öğrenme / AI-Powered Learning
- **Türkçe-İngilizce Karışık Eğitim**: Bilingual medical education approach
- **Kişiselleştirilmiş İçerik**: AI-generated personalized content based on learning patterns
- **Akıllı Soru-Cevap**: Context-aware medical Q&A system
- **Klinik Vaka Analizi**: AI-guided clinical case studies

### 📚 MEP (Medical Education Program) Modülleri
- **Tıp Öğrencileri için Temel Modüller**:
  - Temel Anatomi ve Klinik Korelasyonlar
  - Sistem Fizyolojisi ve Patofizyoloji
  - Patoloji ve Tanısal Yaklaşım

- **Asistan Hekimler için Uzmanlık Modülleri**:
  - İç Hastalıkları Uzmanlık Eğitimi
  - Acil Tıp Uzmanlık Eğitimi
  - Genel Cerrahi Uzmanlık Eğitimi

### 🇹🇷 Türk Tıp Eğitimi Entegrasyonu
- **TEPDAD Uyumluluğu**: Turkish medical education standards compliance
- **TUS Hazırlığı**: Specialized preparation for Turkish medical specialization exam
- **Türk Kılavuzları**: Integration with Turkish medical association guidelines
- **Klinik Rotasyon Desteği**: Clinical rotation support system

## 🛠️ Teknoloji Yığını / Technology Stack

```typescript
Frontend:
├── React 19 + TypeScript
├── Tailwind CSS (Medical Theme)
├── Framer Motion (Animations)
├── Zustand (State Management)
└── React Router v7

AI & Backend:
├── Google Gemini 2.5 Flash-Lite API
├── Advanced MEP AI Service
├── Turkish Medical NLP Processing
└── Personalized Learning Analytics

Medical Education:
├── TEPDAD Compliant Modules
├── TUS Preparation System
├── Clinical Case Database
└── Turkish Medical Terminology
```

## 📁 Proje Yapısı / Project Structure

```
medcirce/
├── src/
│   ├── data/
│   │   └── mep_modules.ts          # MEP module definitions
│   ├── types/
│   │   ├── index.ts                # Core types
│   │   └── mep.ts                  # MEP-specific types
│   ├── services/
│   │   ├── gemini.ts               # Original AI service
│   │   └── mepAI.ts               # Advanced MEP AI service
│   ├── pages/
│   │   ├── MEPDashboard.tsx        # MEP dashboard component
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── Library.tsx             # Book library
│   │   ├── Reader.tsx              # PDF reader
│   │   ├── AIChat.tsx              # AI chat interface
│   │   └── Progress.tsx            # Progress tracking
│   └── components/
│       ├── Layout.tsx              # Main layout
│       ├── Header.tsx              # Navigation header
│       └── Sidebar.tsx             # Side navigation
└── utils/
    └── data_flow.py                # ETL pipeline for medical data
```

## 🚀 Kurulum / Installation

### Ön Gereksinimler / Prerequisites
```bash
Node.js 20+
npm veya yarn
Gemini API key (Google AI Studio'dan alınabilir)
```

### Adım Adım Kurulum / Step-by-Step Setup

1. **Repoyu Klonlayın / Clone Repository**
```bash
git clone [repository-url]
cd medcirce
```

2. **Bağımlılıkları Yükleyin / Install Dependencies**
```bash
npm install
```

3. **Çevre Değişkenlerini Ayarlayın / Setup Environment**
```bash
# .env dosyası oluşturun / Create .env file
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Geliştirme Sunucusunu Başlatın / Start Development Server**
```bash
npm run dev
```

5. **MEP Dashboard'a Erişin / Access MEP Dashboard**
```
http://localhost:3000/mep-dashboard
```

## 🎯 MEP Modül Kullanımı / MEP Module Usage

### Tıp Öğrencileri için / For Medical Students

```typescript
// MEP modülünü başlatma
import { medicalStudentMEPs } from './src/data/mep_modules';
import { getMEPAIService } from './src/services/mepAI';

const aiService = getMEPAIService(process.env.VITE_GEMINI_API_KEY);
const anatomyModule = medicalStudentMEPs[0]; // Temel Anatomi Modülü

// AI destekli soru oluşturma
const questions = await aiService.generateAdaptiveQuiz(
  anatomyModule, 
  'medium', 
  10, 
  'bilingual'
);
```

### Asistan Hekimler için / For Medical Residents

```typescript
// Klinik vaka analizi
import { medicalResidentMEPs } from './src/data/mep_modules';

const internalMedicineModule = medicalResidentMEPs[0];
const clinicalCase = internalMedicineModule.clinicalCases[0];

const analysis = await aiService.analyzeClinicalCase(
  clinicalCase,
  studentResponse,
  'resident'
);
```

## 🧠 AI Özellikleri / AI Features

### Kişiselleştirilmiş Öğrenme / Personalized Learning
- **Öğrenme Stili Analizi**: Visual, auditory, kinesthetic learning style detection
- **Zayıf Alan Tespiti**: AI-powered weak area identification
- **Adaptif İçerik**: Dynamic content adjustment based on performance

### Türkçe Tıbbi Terminoloji / Turkish Medical Terminology
```typescript
// Türkçe tıbbi terim açıklama
const termExplanation = await aiService.explainTurkishMedicalTerm(
  'hipertansiyon',
  'kardiyovasküler hastalıklar',
  'student'
);

// Çıktı / Output:
// {
//   turkish: 'hipertansiyon',
//   english: 'hypertension', 
//   definition: 'Arter basıncının normal değerlerin üzerinde olması...',
//   clinicalUse: 'Kardiyovasküler risk değerlendirmesi...',
//   examples: ['Essential hipertansiyon', 'Sekonder hipertansiyon']
// }
```

### Klinik Vaka AI Desteği / Clinical Case AI Support
- **Diferansiyel Tanı Önerileri**: AI-powered differential diagnosis suggestions
- **Tedavi Protokolü Rehberliği**: Treatment protocol guidance
- **Prognoz Değerlendirmesi**: Prognosis evaluation assistance

## 📊 Öğrenci İzleme / Student Tracking

### İlerleme Analitikleri / Progress Analytics
```typescript
interface MEPProgress {
  completionPercentage: number;
  timeSpent: number; // dakika cinsinden
  skillsAcquired: string[];
  weakAreas: string[];
  strongAreas: string[];
  aiRecommendations: string[];
}
```

### Türk Tıp Eğitimi Standartları / Turkish Medical Education Standards
```typescript
const standards = getTurkishMedicalStandards();
// {
//   accreditation: 'TEPDAD',
//   competencies: ['Hasta Bakımı', 'Tıbbi Bilgi', ...],
//   examStandards: 'TUS Standartları',
//   clinicalRotations: ['İç Hastalıkları', 'Genel Cerrahi', ...]
// }
```

## 🎨 Kullanıcı Arayüzü / User Interface

### Tasarım Sistemi / Design System
- **Tıbbi Tema**: Medical-inspired dark mode design
- **Glassmorphism**: Modern translucent UI elements
- **Türkçe Font Desteği**: Optimal Turkish text rendering
- **Accessibility**: Screen reader compatible

### Animasyonlar / Animations
- **Framer Motion**: Smooth page transitions
- **Loading States**: Medical-themed loading indicators
- **Interactive Elements**: Hover effects for better UX

## 📱 Responsive Design

Platform, tüm cihaz türlerinde optimum performans için tasarlanmıştır:
- 📱 **Mobil**: Touch-friendly interface for clinical rounds
- 💻 **Masaüstü**: Full-featured study environment
- 📊 **Tablet**: Perfect for case studies and reading

## 🧪 Test ve Kalite / Testing & Quality

### Test Süreci / Testing Process
```bash
# Birim testleri çalıştır / Run unit tests
npm run test

# E2E testleri çalıştır / Run E2E tests  
npm run test:e2e

# Tip kontrolü / Type checking
npm run type-check
```

### Kod Kalitesi / Code Quality
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety
- **Husky**: Pre-commit hooks

## 🚀 Deployment

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Katkıda Bulunma / Contributing

Bu proje Türk tıp eğitiminin geleceği için geliştirilmektedir. Katkılarınızı bekliyoruz!

This project is being developed for the future of Turkish medical education. We welcome your contributions!

### Katkı Süreci / Contribution Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add: Amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 Lisans / License

Bu proje tıbbi eğitim amaçlı geliştirilmiştir ve educational use için açık kaynaklıdır.

This project is developed for medical education purposes and is open source for educational use.

## 🏆 Teşekkürler / Acknowledgments

- **Türk Tabipleri Birliği**: Turkish medical association guidelines
- **TEPDAD**: Turkish medical education accreditation standards
- **Google AI**: Gemini 2.5 Flash-Lite API
- **Turkish Medical Students**: Feedback and testing support

## 📞 İletişim / Contact

- **Proje Sahibi**: Özlem & Team
- **Email**: [contact-email]
- **Discord**: Turkish Medical AI Community

---

## 🌟 Gelecek Özellikler / Future Features

### Planlanan Geliştirmeler / Planned Developments
- [ ] **VR Integration**: Virtual reality anatomy lessons
- [ ] **Blockchain Certificates**: Blockchain-based achievement certificates
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Offline Mode**: Offline study capabilities
- [ ] **Multi-University**: Integration with Turkish medical schools
- [ ] **AI Proctoring**: AI-powered exam proctoring system

### Araştırma Alanları / Research Areas
- [ ] **NLP for Turkish Medical Texts**: Advanced Turkish medical text processing
- [ ] **Predictive Analytics**: Student success prediction models
- [ ] **Adaptive Learning Algorithms**: More sophisticated personalization
- [ ] **Medical Image Analysis**: AI-powered radiological image interpretation

---

**🔬 Built with ❤️ for Turkish Medical Education**

*"Geleceğin doktorları için, yapay zeka ile güçlendirilmiş eğitim platformu"*

*"An AI-powered educational platform for the doctors of tomorrow"*

---

Made with 🧠 by [Claude Code](https://claude.ai/code) - The future of medical AI education starts here! 🚀