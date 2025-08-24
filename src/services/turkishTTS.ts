/**
 * Advanced Turkish Medical Text-to-Speech Service
 * Specialized for medical education with Turkish language support
 * Using Web Speech API with custom medical pronunciation
 */

interface TTSOptions {
  lang: 'tr-TR' | 'en-US';
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
}

interface MedicalTTSConfig {
  medicalTerms: { [key: string]: string };
  pronunciationRules: { [key: string]: string };
  emergencyPhrases: string[];
}

class TurkishMedicalTTS {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;
  private medicalConfig: MedicalTTSConfig;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
    this.medicalConfig = this.initializeMedicalConfig();
    this.initializeVoices();
  }

  private initializeMedicalConfig(): MedicalTTSConfig {
    return {
      medicalTerms: {
        'hipertansiyon': 'hi-per-tan-si-yon',
        'miyokard': 'mi-yo-kard',
        'infarktüsü': 'in-fark-tü-sü',
        'septik': 'sep-tik',
        'epileptikus': 'e-pi-lep-ti-kus',
        'nötropeni': 'nöt-ro-pe-ni',
        'ketoasidoz': 'ke-to-a-si-doz',
        'fibrilasyon': 'fib-ri-las-yon',
        'stenokardi': 'ste-no-kar-di',
        'anjiotensin': 'an-ji-yo-ten-sin',
        'bradikardi': 'bra-di-kar-di',
        'taşikardi': 'ta-şi-kar-di',
        'hipotansiyon': 'hi-po-tan-si-yon',
        'glukokortikoid': 'glu-ko-kor-ti-koid',
        'elektrokardiogram': 'e-lek-tro-kar-di-yo-gram'
      },
      pronunciationRules: {
        'ECG': 'E-C-G',
        'EKG': 'E-K-G',
        'CPR': 'C-P-R',
        'IV': 'I-V',
        'IM': 'I-M',
        'PO': 'P-O',
        'mg': 'miligram',
        'ml': 'mililitre',
        'cc': 'santimetre küp'
      },
      emergencyPhrases: [
        'ACIL DURUM',
        'HAYATI TEHLİKE',
        'DERHAL MÜDAHALe',
        'KRİTİK HASTA',
        'RESÜSITASYON GEREKLİ'
      ]
    };
  }

  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        if (this.voices.length > 0) {
          resolve();
        }
      };

      if (this.voices.length > 0) {
        resolve();
      } else {
        this.synthesis.addEventListener('voiceschanged', loadVoices);
        // Fallback timeout
        setTimeout(() => {
          this.voices = this.synthesis.getVoices();
          resolve();
        }, 1000);
      }
    });
  }

  private getBestTurkishVoice(): SpeechSynthesisVoice | null {
    // Priority order for Turkish voices
    const turkishVoiceNames = [
      'Yelda',
      'Tolga', 
      'Microsoft Tolga - Turkish (Turkey)',
      'Google Türkçe',
      'tr-TR-Standard-A',
      'tr-TR-Standard-B'
    ];

    // First try to find exact matches
    for (const voiceName of turkishVoiceNames) {
      const voice = this.voices.find(v => 
        v.name.includes(voiceName) || v.lang === 'tr-TR'
      );
      if (voice) return voice;
    }

    // Fallback to any Turkish voice
    return this.voices.find(v => v.lang.startsWith('tr')) || null;
  }

  private preprocessMedicalText(text: string): string {
    let processedText = text;

    // Replace medical terms with phonetic pronunciations
    Object.entries(this.medicalConfig.medicalTerms).forEach(([term, pronunciation]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      processedText = processedText.replace(regex, pronunciation);
    });

    // Replace abbreviations with full pronunciations
    Object.entries(this.medicalConfig.pronunciationRules).forEach(([abbrev, fullForm]) => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'g');
      processedText = processedText.replace(regex, fullForm);
    });

    // Add emphasis to emergency phrases
    this.medicalConfig.emergencyPhrases.forEach(phrase => {
      const regex = new RegExp(phrase, 'gi');
      processedText = processedText.replace(regex, `<emphasis level="strong">${phrase}</emphasis>`);
    });

    return processedText;
  }

  async speak(
    text: string, 
    options: Partial<TTSOptions> = {},
    priority: 'normal' | 'high' | 'emergency' = 'normal'
  ): Promise<void> {
    if (!this.isSupported) {
      console.warn('TTS not supported in this browser');
      return;
    }

    // Cancel any ongoing speech for high priority messages
    if (priority === 'high' || priority === 'emergency') {
      this.synthesis.cancel();
    }

    await this.initializeVoices();

    const defaultOptions: TTSOptions = {
      lang: 'tr-TR',
      rate: priority === 'emergency' ? 1.1 : 0.9,
      pitch: priority === 'emergency' ? 1.2 : 1.0,
      volume: priority === 'emergency' ? 1.0 : 0.8,
    };

    const finalOptions = { ...defaultOptions, ...options };
    const processedText = this.preprocessMedicalText(text);

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(processedText);
      
      // Set voice
      const turkishVoice = this.getBestTurkishVoice();
      if (turkishVoice) {
        utterance.voice = turkishVoice;
      }

      // Apply options
      utterance.lang = finalOptions.lang;
      utterance.rate = finalOptions.rate;
      utterance.pitch = finalOptions.pitch;
      utterance.volume = finalOptions.volume;

      // Event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('TTS Error:', event.error);
        reject(new Error(`TTS failed: ${event.error}`));
      };

      // Speak
      this.synthesis.speak(utterance);
    });
  }

  async speakClinicalCase(
    caseTitle: string,
    feedback: string,
    suggestions: string[],
    priority: 'normal' | 'high' = 'normal'
  ): Promise<void> {
    const fullText = `
      ${caseTitle}. 
      Geri bildirim: ${feedback}. 
      Öneriler: ${suggestions.join('. ')}.
    `;

    await this.speak(fullText, { rate: 0.85, pitch: 1.0 }, priority);
  }

  async speakMedicalTerm(
    turkish: string,
    english: string,
    definition: string
  ): Promise<void> {
    const termText = `
      Türkçe terim: ${turkish}. 
      İngilizce karşılığı: ${english}. 
      Tanım: ${definition}.
    `;

    await this.speak(termText, { rate: 0.8, pitch: 1.1 });
  }

  async speakEmergencyAlert(message: string): Promise<void> {
    const emergencyText = `ACİL DURUM! ${message}`;
    await this.speak(emergencyText, { rate: 1.2, pitch: 1.3, volume: 1.0 }, 'emergency');
  }

  async speakPersonalizedRecommendation(recommendations: string[]): Promise<void> {
    const introText = 'Sizin için kişiselleştirilmiş önerilerimiz:';
    const recommendationsText = recommendations.join('. ');
    const fullText = `${introText} ${recommendationsText}`;

    await this.speak(fullText, { rate: 0.9, pitch: 0.95 });
  }

  stop(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }

  pause(): void {
    if (this.isSupported && this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.isSupported && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('tr') || voice.lang.startsWith('en')
    );
  }

  isReady(): boolean {
    return this.isSupported && this.voices.length > 0;
  }

  // Clinical case specific TTS methods
  async announceCaseStart(caseTitle: string): Promise<void> {
    const announcement = `Klinik vaka başlıyor: ${caseTitle}. Hazır olduğunuzda başlayabilirsiniz.`;
    await this.speak(announcement, { rate: 0.9, pitch: 1.1 }, 'high');
  }

  async announceCaseComplete(score: number, totalPoints: number): Promise<void> {
    const percentage = Math.round((score / totalPoints) * 100);
    const message = `Vaka tamamlandı. Skorunuz: ${score} / ${totalPoints}. Başarı oranı: yüzde ${percentage}.`;
    await this.speak(message, { rate: 0.9, pitch: 1.0 });
  }

  async readAIAnalysis(analysis: string): Promise<void> {
    const introduction = 'AI analizi sonucu:';
    const fullText = `${introduction} ${analysis}`;
    await this.speak(fullText, { rate: 0.8, pitch: 0.95 });
  }
}

// Singleton instance
let turkishTTSInstance: TurkishMedicalTTS | null = null;

export const getTurkishMedicalTTS = (): TurkishMedicalTTS => {
  if (!turkishTTSInstance) {
    turkishTTSInstance = new TurkishMedicalTTS();
  }
  return turkishTTSInstance;
};

export { TurkishMedicalTTS };
export default TurkishMedicalTTS;