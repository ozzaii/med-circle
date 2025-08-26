import React, { useState, useEffect } from 'react';
import { Brain, Layers, Zap, Target, Award, ChevronRight, Lock, Unlock, BookOpen, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getClinicalAIService } from '../services/clinicalAI';

interface IntuitionLayer {
  id: string;
  name: string;
  description: string;
  skills: string[];
  exercises: Exercise[];
  mastery: number;
  unlocked: boolean;
}

interface Exercise {
  id: string;
  type: 'pattern-recognition' | 'clinical-reasoning' | 'decision-speed' | 'diagnostic-accuracy';
  title: string;
  difficulty: number;
  timeLimit?: number;
  scenario: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  points: number;
  completed: boolean;
}

interface LearningMetrics {
  patternRecognition: number;
  clinicalReasoning: number;
  decisionSpeed: number;
  diagnosticAccuracy: number;
  overallIntuition: number;
}

const INTUITION_LAYERS: IntuitionLayer[] = [
  {
    id: 'layer-1-foundation',
    name: 'Temel Patern Tanıma',
    description: 'Klinik bulguları hızlıca tanıma ve sınıflandırma',
    skills: [
      'Vital bulgu interpretation',
      'Lab sonuç pattern analizi',
      'Semptom clustering',
      'Red flag tanıma'
    ],
    exercises: [
      {
        id: 'ex-1-1',
        type: 'pattern-recognition',
        title: 'Sepsis Pattern Tanıma',
        difficulty: 1,
        timeLimit: 30,
        scenario: 'Hasta: 65 yaş, ateş 38.9°C, nabız 118, TA 85/50, laktat 4.2, WBC 18000',
        options: [
          'Sepsis - qSOFA pozitif',
          'Dehidratasyon',
          'Kardiyojenik şok',
          'Anafilaksi'
        ],
        correctAnswer: 'Sepsis - qSOFA pozitif',
        explanation: 'Hipotansiyon + takikardi + yüksek laktat = Sepsis pattern. qSOFA ≥2 pozitif.',
        points: 10,
        completed: false
      },
      {
        id: 'ex-1-2',
        type: 'pattern-recognition',
        title: 'EKG Pattern: STEMI',
        difficulty: 2,
        timeLimit: 20,
        scenario: 'EKG: V1-V4 derivasyonlarında 3mm ST elevasyonu, reciprocal ST depresyonu inferior',
        options: [
          'Anterior STEMI',
          'Inferior STEMI',
          'Perikardit',
          'Early repolarizasyon'
        ],
        correctAnswer: 'Anterior STEMI',
        explanation: 'V1-V4 ST elevasyonu = Anterior duvar MI. LAD tıkanıklığı düşün.',
        points: 15,
        completed: false
      }
    ],
    mastery: 0,
    unlocked: true
  },
  {
    id: 'layer-2-integration',
    name: 'Klinik Entegrasyon',
    description: 'Multipl bulguları sentezleyerek tanıya ulaşma',
    skills: [
      'Multisistem değerlendirme',
      'Temporal pattern analizi',
      'Risk stratifikasyonu',
      'Differential diagnosis daraltma'
    ],
    exercises: [
      {
        id: 'ex-2-1',
        type: 'clinical-reasoning',
        title: 'Kompleks Vaka Sentezi',
        difficulty: 3,
        scenario: '45 yaş kadın: 3 gündür nefes darlığı, bacak ödemi, JVD+, ral+, ProBNP 3500',
        options: [
          'Akut kalp yetmezliği dekompansasyonu',
          'Pulmoner emboli',
          'Pnömoni + ARDS',
          'Nefrotik sendrom'
        ],
        correctAnswer: 'Akut kalp yetmezliği dekompansasyonu',
        explanation: 'JVD + bilateral ral + ödem + yüksek ProBNP = Kalp yetmezliği klasik triadı',
        points: 20,
        completed: false
      }
    ],
    mastery: 0,
    unlocked: false
  },
  {
    id: 'layer-3-speed',
    name: 'Hızlı Karar Verme',
    description: 'Kritik durumlarda saniyeler içinde doğru karar',
    skills: [
      'Triaj önceliklendirme',
      'Hayat kurtaran müdahaleler',
      'Protokol aktivasyonu',
      'Ekip mobilizasyonu'
    ],
    exercises: [
      {
        id: 'ex-3-1',
        type: 'decision-speed',
        title: 'Cardiac Arrest Yönetimi',
        difficulty: 4,
        timeLimit: 10,
        scenario: 'Hasta arrest oldu! İlk müdahale?',
        options: [
          'CPR başlat + Defibrilatör çağır',
          'Önce EKG çek',
          'IV access kur',
          'Entübasyon hazırlığı'
        ],
        correctAnswer: 'CPR başlat + Defibrilatör çağır',
        explanation: 'Arrest durumunda saniyeler kritik. Hemen CPR + erken defibrilasyon hayat kurtarır.',
        points: 25,
        completed: false
      }
    ],
    mastery: 0,
    unlocked: false
  },
  {
    id: 'layer-4-mastery',
    name: 'Uzman Sezgisi',
    description: 'Deneyimli hekimlerin "6. his" yeteneği',
    skills: [
      'Subtle bulgu yakalama',
      'Gestalt tanı',
      'Komplikasyon öngörüsü',
      'Klinik his'
    ],
    exercises: [
      {
        id: 'ex-4-1',
        type: 'diagnostic-accuracy',
        title: 'Zor Tanı: Atipik Prezentasyon',
        difficulty: 5,
        scenario: 'Yaşlı hasta: Konfüzyon, subfebril ateş, minimal karın hassasiyeti, lökositoz yok',
        options: [
          'Erken apandisit - yaşlıda atipik',
          'UTI',
          'Delirium',
          'Elektrolit imbalansı'
        ],
        correctAnswer: 'Erken apandisit - yaşlıda atipik',
        explanation: 'Yaşlılarda apandisit klasik bulgu vermez. Konfüzyon tek bulgu olabilir!',
        points: 30,
        completed: false
      }
    ],
    mastery: 0,
    unlocked: false
  }
];

export default function MedicalIntuition() {
  const [layers, setLayers] = useState<IntuitionLayer[]>(INTUITION_LAYERS);
  const [activeLayer, setActiveLayer] = useState<IntuitionLayer | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [metrics, setMetrics] = useState<LearningMetrics>({
    patternRecognition: 0,
    clinicalReasoning: 0,
    decisionSpeed: 0,
    diagnosticAccuracy: 0,
    overallIntuition: 0
  });
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (activeExercise?.timeLimit && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleTimeout();
    }
  }, [timeRemaining, activeExercise]);

  useEffect(() => {
    updateOverallIntuition();
    checkLayerUnlocks();
  }, [metrics]);

  const startExercise = (exercise: Exercise, layer: IntuitionLayer) => {
    setActiveExercise(exercise);
    setActiveLayer(layer);
    setSelectedAnswer('');
    setShowFeedback(false);
    if (exercise.timeLimit) {
      setTimeRemaining(exercise.timeLimit);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!activeExercise || showFeedback) return;
    
    setSelectedAnswer(answer);
    const correct = answer === activeExercise.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimeRemaining(null);

    if (correct) {
      setTotalPoints(totalPoints + activeExercise.points);
      updateMetrics(activeExercise.type, true);
      markExerciseComplete(activeExercise.id);
    } else {
      updateMetrics(activeExercise.type, false);
    }
  };

  const handleTimeout = () => {
    if (!activeExercise || showFeedback) return;
    
    setShowFeedback(true);
    setIsCorrect(false);
    updateMetrics(activeExercise.type, false);
  };

  const updateMetrics = (type: string, success: boolean) => {
    const increment = success ? 10 : -5;
    setMetrics(prev => {
      const updated = { ...prev };
      switch (type) {
        case 'pattern-recognition':
          updated.patternRecognition = Math.max(0, Math.min(100, prev.patternRecognition + increment));
          break;
        case 'clinical-reasoning':
          updated.clinicalReasoning = Math.max(0, Math.min(100, prev.clinicalReasoning + increment));
          break;
        case 'decision-speed':
          updated.decisionSpeed = Math.max(0, Math.min(100, prev.decisionSpeed + increment));
          break;
        case 'diagnostic-accuracy':
          updated.diagnosticAccuracy = Math.max(0, Math.min(100, prev.diagnosticAccuracy + increment));
          break;
      }
      return updated;
    });
  };

  const updateOverallIntuition = () => {
    const overall = (
      metrics.patternRecognition * 0.25 +
      metrics.clinicalReasoning * 0.35 +
      metrics.decisionSpeed * 0.20 +
      metrics.diagnosticAccuracy * 0.20
    );
    setMetrics(prev => ({ ...prev, overallIntuition: Math.round(overall) }));
  };

  const markExerciseComplete = (exerciseId: string) => {
    setLayers(prev => prev.map(layer => ({
      ...layer,
      exercises: layer.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: true } : ex
      ),
      mastery: layer.exercises.some(ex => ex.id === exerciseId)
        ? Math.min(100, layer.mastery + 20)
        : layer.mastery
    })));
  };

  const checkLayerUnlocks = () => {
    setLayers(prev => prev.map((layer, index) => {
      if (index === 0) return layer;
      const previousLayer = prev[index - 1];
      return {
        ...layer,
        unlocked: previousLayer.mastery >= 60
      };
    }));
  };

  const nextExercise = () => {
    if (!activeLayer) return;
    
    const currentIndex = activeLayer.exercises.findIndex(ex => ex.id === activeExercise?.id);
    const nextEx = activeLayer.exercises[currentIndex + 1];
    
    if (nextEx) {
      startExercise(nextEx, activeLayer);
    } else {
      setActiveExercise(null);
      setActiveLayer(null);
    }
  };

  if (activeExercise && activeLayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{activeLayer.name}</h2>
                <h3 className="text-xl text-cyan-400">{activeExercise.title}</h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Zorluk</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded ${
                          i < activeExercise.difficulty
                            ? 'bg-gradient-to-t from-red-500 to-yellow-500'
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {timeRemaining !== null && !showFeedback && (
                  <div className={`text-2xl font-bold ${
                    timeRemaining < 10 ? 'text-red-400 animate-pulse' : 'text-white'
                  }`}>
                    {timeRemaining}s
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <p className="text-lg text-white leading-relaxed">{activeExercise.scenario}</p>
            </div>

            {activeExercise.options && (
              <div className="space-y-3 mb-6">
                {activeExercise.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      showFeedback
                        ? selectedAnswer === option
                          ? isCorrect
                            ? 'bg-green-500/30 border-2 border-green-400'
                            : 'bg-red-500/30 border-2 border-red-400'
                          : option === activeExercise.correctAnswer
                          ? 'bg-green-500/30 border-2 border-green-400'
                          : 'bg-black/20 border border-gray-600'
                        : 'bg-black/30 border border-gray-600 hover:border-cyan-400'
                    }`}
                  >
                    <p className="text-white font-medium">{option}</p>
                  </motion.button>
                ))}
              </div>
            )}

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl mb-6 ${
                  isCorrect ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Award className={`w-6 h-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
                  <p className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Doğru!' : timeRemaining === 0 ? 'Süre Doldu!' : 'Yanlış'}
                  </p>
                  {isCorrect && (
                    <span className="text-yellow-400 font-bold">+{activeExercise.points} puan</span>
                  )}
                </div>
                <p className="text-gray-300">{activeExercise.explanation}</p>
              </motion.div>
            )}

            {showFeedback && (
              <button
                onClick={nextExercise}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                Sonraki Alıştırma
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-purple-400" />
            Medical Intuition Framework
          </h1>
          <p className="text-xl text-gray-300">4 Katmanlı Klinik Sezgi Geliştirme Sistemi</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-400" />
              Öğrenme Katmanları
            </h2>
            
            <div className="space-y-4">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border transition-all ${
                    layer.unlocked
                      ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 cursor-pointer hover:border-purple-400/50'
                      : 'bg-gray-900/30 border-gray-700/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {layer.unlocked ? (
                        <Unlock className="w-6 h-6 text-green-400 mt-1" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-500 mt-1" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Katman {index + 1}: {layer.name}
                        </h3>
                        <p className="text-gray-300 mb-3">{layer.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {layer.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Ustalık Seviyesi</span>
                      <span className="text-sm font-bold text-white">{layer.mastery}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${layer.mastery}%` }}
                      />
                    </div>
                  </div>

                  {layer.unlocked && (
                    <div className="mt-4 space-y-2">
                      {layer.exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => startExercise(exercise, layer)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            exercise.completed
                              ? 'bg-green-900/20 border border-green-500/30'
                              : 'bg-black/20 border border-gray-600 hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium flex items-center gap-2">
                              {exercise.completed && <Award className="w-4 h-4 text-green-400" />}
                              {exercise.title}
                            </span>
                            <span className="text-yellow-400 text-sm font-bold">
                              {exercise.points} puan
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Performans Metrikleri
              </h3>
              
              <div className="space-y-4">
                {Object.entries(metrics).map(([key, value]) => {
                  const label = key === 'patternRecognition' ? 'Patern Tanıma' :
                               key === 'clinicalReasoning' ? 'Klinik Akıl Yürütme' :
                               key === 'decisionSpeed' ? 'Karar Hızı' :
                               key === 'diagnosticAccuracy' ? 'Tanı Doğruluğu' :
                               'Genel Sezgi';
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{label}</span>
                        <span className="text-sm font-bold text-white">{value}%</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            key === 'overallIntuition'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Başarılar
              </h3>
              
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-400 mb-2">{totalPoints}</p>
                <p className="text-gray-300">Toplam Puan</p>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-400 font-medium">Tamamlanan Alıştırmalar</p>
                  <p className="text-2xl font-bold text-white">
                    {layers.reduce((acc, layer) => 
                      acc + layer.exercises.filter(ex => ex.completed).length, 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}