import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Stethoscope,
  Clock,
  Target,
  Flame,
  CheckCircle,
  BookOpen,
  Brain,
  Activity,
  Zap,
  Award,
  TrendingUp,
  Filter,
  Play,
  Volume2,
  VolumeX,
  ChevronRight,
  Star,
  Calendar,
  Bell
} from 'lucide-react';
import { useStore } from '../store';
import { medATLASStudent, medATLASResident, flashTasks, focusTasks, collections } from '../data/medatlas_content';
import type { MedATLASContent, FlashTask, FocusTask } from '../data/medatlas_content';

/**
 * 🏥 TÜRK TIP EĞİTİM PLATFORMU - MEP MODÜLLER
 * Öğrenci ve Asistan seviyeleri için ayrı tasarlanmış
 */

const TurkishMEPDashboard: React.FC = () => {
  const { user } = useStore();
  const [selectedLevel, setSelectedLevel] = useState<'student' | 'resident'>('student');
  const [selectedContent, setSelectedContent] = useState<MedATLASContent | null>(null);
  const [selectedTask, setSelectedTask] = useState<FlashTask | FocusTask | null>(null);
  const [streak, setStreak] = useState(23);
  const [weeklyGoals, setWeeklyGoals] = useState({ completed: 28, total: 30 });
  const [filter, setFilter] = useState({
    duration: 'all',
    difficulty: 'all',
    type: 'all'
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Seviyeye göre içerik al
  const currentContent = selectedLevel === 'student' ? medATLASStudent : medATLASResident;
  const currentCollections = collections[selectedLevel];

  // Günlük görevler
  const dailyTasks = [
    {
      id: 1,
      title: 'Sepsis Yönetimi Flash Görevi',
      duration: 7,
      type: 'flash',
      deadline: '14:00',
      points: 50
    },
    {
      id: 2,
      title: 'EKG Pattern Tanıma',
      duration: 5,
      type: 'flash',
      deadline: '18:00',
      points: 30
    },
    {
      id: 3,
      title: 'Akut Pankreatit Vaka Analizi',
      duration: 15,
      type: 'focus',
      deadline: '22:00',
      points: 100
    }
  ];

  // Text-to-speech fonksiyonu
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            MEP Modülleri - {selectedLevel === 'student' ? 'Öğrenci' : 'Asistan'}
          </h1>
          <p className="text-blue-100">
            Kişiselleştirilmiş tıp eğitimi yolculuğunuz
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
            <Flame className="w-6 h-6 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-blue-100">gün streak</div>
            </div>
          </div>
          
          {/* Weekly Goals */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
            <Target className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-xl font-bold text-white">
                {weeklyGoals.completed}/{weeklyGoals.total}
              </div>
              <div className="text-xs text-blue-100">haftalık hedef</div>
            </div>
          </div>
          
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );

  // Level Selector
  const LevelSelector = () => (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setSelectedLevel('student')}
        className={`flex-1 p-6 rounded-xl transition-all ${
          selectedLevel === 'student'
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <GraduationCap className="w-8 h-8 mb-3 mx-auto" />
        <h3 className="text-xl font-bold mb-2">MedATLAS Student</h3>
        <p className="text-sm opacity-90">Temel + TUS odaklı içerik</p>
        <div className="mt-4 space-y-1">
          <div className="text-xs">• Temel Bilimler</div>
          <div className="text-xs">• Klinik Giriş</div>
          <div className="text-xs">• TUS Destek</div>
        </div>
      </button>
      
      <button
        onClick={() => setSelectedLevel('resident')}
        className={`flex-1 p-6 rounded-xl transition-all ${
          selectedLevel === 'resident'
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg scale-105'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <Stethoscope className="w-8 h-8 mb-3 mx-auto" />
        <h3 className="text-xl font-bold mb-2">MedATLAS Resident</h3>
        <p className="text-sm opacity-90">Klinik uygulama + Karar desteği</p>
        <div className="mt-4 space-y-1">
          <div className="text-xs">• Acil Protokoller</div>
          <div className="text-xs">• Vaka Yönetimi</div>
          <div className="text-xs">• Güncel Kılavuzlar</div>
        </div>
      </button>
    </div>
  );

  // Quick Filters
  const QuickFilters = () => (
    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/50 rounded-xl">
      <Filter className="w-5 h-5 text-gray-400" />
      
      <select
        value={filter.duration}
        onChange={(e) => setFilter({...filter, duration: e.target.value})}
        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
      >
        <option value="all">Tüm Süreler</option>
        <option value="5">{'<5 dakika'}</option>
        <option value="10">5-10 dakika</option>
        <option value="20">10-20 dakika</option>
      </select>
      
      <select
        value={filter.difficulty}
        onChange={(e) => setFilter({...filter, difficulty: e.target.value})}
        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
      >
        <option value="all">Tüm Zorluklar</option>
        <option value="temel">Temel</option>
        <option value="orta">Orta</option>
        <option value="ileri">İleri</option>
      </select>
      
      <select
        value={filter.type}
        onChange={(e) => setFilter({...filter, type: e.target.value})}
        className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm"
      >
        <option value="all">Tüm Tipler</option>
        <option value="vaka">Vaka</option>
        <option value="algoritma">Algoritma</option>
        <option value="konsept">Konsept</option>
        <option value="görsel">Görsel</option>
      </select>
      
      <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
        Filtrele
      </button>
    </div>
  );

  // Daily Tasks Section
  const DailyTasksSection = () => (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Bugünün Görevleri
            </h3>
            <span className="text-sm text-gray-400">
              Son güncelleme: 5 dakika önce
            </span>
          </div>
          
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    task.type === 'flash' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      task.type === 'flash' ? 'text-yellow-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-white">{task.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.duration} dakika
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {task.points} puan
                      </span>
                      <span className="text-orange-400">
                        Bitiş: {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Content Card Component
  const ContentCard = ({ content }: { content: MedATLASContent }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedContent(content)}
      className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-blue-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
          content.difficulty === 'temel' ? 'bg-green-500/20 text-green-400' :
          content.difficulty === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {content.difficulty.charAt(0).toUpperCase() + content.difficulty.slice(1)}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            speakText(content.title);
          }}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4 text-gray-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
      <p className="text-sm text-gray-400 mb-3">{content.category}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {content.duration} dk
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {content.type}
          </span>
        </div>
        
        <Play className="w-4 h-4 text-blue-400" />
      </div>
      
      {content.tags && (
        <div className="flex flex-wrap gap-1 mt-3">
          {content.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-700 text-xs text-gray-400 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );

  // Task Card Component  
  const TaskCard = ({ task, type }: { task: FlashTask | FocusTask, type: 'flash' | 'focus' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedTask(task)}
      className={`p-5 rounded-xl cursor-pointer transition-all border ${
        type === 'flash'
          ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 hover:border-yellow-500'
          : 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-600/30 hover:border-blue-500'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
          type === 'flash' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {type === 'flash' ? '⚡ FLASH' : '🎯 FOCUS'} • {task.duration} dk
        </div>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: task.cognitiveLoad }).map((_, i) => (
            <Brain key={i} className="w-3 h-3 text-purple-400" />
          ))}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-3">{task.title}</h3>
      
      {type === 'flash' && 'sections' in task && (
        <div className="space-y-1">
          {task.sections.map((section, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span>{section.title} ({section.duration} dk)</span>
            </div>
          ))}
        </div>
      )}
      
      {type === 'focus' && 'modules' in task && (
        <div className="text-xs text-gray-400">
          {task.modules.length} modül • {task.cognitiveLoad} konsept
        </div>
      )}
      
      <button className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-colors">
        Görevi Başlat
      </button>
    </motion.div>
  );

  // Collections Section
  const CollectionsSection = () => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">📚 Hazır Koleksiyonlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCollections.map((collection) => (
          <div
            key={collection.id}
            className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 hover:border-purple-400 transition-colors cursor-pointer"
          >
            <h3 className="font-bold text-white mb-2">{collection.title}</h3>
            <p className="text-sm text-gray-400 mb-3">{collection.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {collection.contents.length} içerik • {collection.estimatedTime} dakika
              </span>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <LevelSelector />
        <QuickFilters />
        <DailyTasksSection />
        
        {/* Flash & Focus Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Flash Görevler (5-7 dk)
            </h2>
            <div className="space-y-4">
              {flashTasks.slice(0, 2).map((task) => (
                <TaskCard key={task.id} task={task} type="flash" />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Focus Görevler (12-15 dk)
            </h2>
            <div className="space-y-4">
              {focusTasks.slice(0, 1).map((task) => (
                <TaskCard key={task.id} task={task} type="focus" />
              ))}
            </div>
          </div>
        </div>
        
        <CollectionsSection />
        
        {/* MedATLAS Content Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            MedATLAS İçerikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurkishMEPDashboard;