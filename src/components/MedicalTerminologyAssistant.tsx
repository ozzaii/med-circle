import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Search,
  Loader,
  Info,
  Globe,
  Stethoscope,
  X,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { getMEPAIService } from '../services/mepAI';
import { getTurkishMedicalTTS } from '../services/turkishTTS';
import { getTurkishMedicalStreamingService, type StreamChunk } from '../services/streamingService';
import StreamingResponse from './StreamingResponse';
import PersonaSelector from './PersonaSelector';
import { AI_PERSONAS, type AIPersona } from '../services/aiPersonas';

interface TerminologyResult {
  turkish: string;
  english: string;
  definition: string;
  clinicalUse: string;
  examples: string[];
}

interface MedicalTerminologyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

export const MedicalTerminologyAssistant: React.FC<MedicalTerminologyAssistantProps> = ({
  isOpen,
  onClose,
  initialTerm = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [result, setResult] = useState<TerminologyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ttsEnabled, setTTSEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamingChunks, setStreamingChunks] = useState<StreamChunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(AI_PERSONAS[2]); // Default to Research
  
  const ttsService = getTurkishMedicalTTS();
  const streamingService = import.meta.env.VITE_GEMINI_API_KEY 
    ? getTurkishMedicalStreamingService(import.meta.env.VITE_GEMINI_API_KEY)
    : null;

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const aiService = getMEPAIService(apiKey);
        const termResult = await aiService.explainTurkishMedicalTerm(
          searchTerm,
          'Tıbbi eğitim bağlamı',
          'student'
        );
        setResult(termResult);
        
        // Auto-play TTS if enabled
        if (ttsEnabled && termResult) {
          setTimeout(async () => {
            try {
              await ttsService.speakMedicalTerm(
                termResult.turkish,
                termResult.english,
                termResult.definition
              );
            } catch (error) {
              console.error('TTS Error:', error);
            }
          }, 800);
        }
      } else {
        // Demo mode result
        const demoResult = {
          turkish: searchTerm,
          english: searchTerm.toLowerCase().includes('hipertansiyon') ? 'Hypertension' : 'Medical Term',
          definition: `${searchTerm} - Tıbbi tanım: Bu terimle ilgili detaylı açıklama burada yer alır. Patofizyoloji, klinik bulgular ve tanı kriterleri dahil.`,
          clinicalUse: 'Klinik pratikte hasta değerlendirmesi, tanı koyma ve tedavi planlamasında kullanılır.',
          examples: [
            `${searchTerm} hastasının fizik muayenesi`,
            `${searchTerm} tedavi protokolü`,
            `${searchTerm} komplikasyonları`
          ]
        };
        setResult(demoResult);
        
        // Auto-play TTS for demo if enabled
        if (ttsEnabled) {
          setTimeout(async () => {
            try {
              await ttsService.speakMedicalTerm(
                demoResult.turkish,
                demoResult.english,
                demoResult.definition
              );
            } catch (error) {
              console.error('TTS Error:', error);
            }
          }, 800);
        }
      }
    } catch (err) {
      setError('Terim açıklaması alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleTTSPlay = async (text: string) => {
    if (!ttsEnabled || isPlaying) return;
    
    try {
      setIsPlaying(true);
      await ttsService.speak(text, { rate: 0.85, pitch: 1.0 });
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleTTSStop = () => {
    ttsService.stop();
    setIsPlaying(false);
  };

  const toggleTTS = () => {
    if (isPlaying) {
      handleTTSStop();
    }
    setTTSEnabled(!ttsEnabled);
  };

  const handleStreamingSearch = async () => {
    if (!searchTerm.trim() || !streamingService) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setStreamingChunks([]);
    setIsStreaming(true);

    try {
      const stream = streamingService.streamMedicalTermExplanation(
        searchTerm,
        'Tıbbi eğitim bağlamı',
        'student',
        { 
          chunkSize: 35, 
          delayBetweenChunks: 100,
          aiPersona: selectedPersona
        }
      );

      const chunks: StreamChunk[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
        setStreamingChunks([...chunks]);
      }
      
    } catch (error) {
      console.error('Streaming Term Explanation Error:', error);
      setError('Terim açıklaması alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const cancelStreaming = () => {
    if (streamingService) {
      streamingService.cancelStream();
      setIsStreaming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-medical-dark rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-medical-blue/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-medical-blue" />
              <h2 className="text-2xl font-bold text-white">Türkçe Tıbbi Terim Asistanı</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Persona Selector */}
              <PersonaSelector
                selectedPersona={selectedPersona}
                onPersonaChange={setSelectedPersona}
                className="min-w-48"
              />
              
              {/* TTS Controls */}
              <button
                onClick={toggleTTS}
                className={`p-2 rounded-lg transition-colors ${
                  ttsEnabled 
                    ? 'bg-medical-blue text-white hover:bg-medical-blue/80' 
                    : 'bg-gray-600 text-gray-400 hover:bg-gray-500'
                }`}
                title={ttsEnabled ? 'Ses açık' : 'Ses kapalı'}
              >
                {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              {isPlaying && (
                <button
                  onClick={handleTTSStop}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Sesi durdur"
                >
                  <Pause className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tıbbi terimi giriniz (örn. hipertansiyon, miyokard infarktüsü, septik şok)"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-medical-blue focus:outline-none pr-12"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  className="p-2 bg-medical-blue hover:bg-medical-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Normal arama"
                >
                  {isLoading && !isStreaming ? (
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 text-white" />
                  )}
                </button>
                
                <button
                  onClick={handleStreamingSearch}
                  disabled={isLoading || !searchTerm.trim() || !streamingService}
                  className="p-2 bg-medical-purple hover:bg-medical-purple/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Streaming arama"
                >
                  {isStreaming ? (
                    <Loader className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Streaming Results */}
          {streamingChunks.length > 0 && (
            <StreamingResponse
              streamChunks={streamingChunks}
              isStreaming={isStreaming}
              title={`Tıbbi Terim: ${searchTerm}`}
              type="explanation"
              enableTTS={ttsEnabled}
              onCancel={cancelStreaming}
              onComplete={(content) => {
                console.log('Streaming term explanation complete:', content);
              }}
            />
          )}

          {/* Regular Results */}
          {result && streamingChunks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Term Header */}
              <div className="bg-gradient-to-r from-medical-blue/20 to-medical-cyan/20 border border-medical-blue/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{result.turkish}</h3>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-medical-cyan" />
                      <span className="text-medical-cyan font-medium">{result.english}</span>
                      <button 
                        onClick={() => copyToClipboard(result.english)}
                        className="p-1 hover:bg-medical-cyan/20 rounded transition-colors"
                        title="İngilizce terimi kopyala"
                      >
                        <Copy className="w-3 h-3 text-medical-cyan" />
                      </button>
                      <button 
                        onClick={() => handleTTSPlay(`${result.turkish}. İngilizce karşılığı: ${result.english}`)}
                        className="p-1 hover:bg-medical-cyan/20 rounded transition-colors"
                        title="Terimi sesli dinle"
                        disabled={isPlaying}
                      >
                        <Play className="w-3 h-3 text-medical-cyan" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Definition */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-medical-green" />
                    <h4 className="text-lg font-semibold text-white">Tanım</h4>
                  </div>
                  <button 
                    onClick={() => handleTTSPlay(result.definition)}
                    className="p-1 hover:bg-medical-green/20 rounded transition-colors"
                    title="Tanımı sesli dinle"
                    disabled={isPlaying}
                  >
                    <Play className="w-4 h-4 text-medical-green" />
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed">{result.definition}</p>
              </div>

              {/* Clinical Use */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-5 h-5 text-medical-purple" />
                    <h4 className="text-lg font-semibold text-white">Klinik Kullanım</h4>
                  </div>
                  <button 
                    onClick={() => handleTTSPlay(result.clinicalUse)}
                    className="p-1 hover:bg-medical-purple/20 rounded transition-colors"
                    title="Klinik kullanımı sesli dinle"
                    disabled={isPlaying}
                  >
                    <Play className="w-4 h-4 text-medical-purple" />
                  </button>
                </div>
                <p className="text-gray-300 leading-relaxed">{result.clinicalUse}</p>
              </div>

              {/* Examples */}
              {result.examples.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-amber-500" />
                      <h4 className="text-lg font-semibold text-white">Kullanım Örnekleri</h4>
                    </div>
                    <button 
                      onClick={() => handleTTSPlay(result.examples.join('. '))}
                      className="p-1 hover:bg-amber-500/20 rounded transition-colors"
                      title="Örnekleri sesli dinle"
                      disabled={isPlaying}
                    >
                      <Play className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {result.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <span className="text-amber-500 mt-1">•</span>
                        <span className="leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => copyToClipboard(`${result.turkish} (${result.english}): ${result.definition}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-medical-blue hover:bg-medical-blue/80 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Tanımı Kopyala
                </button>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Yeni Arama
                </button>
              </div>
            </motion.div>
          )}

          {/* Popular Terms Suggestions */}
          {!result && !isLoading && streamingChunks.length === 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Popüler Tıbbi Terimler</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Hipertansiyon',
                  'Miyokard İnfarktüsü', 
                  'Septik Şok',
                  'Status Epileptikus',
                  'Febril Nötropeni',
                  'Akut Koroner Sendrom',
                  'Pulmoner Emboli',
                  'Diabetik Ketoasidoz'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term);
                      handleStreamingSearch();
                    }}
                    className="text-left p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MedicalTerminologyAssistant;