import React, { useState, useEffect } from 'react';
import { Brain, Heart, Activity, AlertCircle, Clock, ChevronRight, RotateCcw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationBranch {
  id: string;
  condition: string;
  probability: number;
  consequences: string[];
  nextDecisions?: DecisionPoint[];
}

interface DecisionPoint {
  id: string;
  question: string;
  context: string;
  timeLimit?: number;
  criticalLevel: 'low' | 'medium' | 'high' | 'critical';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    branches: SimulationBranch[];
    explanation: string;
    points: number;
  }[];
  patientData?: {
    vitals?: Record<string, string>;
    labs?: Record<string, string>;
    imaging?: string[];
    history?: string[];
  };
}

interface SimulationScenario {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'intern' | 'resident' | 'fellow' | 'attending';
  estimatedTime: number;
  description: string;
  learningObjectives: string[];
  initialPatientPresentation: string;
  decisionTree: DecisionPoint[];
  scoringRubric: {
    perfect: number;
    good: number;
    passing: number;
  };
}

const ADVANCED_SIMULATIONS: SimulationScenario[] = [
  {
    id: 'trauma-polytrauma',
    title: 'Çoklu Travma Yönetimi',
    specialty: 'Emergency Medicine',
    difficulty: 'resident',
    estimatedTime: 45,
    description: 'Trafik kazası sonrası çoklu travmalı hasta yönetimi',
    learningObjectives: [
      'ATLS protokollerinin uygulanması',
      'Triaj ve önceliklendirme',
      'Damage control resüsitasyon',
      'Multidisipliner ekip koordinasyonu'
    ],
    initialPatientPresentation: '28 yaşında erkek hasta, yüksek hızlı araç kazası sonrası acile getirildi. GKS: 13, hipotansif, takipneik.',
    decisionTree: [
      {
        id: 'initial-assessment',
        question: 'İlk değerlendirme ve müdahale önceliğiniz?',
        context: 'Hasta acil servise yeni geldi. TA: 85/50, Nabız: 128, SatO2: 89%, GKS: 13',
        timeLimit: 120,
        criticalLevel: 'critical',
        options: [
          {
            id: 'abc-primary',
            text: 'Primary Survey (ABCDE) başlat ve C-spine stabilizasyonu',
            isCorrect: true,
            branches: [
              {
                id: 'airway-secured',
                condition: 'Airway patent, C-spine korundu',
                probability: 0.9,
                consequences: ['Hava yolu güvende', 'Servikal travma riski azaldı'],
                nextDecisions: [
                  {
                    id: 'breathing-assessment',
                    question: 'Solunum değerlendirmesinde tension pnömotoraks bulguları?',
                    context: 'Sağ hemitoraksta solunum sesleri azalmış, trakea sola deviye',
                    timeLimit: 60,
                    criticalLevel: 'critical',
                    options: [
                      {
                        id: 'needle-decompression',
                        text: 'Acil needle dekompresyon yap',
                        isCorrect: true,
                        branches: [
                          {
                            id: 'successful-decompression',
                            condition: 'Dekompresyon başarılı',
                            probability: 0.85,
                            consequences: ['Vital bulgular düzeldi', 'SatO2 %95\'e yükseldi']
                          }
                        ],
                        explanation: 'Tension pnömotoraks hayatı tehdit eden acil durumdur',
                        points: 30
                      }
                    ]
                  }
                ]
              }
            ],
            explanation: 'ATLS protokolüne göre sistematik yaklaşım hayat kurtarır',
            points: 25
          },
          {
            id: 'direct-imaging',
            text: 'Hemen BT çek, yaralanmaları tespit et',
            isCorrect: false,
            branches: [
              {
                id: 'patient-deteriorated',
                condition: 'Hasta BT\'de arrest oldu',
                probability: 0.7,
                consequences: ['Kardiyak arrest', 'CPR başlatıldı', 'Kötü prognoz']
              }
            ],
            explanation: 'Unstable hastada BT kontraendikedir, önce stabilizasyon!',
            points: -20
          }
        ],
        patientData: {
          vitals: {
            'Tansiyon': '85/50 mmHg',
            'Nabız': '128/dk',
            'Solunum': '28/dk',
            'Ateş': '36.2°C',
            'SatO2': '%89'
          },
          labs: {
            'Hgb': '9.2 g/dL',
            'Hct': '%27',
            'Laktat': '4.8 mmol/L',
            'BE': '-8'
          }
        }
      }
    ],
    scoringRubric: {
      perfect: 100,
      good: 75,
      passing: 60
    }
  },
  {
    id: 'pediatric-meningitis',
    title: 'Pediatrik Menenjit Yönetimi',
    specialty: 'Pediatrics',
    difficulty: 'resident',
    estimatedTime: 30,
    description: '3 yaşında çocukta akut bakteriyel menenjit şüphesi',
    learningObjectives: [
      'Pediatrik menenjit tanı kriterleri',
      'Ampirik antibiyotik seçimi',
      'Komplikasyon yönetimi',
      'Aile iletişimi'
    ],
    initialPatientPresentation: '3 yaşında kız, 2 gündür ateş, kusma, ense sertliği ile başvurdu. Peteşiyal döküntü mevcut.',
    decisionTree: [
      {
        id: 'initial-pediatric',
        question: 'Meningokok menenjiti şüphesi - ilk yaklaşım?',
        context: 'Ateş: 39.5°C, ense sertliği (+), peteşiyal döküntü yaygınlaşıyor',
        timeLimit: 180,
        criticalLevel: 'critical',
        options: [
          {
            id: 'immediate-antibiotics',
            text: 'Kan kültürü al ve hemen seftriakson + vankomisin başla',
            isCorrect: true,
            branches: [
              {
                id: 'antibiotics-started',
                condition: 'Antibiyotikler başlandı',
                probability: 0.95,
                consequences: ['Mortalite riski azaldı', 'Sepsis progresyonu durduruldu']
              }
            ],
            explanation: 'Meningokok menenjitinde dakikalar hayat kurtarır',
            points: 30
          },
          {
            id: 'lp-first',
            text: 'Önce LP yap, kültür sonucuna göre antibiyotik',
            isCorrect: false,
            branches: [
              {
                id: 'delayed-treatment',
                condition: 'Tedavi gecikti',
                probability: 0.8,
                consequences: ['Septik şok gelişti', 'Nörolojik sekel riski arttı']
              }
            ],
            explanation: 'LP antibiyotiği geciktirmemeli, ampirik tedavi öncelikli!',
            points: -15
          }
        ]
      }
    ],
    scoringRubric: {
      perfect: 100,
      good: 80,
      passing: 65
    }
  }
];

export default function MedRESIDENT() {
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationScenario | null>(null);
  const [currentDecision, setCurrentDecision] = useState<DecisionPoint | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<Array<{
    decision: DecisionPoint;
    choice: string;
    outcome: SimulationBranch;
    points: number;
  }>>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [patientStatus, setPatientStatus] = useState({
    stable: true,
    complications: [] as string[],
    improvements: [] as string[]
  });

  useEffect(() => {
    if (currentDecision?.timeLimit && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleTimeout();
    }
  }, [timeRemaining, currentDecision]);

  const startSimulation = (simulation: SimulationScenario) => {
    setSelectedSimulation(simulation);
    setCurrentDecision(simulation.decisionTree[0]);
    setDecisionHistory([]);
    setTotalScore(0);
    setSimulationComplete(false);
    setPatientStatus({ stable: true, complications: [], improvements: [] });
    if (simulation.decisionTree[0].timeLimit) {
      setTimeRemaining(simulation.decisionTree[0].timeLimit);
    }
  };

  const handleDecision = (optionId: string) => {
    if (!currentDecision || !selectedSimulation) return;

    const selectedOption = currentDecision.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    const outcome = selectedOption.branches[0];
    
    setDecisionHistory([...decisionHistory, {
      decision: currentDecision,
      choice: selectedOption.text,
      outcome,
      points: selectedOption.points
    }]);

    setTotalScore(totalScore + selectedOption.points);

    if (outcome.consequences) {
      if (selectedOption.isCorrect) {
        setPatientStatus(prev => ({
          ...prev,
          improvements: [...prev.improvements, ...outcome.consequences]
        }));
      } else {
        setPatientStatus(prev => ({
          ...prev,
          stable: false,
          complications: [...prev.complications, ...outcome.consequences]
        }));
      }
    }

    if (outcome.nextDecisions && outcome.nextDecisions.length > 0) {
      setCurrentDecision(outcome.nextDecisions[0]);
      if (outcome.nextDecisions[0].timeLimit) {
        setTimeRemaining(outcome.nextDecisions[0].timeLimit);
      } else {
        setTimeRemaining(null);
      }
    } else {
      completeSimulation();
    }
  };

  const handleTimeout = () => {
    if (!currentDecision) return;
    
    setPatientStatus(prev => ({
      ...prev,
      stable: false,
      complications: [...prev.complications, 'Kritik zaman aşıldı - hasta durumu kötüleşti']
    }));
    
    setTotalScore(totalScore - 10);
    completeSimulation();
  };

  const completeSimulation = () => {
    setSimulationComplete(true);
    setTimeRemaining(null);
  };

  const getPerformanceLevel = () => {
    if (!selectedSimulation) return 'N/A';
    const percentage = (totalScore / selectedSimulation.scoringRubric.perfect) * 100;
    if (percentage >= 90) return 'Mükemmel';
    if (percentage >= 75) return 'İyi';
    if (percentage >= 60) return 'Geçer';
    return 'Geliştirilmeli';
  };

  const resetSimulation = () => {
    setSelectedSimulation(null);
    setCurrentDecision(null);
    setDecisionHistory([]);
    setTotalScore(0);
    setSimulationComplete(false);
    setPatientStatus({ stable: true, complications: [], improvements: [] });
    setTimeRemaining(null);
  };

  if (!selectedSimulation) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Brain className="w-12 h-12 text-cyan-400" />
              MedRESIDENT Simülasyonları
            </h1>
            <p className="text-xl text-gray-100">Gerçekçi klinik senaryolarla karar verme becerilerinizi geliştirin</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADVANCED_SIMULATIONS.map((sim, index) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-600 hover:border-cyan-400 transition-all cursor-pointer"
                onClick={() => startSimulation(sim)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{sim.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sim.difficulty === 'resident' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {sim.difficulty.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-100 mb-4">{sim.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {sim.specialty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {sim.estimatedTime} dk
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-cyan-400">Öğrenme Hedefleri:</h4>
                  <ul className="text-xs text-gray-100 space-y-1">
                    {sim.learningObjectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <ChevronRight className="w-3 h-3 mt-0.5 text-cyan-400" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all">
                  Simülasyonu Başlat
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (simulationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full border border-gray-600"
        >
          <div className="text-center mb-6">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Simülasyon Tamamlandı!</h2>
            <p className="text-xl text-gray-100">{selectedSimulation.title}</p>
          </div>

          <div className="bg-gray-800/90 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm">Toplam Puan</p>
                <p className="text-2xl font-bold text-white">{totalScore}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Performans</p>
                <p className="text-2xl font-bold text-cyan-400">{getPerformanceLevel()}</p>
              </div>
            </div>

            {patientStatus.complications.length > 0 && (
              <div className="mb-4">
                <p className="text-red-400 font-semibold mb-2">Komplikasyonlar:</p>
                <ul className="text-sm text-gray-100 space-y-1">
                  {patientStatus.complications.map((comp, i) => (
                    <li key={i}>• {comp}</li>
                  ))}
                </ul>
              </div>
            )}

            {patientStatus.improvements.length > 0 && (
              <div>
                <p className="text-green-400 font-semibold mb-2">Başarılar:</p>
                <ul className="text-sm text-gray-100 space-y-1">
                  {patientStatus.improvements.map((imp, i) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-white">Karar Geçmişi:</h3>
            {decisionHistory.map((history, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-3">
                <p className="text-sm text-gray-400 mb-1">{history.decision.question}</p>
                <p className="text-white font-medium">{history.choice}</p>
                <p className={`text-sm mt-1 ${history.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {history.points > 0 ? '+' : ''}{history.points} puan
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={resetSimulation}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Yeni Simülasyon
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-600"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{selectedSimulation.title}</h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Puan</p>
                <p className="text-xl font-bold text-cyan-400">{totalScore}</p>
              </div>
              {timeRemaining !== null && (
                <div className={`text-right ${timeRemaining < 30 ? 'text-red-400' : 'text-white'}`}>
                  <p className="text-sm text-gray-400">Süre</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg p-4 mb-6 border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-lg font-semibold text-white mb-2">Hasta Durumu</p>
                <p className="text-gray-200">{selectedSimulation.initialPatientPresentation}</p>
              </div>
            </div>
          </div>

          {currentDecision && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDecision.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    currentDecision.criticalLevel === 'critical' ? 'bg-red-500' :
                    currentDecision.criticalLevel === 'high' ? 'bg-orange-500' :
                    currentDecision.criticalLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  } text-white`}>
                    {currentDecision.criticalLevel.toUpperCase()} ÖNCELİK
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{currentDecision.question}</h3>
                  <p className="text-gray-100 mb-4">{currentDecision.context}</p>

                  {currentDecision.patientData && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {currentDecision.patientData.vitals && (
                        <div className="bg-gray-800/90 rounded-lg p-3 border border-gray-700">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Vital Bulgular</h4>
                          {Object.entries(currentDecision.patientData.vitals).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {currentDecision.patientData.labs && (
                        <div className="bg-gray-800/90 rounded-lg p-3 border border-gray-700">
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">Laboratuvar</h4>
                          {Object.entries(currentDecision.patientData.labs).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {currentDecision.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleDecision(option.id)}
                        className="w-full text-left p-4 bg-gray-800/90 rounded-lg border border-gray-600 hover:border-cyan-400 hover:bg-gray-700/90 transition-all"
                      >
                        <p className="text-white font-medium">{option.text}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {patientStatus.complications.length > 0 && (
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mt-4">
                    <p className="text-red-400 font-semibold mb-1">⚠️ Komplikasyonlar:</p>
                    <ul className="text-sm text-gray-100">
                      {patientStatus.complications.map((comp, i) => (
                        <li key={i}>• {comp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {patientStatus.improvements.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 mt-4">
                    <p className="text-green-400 font-semibold mb-1">✓ İyileşmeler:</p>
                    <ul className="text-sm text-gray-100">
                      {patientStatus.improvements.map((imp, i) => (
                        <li key={i}>• {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}