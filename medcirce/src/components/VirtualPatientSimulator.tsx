import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Heart,
  Brain,
  Stethoscope,
  Monitor,
  Zap,
  AlertTriangle,
  TrendingUp,
  Users,
  Mic,
  Video,
  Share2,
  Layers,
  Eye,
  Hand,
  Volume2,
  Cpu,
  ChevronRight,
  Clock,
  Target,
  BarChart3,
  Microscope,
  Network
} from 'lucide-react';
import {
  enhancedClinicalCases,
  revolutionaryMEPSystem,
  type VirtualPatientSimulation,
  type PhysiologicalModel,
  type AIReasoningEngine
} from '../data/mep_modules_enhanced';

export const VirtualPatientSimulator: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<VirtualPatientSimulation | null>(null);
  const [physiology, setPhysiology] = useState<PhysiologicalModel | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIReasoningEngine | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    // Simulate real-time physiological updates
    if (selectedCase && physiology) {
      const interval = setInterval(() => {
        setPhysiology(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            heartRate: [...prev.heartRate.slice(1), 
              prev.heartRate[prev.heartRate.length - 1] + Math.random() * 4 - 2],
            oxygenSaturation: [...prev.oxygenSaturation.slice(1),
              Math.max(85, Math.min(100, prev.oxygenSaturation[prev.oxygenSaturation.length - 1] + Math.random() * 2 - 1))]
          };
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [selectedCase, physiology]);

  const startSimulation = async (simulation: VirtualPatientSimulation) => {
    setSelectedCase(simulation);
    setPhysiology(simulation.digitalTwin.physiologicalModel);
    
    // AI Analysis
    const analysis = await revolutionaryMEPSystem.clinicalAI.analyzeCase(
      ['fever', 'hypotension', 'tachycardia'],
      simulation.digitalTwin.physiologicalModel,
      simulation.digitalTwin.physiologicalModel.labTrends
    );
    setAiAnalysis(analysis);
  };

  const VitalSignsMonitor = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 rounded-xl p-6 border border-cyan-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Real-Time Vitals Monitor
        </h3>
        <div className="flex gap-2">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
          <span className="text-xs text-gray-400">LIVE</span>
        </div>
      </div>

      {physiology && (
        <div className="grid grid-cols-2 gap-4">
          {/* Heart Rate */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Heart Rate</span>
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-mono text-white">
              {Math.round(physiology.heartRate[physiology.heartRate.length - 1])}
              <span className="text-sm text-gray-400 ml-1">bpm</span>
            </div>
            <div className="h-8 flex items-end gap-1 mt-2">
              {physiology.heartRate.slice(-10).map((hr, i) => (
                <div
                  key={i}
                  className="flex-1 bg-red-500/50 rounded-t"
                  style={{ height: `${(hr / 150) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Blood Pressure</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-mono text-white">
              {physiology.bloodPressure[physiology.bloodPressure.length - 1]?.systolic}/
              {physiology.bloodPressure[physiology.bloodPressure.length - 1]?.diastolic}
              <span className="text-sm text-gray-400 ml-1">mmHg</span>
            </div>
            <div className={`text-xs mt-2 ${
              physiology.bloodPressure[physiology.bloodPressure.length - 1]?.systolic < 90
                ? 'text-red-400' : 'text-green-400'
            }`}>
              {physiology.bloodPressure[physiology.bloodPressure.length - 1]?.systolic < 90
                ? '⚠️ Hypotensive' : 'Normal range'}
            </div>
          </div>

          {/* O2 Saturation */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">SpO₂</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono text-white">
              {Math.round(physiology.oxygenSaturation[physiology.oxygenSaturation.length - 1])}
              <span className="text-sm text-gray-400 ml-1">%</span>
            </div>
            <div className="h-8 flex items-end gap-1 mt-2">
              {physiology.oxygenSaturation.slice(-10).map((o2, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/50 rounded-t"
                  style={{ height: `${o2}%` }}
                />
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Temperature</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-mono text-white">
              {physiology.temperature[physiology.temperature.length - 1]?.toFixed(1)}
              <span className="text-sm text-gray-400 ml-1">°C</span>
            </div>
            <div className={`text-xs mt-2 ${
              physiology.temperature[physiology.temperature.length - 1] > 38
                ? 'text-orange-400' : 'text-green-400'
            }`}>
              {physiology.temperature[physiology.temperature.length - 1] > 38
                ? '🔥 Febrile' : 'Afebrile'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const AIReasoningPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30"
    >
      <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        AI Clinical Reasoning Engine
      </h3>

      {aiAnalysis && (
        <div className="space-y-4">
          {/* Differential Diagnosis */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Differential Diagnosis</h4>
            {aiAnalysis.differentialDiagnosis.map((dx, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-3 mb-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white">{dx.condition}</span>
                  <span className="text-sm px-2 py-1 bg-purple-500/20 rounded text-purple-300">
                    {dx.probability}% probability
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <div className="mb-1">
                    <span className="text-green-400">Supporting: </span>
                    {dx.supportingEvidence.slice(0, 2).join(', ')}
                  </div>
                  <div>
                    <span className="text-yellow-400">Next steps: </span>
                    {dx.nextSteps[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Predictive Analytics */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Predictive Analytics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Deterioration Risk</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${aiAnalysis.predictiveAnalytics.deteriorationRisk}%` }}
                      className={`h-full ${
                        aiAnalysis.predictiveAnalytics.deteriorationRisk > 70
                          ? 'bg-red-500' : aiAnalysis.predictiveAnalytics.deteriorationRisk > 40
                          ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {aiAnalysis.predictiveAnalytics.deteriorationRisk}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Critical Event Risk</span>
                <span className="text-xs text-orange-400">
                  {aiAnalysis.predictiveAnalytics.criticalEventProbability}% in next hour
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Intervention Window</span>
                <span className="text-xs text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {aiAnalysis.predictiveAnalytics.optimalInterventionWindow} minutes
                </span>
              </div>
            </div>
          </div>

          {/* Explainable AI */}
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">AI Reasoning</span>
              <span className="ml-auto text-xs px-2 py-1 bg-blue-500/20 rounded text-blue-300">
                {aiAnalysis.explainableAI.confidenceLevel}% confidence
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {aiAnalysis.explainableAI.reasoning}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const CollaborationPanel = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-6 border border-green-500/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-green-400 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Multi-User Collaboration
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {isRecording ? <div className="w-3 h-3 bg-white rounded-full animate-pulse" /> : <Mic className="w-4 h-4" />}
          </button>
          <button className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:bg-gray-600 transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:bg-gray-600 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {['Dr. Mehmet (Attending)', 'Ayşe (Resident)', 'Ali (Student)', 'AI Mentor'].map((user, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              user.includes('AI') ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-green-500 to-blue-500'
            }`}>
              {user.includes('AI') ? <Brain className="w-5 h-5 text-white" /> : user[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">{user}</div>
              <div className="text-xs text-gray-400">
                {user.includes('AI') ? 'Providing real-time guidance' : 'Active in simulation'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {idx === 0 && <Volume2 className="w-4 h-4 text-green-400 animate-pulse" />}
              {user.includes('VR') && <Eye className="w-4 h-4 text-cyan-400" />}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white font-medium hover:from-green-500 hover:to-blue-500 transition-colors">
        Invite Collaborator
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Virtual Patient Simulator 2025
          </h1>
          <p className="text-gray-400">
            Revolutionary medical training with Digital Twins, AI reasoning, and real-time collaboration
          </p>
        </motion.div>

        {/* Case Selection */}
        {!selectedCase ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enhancedClinicalCases.map((simulation) => (
              <motion.div
                key={simulation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => startSimulation(simulation)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{simulation.name}</h3>
                    <p className="text-gray-400 text-sm">{simulation.scenario}</p>
                  </div>
                  <div className="flex gap-2">
                    {simulation.hapticFeedback && (
                      <div className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
                        Haptic
                      </div>
                    )}
                    {simulation.multiplayerEnabled && (
                      <div className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">
                        Multiplayer
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <Stethoscope className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Physical Exam</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <Layers className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">Digital Twin</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <Network className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-gray-400">AI Analysis</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Monitor className="w-4 h-4" />
                    <span>{simulation.vrEnvironment.setting.toUpperCase()}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <h2 className="text-xl font-bold text-white">{selectedCase.name}</h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDigitalTwin(!showDigitalTwin)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showDigitalTwin 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  Digital Twin
                </button>
                <button
                  onClick={() => setIsVRMode(!isVRMode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isVRMode 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  VR Mode
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Vitals */}
              <div className="lg:col-span-1 space-y-6">
                <VitalSignsMonitor />
                
                {/* Lab Trends */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-800/50 rounded-xl p-4"
                >
                  <h3 className="text-sm font-bold text-gray-400 mb-3">Lab Trends</h3>
                  {selectedCase.digitalTwin.physiologicalModel.labTrends && 
                    Array.from(selectedCase.digitalTwin.physiologicalModel.labTrends.entries()).slice(0, 3).map(([lab, values]) => (
                      <div key={lab} className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">{lab}</span>
                          <span className={`text-white ${
                            lab === 'Lactate' && values[values.length - 1] > 4 ? 'text-red-400' : ''
                          }`}>
                            {values[values.length - 1]}
                          </span>
                        </div>
                        <div className="h-6 flex items-end gap-0.5">
                          {values.map((val, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-cyan-500/50 to-cyan-500/20 rounded-t"
                              style={{ height: `${(val / Math.max(...values)) * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </motion.div>
              </div>

              {/* Center Column - AI Analysis */}
              <div className="lg:col-span-1">
                <AIReasoningPanel />
              </div>

              {/* Right Column - Collaboration */}
              <div className="lg:col-span-1">
                <CollaborationPanel />
              </div>
            </div>

            {/* Action Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Available Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedCase.interactions.procedures.map((procedure) => (
                  <button
                    key={procedure}
                    className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
                  >
                    {procedure}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};