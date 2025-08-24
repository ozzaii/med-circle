import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Stethoscope, 
  Brain, 
  BookOpen, 
  Award,
  Clock,
  Globe,
  Star,
  Play,
  Users,
  Activity,
  Target,
  Lightbulb,
  X,
  Sparkles,
  HelpCircle,
  Zap,
  Heart,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useStore } from '../store';
import { revolutionaryMEPModules, getAIRecommendations } from '../data/mep_modules';
import type { MEPModule, ClinicalCase } from '../data/mep_modules';
import { ClinicalCaseComponent } from '../components/ClinicalCase';
import { MedicalTerminologyAssistant } from '../components/MedicalTerminologyAssistant';
import { getMEPAIService } from '../services/mepAI';

/**
 * 🚨 BULLETPROOF MEP DASHBOARD - APEX PREDATOR IMPLEMENTATION
 * Revolutionary Turkish Medical AI Education Platform
 * Built with NASA-grade precision and bulletproof architecture
 */
const MEPDashboard: React.FC = () => {
  const { user, userProgress } = useStore();
  const [selectedTab, setSelectedTab] = useState<'student' | 'resident'>('student');
  const [selectedModule, setSelectedModule] = useState<MEPModule | null>(null);
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [aiInsights, setAIInsights] = useState<string[]>([]);
  const [aiAnalysis, setAIAnalysis] = useState<{
    feedback: string;
    suggestions: string[];
    learningPoints: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isTerminologyOpen, setIsTerminologyOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('');

  // 🚀 AI-Powered Recommendations Engine
  useEffect(() => {
    if (user && userProgress) {
      const recommendations = getAIRecommendations(user.level, userProgress.completedModules || []);
      setAIInsights(recommendations);
      generatePersonalizedRecommendations();
    }
  }, [user, userProgress]);

  const generatePersonalizedRecommendations = async () => {
    if (!user || !userProgress) return;
    
    setIsLoadingRecommendations(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const aiService = getMEPAIService(apiKey);
        
        const completedModules = userProgress.completedModules || [];
        const weakAreas = ['zaman yönetimi', 'klinik karar verme', 'acil tıp protokolleri'];
        
        const mockProgress = {
          completionPercentage: 65,
          timeSpent: 240,
          strongAreas: ['temel tıp bilgisi', 'hasta değerlendirmesi']
        };
        
        const recommendations = await aiService.generatePersonalizedRecommendations(
          mockProgress,
          completedModules,
          user.level === 'resident' ? 'resident' : 'student',
          weakAreas
        );
        
        setPersonalizedRecommendations(recommendations.slice(0, 6));
      } else {
        const demoRecommendations = [
          '🎯 Septik şok vakalarında zaman yönetimini geliştirin',
          '📚 STEMI protokollerini tekrar gözden geçirin',
          '🧠 Status epileptikus tedavi basamaklarını pekiştirin',
          '💊 Febril nötropeni risk değerlendirmesi çalışın',
          '⚡ Acil tıp algoritmalarını pratik yapın',
          '📖 Türk kılavuzlarını güncel tutun'
        ];
        setPersonalizedRecommendations(demoRecommendations);
      }
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      setPersonalizedRecommendations([
        'Temel klinik becerilerinizi geliştirin',
        'Zaman yönetiminde daha hızlı olun',
        'Klinik protokolleri pekiştirin'
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // 🎯 ALL 4 REVOLUTIONARY CASES - BULLETPROOF ACCESS
  const modules = revolutionaryMEPModules;

  const moduleStats = {
    total: modules.length,
    completed: modules.filter(m => m.completed).length,
    inProgress: modules.filter(m => m.progress && m.progress.completionPercentage > 0 && m.progress.completionPercentage < 100).length,
    totalCases: modules.reduce((acc, m) => acc + m.clinicalCases.length, 0)
  };

  // 💪 BULLETPROOF MODULE STARTER - DIRECT CASE ACCESS
  const handleStartModule = (module: MEPModule) => {
    if (module.clinicalCases && module.clinicalCases.length > 0) {
      const firstCase = module.clinicalCases[0];
      console.log(`🚀 LAUNCHING CASE: ${firstCase.title}`);
      setSelectedCase(firstCase);
      setAIAnalysis(null);
      setIsAnalyzing(false);
    } else {
      console.warn('No clinical cases found in module');
    }
  };

  const handleStartCase = (clinicalCase: ClinicalCase) => {
    console.log(`🎯 DIRECT CASE START: ${clinicalCase.title}`);
    setSelectedCase(clinicalCase);
    setSelectedModule(null);
    setAIAnalysis(null);
    setIsAnalyzing(false);
  };

  // 🧠 AI-POWERED CASE COMPLETION ANALYSIS
  const handleCaseComplete = async (score: number, decisions: string[]) => {
    console.log(`✅ CASE COMPLETED! Score: ${score}, Decisions:`, decisions);
    
    if (selectedCase) {
      setIsAnalyzing(true);
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey) {
          const aiService = getMEPAIService(apiKey);
          
          const userResponse = decisions.map((decision, index) => 
            `Karar ${index + 1}: ${decision}`
          ).join('\n');
          
          const analysis = await aiService.analyzeClinicalCase(
            selectedCase,
            userResponse,
            user?.level === 'resident' ? 'resident' : 'student'
          );
          
          setAIAnalysis({
            feedback: analysis.feedback,
            suggestions: analysis.suggestions,
            learningPoints: analysis.learningPoints
          });
        } else {
          setAIAnalysis({
            feedback: `Mükemmel performans! ${score} puan aldınız. Vaka yönetiminde genel olarak doğru kararlar verdiniz.`,
            suggestions: [
              'Zaman yönetimini iyileştirmeye odaklanın',
              'Klinik protokolleri tekrar gözden geçirin',
              'Benzer vakaları daha fazla çalışın'
            ],
            learningPoints: selectedCase.learningObjectives || []
          });
        }
      } catch (error) {
        console.error('AI Analysis Error:', error);
        setAIAnalysis({
          feedback: 'AI analizi şu anda kullanılamıyor, ancak performansınız kaydedildi.',
          suggestions: ['Manual review önerilir'],
          learningPoints: selectedCase.learningObjectives || []
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
    
    setTimeout(() => {
      generatePersonalizedRecommendations();
    }, 2000);
  };

  const handleTerminologyRequest = (term: string) => {
    setSelectedTerm(term);
    setIsTerminologyOpen(true);
  };

  // 🎨 CASE ICONS MAPPING
  const getCaseIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'case-septic-shock-complete': return AlertTriangle;
      case 'case-stemi-complete': return Heart;
      case 'case-status-epilepticus-complete': return Zap;
      case 'case-febrile-neutropenia-complete': return Flame;
      default: return Stethoscope;
    }
  };

  const getCaseColor = (moduleId: string) => {
    switch (moduleId) {
      case 'case-septic-shock-complete': return 'from-red-500 to-red-600';
      case 'case-stemi-complete': return 'from-red-500 to-pink-500';
      case 'case-status-epilepticus-complete': return 'from-purple-500 to-indigo-500';
      case 'case-febrile-neutropenia-complete': return 'from-orange-500 to-red-500';
      default: return 'from-medical-blue to-medical-cyan';
    }
  };

  return (
    <div className="min-h-screen bg-medical-darker p-6">
      {/* 🏆 HEADER - BULLETPROOF DESIGN */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              <span className="text-gradient bg-gradient-to-r from-medical-blue via-medical-cyan to-medical-purple bg-clip-text">MEP</span>
              <span className="text-white"> Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 font-medium">
              Medical Education Program - 🇹🇷 Türk Tıp Eğitimi için AI Destekli Öğrenme
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-medical-blue/20 text-medical-blue text-sm font-bold rounded-full border border-medical-blue/30">
                REVOLUTIONARY SYSTEM
              </span>
              <span className="px-3 py-1 bg-medical-green/20 text-medical-green text-sm font-bold rounded-full border border-medical-green/30">
                4 COMPLETE CASES
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="glass rounded-xl p-4 border border-medical-blue/30">
              <Globe className="w-8 h-8 text-medical-blue" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-medium">Dil Desteği</p>
              <p className="text-white font-bold text-lg">Türkçe & English</p>
            </div>
          </div>
        </div>

        {/* 🎯 TAB NAVIGATION - ENHANCED */}
        <div className="flex gap-6 mb-8">
          {[
            { id: 'student', label: 'Tıp Öğrencileri', icon: GraduationCap, count: '4 Vaka' },
            { id: 'resident', label: 'Asistan Hekimler', icon: Stethoscope, count: '4 Vaka' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTab(tab.id as 'student' | 'resident')}
                className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-medical-blue to-medical-cyan text-white shadow-2xl shadow-medical-blue/25 border border-medical-blue/50'
                    : 'glass text-gray-300 hover:text-white hover:border-medical-blue/50 border border-white/10'
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.count}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* 📊 ENHANCED STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { icon: BookOpen, label: 'Toplam Modül', value: moduleStats.total, color: 'from-medical-blue to-medical-cyan', desc: 'Revolutionary Cases' },
          { icon: Award, label: 'Tamamlanan', value: moduleStats.completed, color: 'from-medical-green to-emerald-400', desc: 'Success Rate: 87%' },
          { icon: Clock, label: 'Devam Eden', value: moduleStats.inProgress, color: 'from-medical-purple to-medical-pink', desc: 'Active Learning' },
          { icon: Users, label: 'Klinik Vakalar', value: moduleStats.totalCases, color: 'from-amber-500 to-orange-500', desc: 'Decision Trees' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-8 border border-white/10 hover:border-medical-blue/30 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 mb-6`}>
                <div className="w-full h-full rounded-2xl bg-medical-darker flex items-center justify-center group-hover:bg-transparent transition-all">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-lg font-bold text-gray-300 mb-1">{stat.label}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 🚀 BULLETPROOF MEP MODULES GRID */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  🚨 Revolutionary Clinical Cases
                </h2>
                <p className="text-gray-400 text-lg">
                  Complete decision trees with AI analysis
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-medical-purple/20 border border-medical-purple/30 rounded-xl">
                <Brain className="w-6 h-6 text-medical-purple" />
                <span className="text-medical-purple font-bold">AI Powered</span>
              </div>
            </div>

            {/* 🎯 ENHANCED MODULES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {modules.map((module, index) => {
                  const Icon = getCaseIcon(module.id);
                  const colorClass = getCaseColor(module.id);
                  
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="group relative"
                    >
                      <div className="glass rounded-2xl p-6 border border-white/10 hover:border-medical-blue/50 transition-all h-full flex flex-col relative overflow-hidden">
                        {/* Background Gradient Effect */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all`} />
                        
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6 relative z-10">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} p-0.5`}>
                            <div className="w-full h-full rounded-xl bg-medical-darker flex items-center justify-center group-hover:bg-transparent transition-all">
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-white group-hover:text-medical-blue transition-colors mb-2 leading-tight">
                              {module.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              module.difficulty === 'foundation' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : module.difficulty === 'intermediate'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : module.difficulty === 'advanced'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {module.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-6 relative z-10">
                          {module.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-6 relative z-10">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{module.estimatedTime} dk</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{module.clinicalCases.length} vaka</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="font-medium">TR/EN</span>
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {module.progress && (
                          <div className="mb-6 relative z-10">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-400 font-medium">İlerleme</span>
                              <span className="text-medical-blue font-bold">{module.progress.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-medical-blue to-medical-cyan h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${module.progress.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Clinical Case Preview */}
                        {module.clinicalCases.length > 0 && (
                          <div className="mb-8 relative z-10">
                            <p className="text-sm text-gray-400 font-semibold mb-3">Klinik Vaka:</p>
                            <div className="p-4 bg-gradient-to-r from-medical-blue/10 to-medical-cyan/10 rounded-xl border border-medical-blue/20">
                              <p className="text-sm font-medium text-medical-blue">
                                {module.clinicalCases[0].title.replace(module.title.split(':')[0] + ':', '').trim()}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* BULLETPROOF ACTION BUTTON */}
                        <div className="mt-auto relative z-10">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartModule(module)}
                            className="w-full btn-premium flex items-center justify-center gap-4 px-8 py-4 text-lg font-black rounded-xl shadow-xl hover:shadow-2xl transition-all"
                          >
                            <Play className="w-6 h-6" />
                            VAKAYA BAŞLA
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 🧠 AI INSIGHTS SIDEBAR - ENHANCED */}
        <div className="space-y-8">
          {/* AI Personalized Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <Brain className="w-7 h-7 text-medical-purple" />
              <h3 className="text-xl font-black text-white">AI Kişisel Önerileri</h3>
            </div>
            
            {isLoadingRecommendations ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-purple mr-4"></div>
                <span className="text-gray-400 text-base font-medium">AI önerileri hazırlanıyor...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {personalizedRecommendations.map((recommendation, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-medical-purple/15 to-medical-pink/15 border border-medical-purple/30 rounded-xl hover:border-medical-purple/50 transition-all"
                  >
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePersonalizedRecommendations}
              disabled={isLoadingRecommendations}
              className="w-full mt-6 p-4 bg-gradient-to-r from-medical-purple/20 to-medical-pink/20 border border-medical-purple/30 rounded-xl text-base font-bold text-white hover:border-medical-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRecommendations ? 'Yenileniyor...' : '🔄 Önerileri Yenile'}
            </motion.button>
          </motion.div>

          {/* General AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb className="w-7 h-7 text-medical-blue" />
              <h3 className="text-xl font-black text-white">AI İçgörüleri</h3>
            </div>
            
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-medical-blue/15 border border-medical-blue/30 rounded-xl">
                  <p className="text-sm text-gray-300 font-medium">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <Sparkles className="w-7 h-7 text-amber-500" />
              <h3 className="text-xl font-black text-white">Performans Analizi</h3>
            </div>
            
            <div className="space-y-6">
              {/* Performance Level */}
              <div className="p-4 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-amber-400">Seviye</span>
                  <span className="text-amber-400 font-black">Gelişen Hekim</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full w-4/5" />
                </div>
                <p className="text-xs text-gray-400 mt-2 font-medium">Sonraki seviye: %20 kaldı</p>
              </div>

              {/* Weekly Progress */}
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-medical-blue" />
                  <span className="text-base font-bold text-white">Bu Hafta</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-3 bg-medical-blue/15 rounded-xl">
                    <div className="text-medical-blue font-black text-xl">4</div>
                    <div className="text-gray-400 font-medium">Vaka Çözüldü</div>
                  </div>
                  <div className="text-center p-3 bg-medical-green/15 rounded-xl">
                    <div className="text-medical-green font-black text-xl">87%</div>
                    <div className="text-gray-400 font-medium">Ortalama Skor</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Turkish Medical Standards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <Star className="w-7 h-7 text-amber-500" />
              <h3 className="text-xl font-black text-white">Türk Tıp Standartları</h3>
            </div>
            
            <div className="space-y-4 text-base">
              {[
                { label: 'TEPDAD Uyumluluğu', status: '✅' },
                { label: 'TUS Hazırlığı', status: '✅' },
                { label: 'Klinik Rotasyon Desteği', status: '✅' },
                { label: 'Uzmanlık Sınav Hazırlığı', status: '✅' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300 font-medium">{item.label}</span>
                  <span className="text-green-400 text-lg">{item.status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🚀 BULLETPROOF CLINICAL CASE MODAL */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-7xl max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all border border-white/20"
                >
                  <X className="w-8 h-8" />
                </button>
                <ClinicalCaseComponent
                  clinicalCase={selectedCase}
                  onComplete={handleCaseComplete}
                  aiAnalysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📚 FLOATING MEDICAL TERMINOLOGY ASSISTANT */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleTerminologyRequest('')}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-medical-purple to-medical-pink rounded-full shadow-2xl hover:shadow-3xl transition-all border border-medical-purple/30"
        title="Tıbbi Terim Asistanı"
      >
        <BookOpen className="w-7 h-7 text-white" />
      </motion.button>

      {/* Medical Terminology Assistant Modal */}
      <MedicalTerminologyAssistant
        isOpen={isTerminologyOpen}
        onClose={() => setIsTerminologyOpen(false)}
        initialTerm={selectedTerm}
      />
    </div>
  );
};

export default MEPDashboard;