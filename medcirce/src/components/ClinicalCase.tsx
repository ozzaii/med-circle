import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Timer,
  Award,
  TrendingUp,
  Stethoscope,
  Activity,
  Brain,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import type { ClinicalCase, VitalSigns, LabResult } from '../data/mep_modules';
import { getTurkishMedicalTTS } from '../services/turkishTTS';
import { getTurkishMedicalStreamingService, type StreamChunk } from '../services/streamingService';
import StreamingResponse from './StreamingResponse';
import PersonaSelector from './PersonaSelector';
import { AI_PERSONAS, type AIPersona } from '../services/aiPersonas';
import { analyticsService } from '../services/analyticsService';
import { useStore } from '../store';

interface ClinicalCaseProps {
  clinicalCase: ClinicalCase;
  onComplete: (score: number, decisions: string[]) => void;
  aiAnalysis?: {
    feedback: string;
    suggestions: string[];
    learningPoints: string[];
  } | null;
  isAnalyzing?: boolean;
}

interface DecisionState {
  currentDecisionIndex: number;
  selectedAnswers: string[];
  totalScore: number;
  timeSpent: number;
  riskScore: number;
  completed: boolean;
}

interface TTSState {
  isEnabled: boolean;
  isPlaying: boolean;
  currentText: string;
}

interface StreamingState {
  chunks: StreamChunk[];
  isStreaming: boolean;
  streamingError: string | null;
}

export const ClinicalCaseComponent: React.FC<ClinicalCaseProps> = ({ 
  clinicalCase, 
  onComplete,
  aiAnalysis,
  isAnalyzing 
}) => {
  const { user } = useStore();
  const [startTime] = useState(Date.now());
  const [decisionStartTime, setDecisionStartTime] = useState(Date.now());
  const [decisionState, setDecisionState] = useState<DecisionState>({
    currentDecisionIndex: 0,
    selectedAnswers: [],
    totalScore: 0,
    timeSpent: 0,
    riskScore: 0,
    completed: false
  });
  
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [ttsState, setTTSState] = useState<TTSState>({
    isEnabled: true,
    isPlaying: false,
    currentText: ''
  });
  
  const [streamingState, setStreamingState] = useState<StreamingState>({
    chunks: [],
    isStreaming: false,
    streamingError: null
  });
  
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(AI_PERSONAS[0]); // Default to Coach
  
  const ttsService = getTurkishMedicalTTS();
  const streamingService = import.meta.env.VITE_GEMINI_API_KEY 
    ? getTurkishMedicalStreamingService(import.meta.env.VITE_GEMINI_API_KEY)
    : null;

  const currentDecision = clinicalCase.decisionTree[decisionState.currentDecisionIndex];

  // TTS Functions
  const handleTTSPlay = async (text: string, priority: 'normal' | 'high' | 'emergency' = 'normal') => {
    if (!ttsState.isEnabled) return;
    
    try {
      setTTSState(prev => ({ ...prev, isPlaying: true, currentText: text }));
      await ttsService.speak(text, { rate: 0.9 }, priority);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setTTSState(prev => ({ ...prev, isPlaying: false, currentText: '' }));
    }
  };

  const handleTTSStop = () => {
    ttsService.stop();
    setTTSState(prev => ({ ...prev, isPlaying: false, currentText: '' }));
  };

  const toggleTTS = () => {
    if (ttsState.isPlaying) {
      handleTTSStop();
    }
    setTTSState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  // Auto-announce case start and track analytics
  useEffect(() => {
    if (decisionState.currentDecisionIndex === 0) {
      // Track module start
      if (user) {
        analyticsService.trackModuleStart(clinicalCase.id, clinicalCase.id, user.id);
      }
      
      // Announce with TTS if enabled
      if (ttsState.isEnabled) {
        setTimeout(() => {
          ttsService.announceCaseStart(clinicalCase.title);
        }, 1000);
      }
    }
  }, [clinicalCase.title, ttsState.isEnabled, user]);

  // Announce case completion with TTS
  useEffect(() => {
    if (decisionState.completed && ttsState.isEnabled) {
      const maxPoints = clinicalCase.decisionTree.reduce((sum, decision) => 
        sum + Math.max(...decision.options.map(opt => opt.points)), 0
      );
      ttsService.announceCaseComplete(decisionState.totalScore, maxPoints);
    }
  }, [decisionState.completed, decisionState.totalScore, ttsState.isEnabled]);

  // Auto-read AI Analysis when available
  useEffect(() => {
    if (aiAnalysis && !isAnalyzing && ttsState.isEnabled) {
      setTimeout(() => {
        ttsService.readAIAnalysis(aiAnalysis.feedback);
      }, 500);
    }
  }, [aiAnalysis, isAnalyzing, ttsState.isEnabled]);

  // Start streaming AI analysis when case completes
  const startStreamingAnalysis = async () => {
    if (!streamingService || decisionState.completed) return;
    
    setStreamingState({
      chunks: [],
      isStreaming: true,
      streamingError: null
    });

    try {
      const userResponse = `Karar dizisi: ${decisionState.selectedAnswers.join(', ')}. Toplam puan: ${decisionState.totalScore}`;
      const stream = streamingService.streamClinicalCaseAnalysis(
        clinicalCase,
        userResponse,
        'student',
        { 
          chunkSize: 40, 
          delayBetweenChunks: 150,
          aiPersona: selectedPersona
        }
      );

      const chunks: StreamChunk[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
        setStreamingState(prev => ({
          ...prev,
          chunks: [...chunks]
        }));
      }
      
      setStreamingState(prev => ({
        ...prev,
        isStreaming: false
      }));
      
    } catch (error) {
      console.error('Streaming Analysis Error:', error);
      setStreamingState(prev => ({
        ...prev,
        isStreaming: false,
        streamingError: 'Streaming analiz başarısız oldu'
      }));
    }
  };

  const cancelStreamingAnalysis = () => {
    if (streamingService) {
      streamingService.cancelStream();
      setStreamingState(prev => ({
        ...prev,
        isStreaming: false
      }));
    }
  };
  
  // Timer for current decision
  useEffect(() => {
    if (currentDecision?.timeLimit && !showExplanation) {
      setTimeRemaining(currentDecision.timeLimit);
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - force a decision
            handleTimeUp();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [decisionState.currentDecisionIndex, showExplanation]);

  const handleTimeUp = () => {
    // Auto-select the first option if no choice made
    handleDecisionSelect(currentDecision.options[0].id);
  };

  const handleDecisionSelect = (optionId: string) => {
    const selectedOption = currentDecision.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    const newSelectedAnswers = [...decisionState.selectedAnswers, optionId];
    const newTotalScore = decisionState.totalScore + selectedOption.points;
    const newRiskScore = decisionState.riskScore + selectedOption.riskImpact;
    const currentTime = (Date.now() - startTime) / 1000 / 60; // minutes
    const responseTime = Date.now() - decisionStartTime;

    // Track decision with analytics
    if (user) {
      analyticsService.trackDecision(
        user.id,
        clinicalCase.id,
        clinicalCase.id,
        optionId,
        selectedOption.isCorrect,
        responseTime,
        currentDecision.criticalLevel === 'high' || currentDecision.criticalLevel === 'critical'
      );
    }

    setDecisionState({
      ...decisionState,
      selectedAnswers: newSelectedAnswers,
      totalScore: newTotalScore,
      riskScore: newRiskScore,
      timeSpent: currentTime
    });

    setShowExplanation(true);
    setTimeRemaining(null);
  };

  const handleNextDecision = () => {
    setShowExplanation(false);
    setDecisionStartTime(Date.now()); // Reset timer for next decision
    
    if (decisionState.currentDecisionIndex < clinicalCase.decisionTree.length - 1) {
      setDecisionState({
        ...decisionState,
        currentDecisionIndex: decisionState.currentDecisionIndex + 1
      });
    } else {
      // Case completed
      const finalTime = (Date.now() - startTime) / 1000; // total time in seconds
      
      // Track module completion
      if (user) {
        analyticsService.trackModuleCompletion(
          user.id,
          clinicalCase.id,
          clinicalCase.id,
          decisionState.totalScore,
          finalTime,
          decisionState.selectedAnswers
        );
      }
      
      setDecisionState({
        ...decisionState,
        completed: true
      });
      onComplete(decisionState.totalScore, decisionState.selectedAnswers);
    }
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Uzman Seviyesi', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { label: 'Yetkin Seviyesi', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { label: 'Geliştirilmeli', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Ciddi Eğitim İhtiyacı', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (decisionState.completed) {
    const performance = getPerformanceLevel(decisionState.totalScore);
    
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Final Results */}
        <div className="text-center mb-8">
          <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vaka Tamamlandı! 🎉</h2>
          <h3 className="text-xl text-gray-700">{clinicalCase.title}</h3>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{decisionState.totalScore}/100</div>
            <div className="text-sm text-gray-600">Toplam Puan</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{Math.round(decisionState.timeSpent)} dk</div>
            <div className="text-sm text-gray-600">Süre</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{decisionState.riskScore > 0 ? '+' : ''}{decisionState.riskScore}</div>
            <div className="text-sm text-gray-600">Risk Skoru</div>
          </div>
        </div>

        {/* Performance Level */}
        <div className={`p-4 rounded-lg text-center mb-6 ${performance.bgColor}`}>
          <div className={`text-xl font-bold ${performance.color}`}>{performance.label}</div>
        </div>

        {/* AI Analysis Section */}
        {(aiAnalysis || isAnalyzing || streamingState.chunks.length > 0) && (
          <div className="bg-gradient-to-br from-medical-blue/10 to-medical-purple/10 border border-medical-blue/20 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-medical-purple" />
                <h4 className="font-semibold text-gray-900">AI Analiz ve Geri Bildirim</h4>
              </div>
              
              {/* Persona Selector & Streaming Controls */}
              {!aiAnalysis && !isAnalyzing && (
                <div className="flex items-center gap-3">
                  <PersonaSelector
                    selectedPersona={selectedPersona}
                    onPersonaChange={setSelectedPersona}
                    className="min-w-64"
                  />
                  <button
                    onClick={startStreamingAnalysis}
                    disabled={streamingState.isStreaming}
                    className={`px-4 py-2 bg-${selectedPersona.color} text-white rounded-lg hover:bg-${selectedPersona.color}/80 transition-colors disabled:opacity-50 whitespace-nowrap`}
                  >
                    {streamingState.isStreaming ? `${selectedPersona.icon} Analiz Ediliyor...` : `${selectedPersona.icon} ${selectedPersona.name} Analiz`}
                  </button>
                </div>
              )}
            </div>
            
            {/* Streaming Response */}
            {streamingState.chunks.length > 0 && (
              <StreamingResponse
                streamChunks={streamingState.chunks}
                isStreaming={streamingState.isStreaming}
                title="Klinik Vaka Analizi"
                type="analysis"
                enableTTS={ttsState.isEnabled}
                onCancel={cancelStreamingAnalysis}
                onComplete={(content) => {
                  console.log('Streaming analysis complete:', content);
                }}
              />
            )}
            
            {isAnalyzing && streamingState.chunks.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mr-3"></div>
                <span className="text-gray-600">AI analiz yapıyor...</span>
              </div>
            ) : aiAnalysis && streamingState.chunks.length === 0 && (
              <div className="space-y-4">
                {/* AI Feedback */}
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-medical-blue">📝 AI Değerlendirmesi:</h5>
                    <button
                      onClick={() => handleTTSPlay(aiAnalysis.feedback, 'normal')}
                      className="p-1 rounded bg-medical-blue/10 hover:bg-medical-blue/20 transition-colors"
                      title="AI analizini sesli dinle"
                      disabled={ttsState.isPlaying}
                    >
                      <Play className="w-4 h-4 text-medical-blue" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{aiAnalysis.feedback}</p>
                </div>
                
                {/* AI Suggestions */}
                {aiAnalysis.suggestions.length > 0 && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-medical-purple">💡 İyileştirme Önerileri:</h5>
                      <button
                        onClick={() => handleTTSPlay(aiAnalysis.suggestions.join('. '), 'normal')}
                        className="p-1 rounded bg-medical-purple/10 hover:bg-medical-purple/20 transition-colors"
                        title="Önerileri sesli dinle"
                        disabled={ttsState.isPlaying}
                      >
                        <Play className="w-4 h-4 text-medical-purple" />
                      </button>
                    </div>
                    <ul className="text-sm space-y-1">
                      {aiAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-medical-purple mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Learning Points */}
                {aiAnalysis.learningPoints.length > 0 && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-medical-green">🎯 Önemli Öğrenme Noktaları:</h5>
                      <button
                        onClick={() => handleTTSPlay(aiAnalysis.learningPoints.join('. '), 'high')}
                        className="p-1 rounded bg-medical-green/10 hover:bg-medical-green/20 transition-colors"
                        title="Öğrenme noktalarını sesli dinle"
                        disabled={ttsState.isPlaying}
                      >
                        <Play className="w-4 h-4 text-medical-green" />
                      </button>
                    </div>
                    <ul className="text-sm space-y-1">
                      {aiAnalysis.learningPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-medical-green mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Decision Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Karar Özeti:</h4>
          {clinicalCase.decisionTree.map((decision, index) => {
            const selectedOptionId = decisionState.selectedAnswers[index];
            const selectedOption = decision.options.find(opt => opt.id === selectedOptionId);
            
            return (
              <div key={decision.id} className="mb-4 p-4 bg-white rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{decision.timePoint}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    selectedOption?.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedOption?.isCorrect ? '✅ Doğru' : '❌ Yanlış'} ({selectedOption?.points} puan)
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Seçim:</strong> {selectedOption?.text}
                </div>
                {!selectedOption?.isCorrect && (
                  <div className="text-sm text-green-600 mt-1">
                    <strong>Doğru cevap:</strong> {decision.options.find(opt => opt.isCorrect)?.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedOptionId = decisionState.selectedAnswers[decisionState.currentDecisionIndex];
  const selectedOption = selectedOptionId ? currentDecision.options.find(opt => opt.id === selectedOptionId) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{clinicalCase.title}</h2>
          <div className="flex items-center gap-4">
            {/* TTS Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTTS}
                className={`p-2 rounded-lg transition-colors ${
                  ttsState.isEnabled 
                    ? 'bg-medical-blue text-white hover:bg-medical-blue/80' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={ttsState.isEnabled ? 'Ses açık' : 'Ses kapalı'}
              >
                {ttsState.isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              {ttsState.isPlaying && (
                <button
                  onClick={handleTTSStop}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Sesi durdur"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center text-blue-600">
              <Stethoscope className="w-5 h-5 mr-1" />
              <span className="text-sm">Karar {decisionState.currentDecisionIndex + 1}/{clinicalCase.decisionTree.length}</span>
            </div>
            {timeRemaining !== null && (
              <div className={`flex items-center ${timeRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                <Timer className="w-5 h-5 mr-1" />
                <span className="font-mono font-bold">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((decisionState.currentDecisionIndex + 1) / clinicalCase.decisionTree.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Patient Information */}
      {decisionState.currentDecisionIndex === 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Hasta Bilgileri
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Yaş:</strong> {clinicalCase.patient.age}</p>
              <p><strong>Cinsiyet:</strong> {clinicalCase.patient.gender === 'male' ? 'Erkek' : 'Kadın'}</p>
              <p><strong>Başvuru nedeni:</strong> {clinicalCase.patient.chiefComplaint}</p>
              <p><strong>Öykü:</strong> {clinicalCase.patient.history}</p>
              {clinicalCase.patient.comorbidities && (
                <p><strong>Komorbiditeler:</strong> {clinicalCase.patient.comorbidities.join(', ')}</p>
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Vital Bulgular:</h4>
              <VitalSignsDisplay vitals={clinicalCase.vitalSigns} />
              
              {clinicalCase.labResults && clinicalCase.labResults.length > 0 && (
                <>
                  <h4 className="font-medium text-gray-700 mb-2 mt-4">Önemli Lab Sonuçları:</h4>
                  <LabResultsDisplay results={clinicalCase.labResults} />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Decision */}
      <div className="mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {currentDecision.timePoint}
          </h3>
          <p className="text-yellow-700">{currentDecision.scenario}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">{currentDecision.question}</h4>
          
          {!showExplanation ? (
            <div className="space-y-3">
              {currentDecision.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDecisionSelect(option.id)}
                  className="w-full text-left p-4 bg-gray-700 border border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-600 transition-all"
                  disabled={timeRemaining === 0}
                >
                  <span className="font-medium text-blue-400 mr-2">{option.id})</span>
                  <span className="text-gray-200">{option.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Answer Display */}
              <div className={`p-4 rounded-lg border-2 ${
                selectedOption?.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center mb-2">
                  {selectedOption?.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  <span className="font-semibold">
                    Seçiminiz: {selectedOption?.id}) {selectedOption?.text}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  <strong>Puan:</strong> {selectedOption?.points}/20 | 
                  <strong className="ml-2">Risk Etkisi:</strong> {(selectedOption?.riskImpact ?? 0) > 0 ? '+' : ''}{selectedOption?.riskImpact ?? 0}
                </p>
                <p className="text-sm text-gray-700">{selectedOption?.explanation}</p>
              </div>

              {/* Detailed Explanation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Açıklama ve Doğru Cevap:</h5>
                <div className="text-sm text-blue-800 whitespace-pre-line">
                  {currentDecision.explanation}
                </div>
                
                {currentDecision.consequences && (
                  <div className="mt-3">
                    <h6 className="font-medium text-blue-900 mb-2">Klinik Sonuçlar:</h6>
                    <p className="text-sm text-blue-700">
                      <strong>{selectedOption?.id}):</strong> {currentDecision.consequences[selectedOption?.id || '']}
                    </p>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextDecision}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {decisionState.currentDecisionIndex < clinicalCase.decisionTree.length - 1 ? (
                    <>Sonraki Karar <span className="ml-2">→</span></>
                  ) : (
                    <>Vakayı Tamamla <Award className="w-4 h-4 ml-2" /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hints */}
        {currentDecision.hints && !showExplanation && (
          <div className="bg-gray-100 p-3 rounded-lg">
            <h5 className="font-medium text-gray-700 mb-2">💡 İpuçları:</h5>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {currentDecision.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Vital Signs Display Component
const VitalSignsDisplay: React.FC<{ vitals: VitalSigns }> = ({ vitals }) => (
  <div className="text-sm space-y-1">
    <div className="flex items-center">
      <Heart className="w-4 h-4 mr-1 text-red-500" />
      <span><strong>KTA:</strong> {vitals.heartRate}/dk</span>
    </div>
    <p><strong>TA:</strong> {vitals.bloodPressure}</p>
    <p><strong>Ateş:</strong> {vitals.temperature}°C</p>
    <p><strong>SaO2:</strong> {vitals.oxygenSaturation}%</p>
    <p><strong>Solunum:</strong> {vitals.respiratoryRate}/dk</p>
    {vitals.glasgow && <p><strong>GKS:</strong> {vitals.glasgow}</p>}
  </div>
);

// Lab Results Display Component  
const LabResultsDisplay: React.FC<{ results: LabResult[] }> = ({ results }) => (
  <div className="space-y-2">
    {results.slice(0, 3).map((result, index) => (
      <div key={index} className="text-xs">
        <div className="flex justify-between">
          <span className="font-medium">{result.test}:</span>
          <span className={result.value.includes('Yüksek') || result.value.includes('Düşük') ? 'text-red-600 font-medium' : 'text-green-600'}>
            {result.value}
          </span>
        </div>
        <div className="text-gray-500 text-xs">({result.normalRange})</div>
      </div>
    ))}
    {results.length > 3 && (
      <div className="text-xs text-blue-600 cursor-pointer">
        +{results.length - 3} daha fazla sonuç...
      </div>
    )}
  </div>
);

export default ClinicalCaseComponent;