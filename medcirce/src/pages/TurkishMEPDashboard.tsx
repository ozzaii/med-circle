import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Stethoscope,
  Brain,
  BookOpen,
  Clock,
  Target,
  Zap,
  Trophy,
  Flame,
  Calendar,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Award,
  Filter,
  Search,
  Activity
} from 'lucide-react';
import { useStore } from '../store';
import {
  MedATLASStudentData,
  MedATLASResidentData,
  flashGörevÖrnek,
  focusGörevÖrnek,
  deepGörevÖrnek,
  başarılar,
  type TaskContent,
  type MedATLASStudent,
  type MedATLASResident
} from '../data/medatlas_system';

/**
 * TÜRKÇE MEP DASHBOARD - TAMAMEN YENİDEN YAZIILDI
 * Student ve Resident modülleri tamamen ayrı
 * Shipping ready - Hiçbir simplification yok
 */

const TurkishMEPDashboard: React.FC = () => {
  const { user } = useStore();
  const [seçiliModül, setSeçiliModül] = useState<'student' | 'resident'>('student');
  const [aktifGörev, setAktifGörev] = useState<TaskContent | null>(null);
  const [görevİlerleme, setGörevİlerleme] = useState(0);
  const [sesAçık, setSesAçık] = useState(true);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [weeklyProgress, setWeeklyProgress] = useState({ hedef: 30, tamamlanan: 23 });
  const [aktifFiltre, setAktifFiltre] = useState<'tümü' | 'flash' | 'focus' | 'deep'>('tümü');
  const [aramaMetni, setAramaMetni] = useState('');
  const [kazanılanBaşarılar, setKazanılanBaşarılar] = useState<string[]>(['ilk-adim']);

  // Ses sentezi için (GPT-5 smoothness simülasyonu)
  useEffect(() => {
    if (aktifGörev && sesAçık) {
      const utterance = new SpeechSynthesisUtterance(aktifGörev.başlık);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, [aktifGörev, sesAçık]);

  // MedATLAS verisi
  const medatlasData = seçiliModül === 'student' ? MedATLASStudentData : MedATLASResidentData;

  // Görev filtreleme
  const filtrelenmişGörevler = () => {
    let görevler: TaskContent[] = [];
    
    if (aktifFiltre === 'tümü' || aktifFiltre === 'flash') {
      görevler = [...görevler, ...medatlasData.görevler.flash];
    }
    if (aktifFiltre === 'tümü' || aktifFiltre === 'focus') {
      görevler = [...görevler, ...medatlasData.görevler.focus];
    }
    if (aktifFiltre === 'tümü' || aktifFiltre === 'deep') {
      görevler = [...görevler, ...medatlasData.görevler.deep];
    }

    if (aramaMetni) {
      görevler = görevler.filter(g => 
        g.başlık.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        g.konseptler.some(k => k.toLowerCase().includes(aramaMetni.toLowerCase()))
      );
    }

    return görevler;
  };

  // Modül Seçici Header
  const ModülSeçiciHeader = () => (
    <div className="bg-gradient-to-r from-gray-900 via-blue-900/20 to-gray-900 p-6 rounded-2xl mb-8">
      <h1 className="text-4xl font-bold text-center text-white mb-6">
        Türk Tıp Eğitimi MEP Modülleri
      </h1>
      
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeçiliModül('student')}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            seçiliModül === 'student'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <GraduationCap className="w-6 h-6" />
          <div className="text-left">
            <div>Medical Student</div>
            <div className="text-xs opacity-80">Temel + TUS Hazırlık</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeçiliModül('resident')}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            seçiliModül === 'resident'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Stethoscope className="w-6 h-6" />
          <div className="text-left">
            <div>Medical Resident</div>
            <div className="text-xs opacity-80">Klinik Uygulama + Karar Desteği</div>
          </div>
        </motion.button>
      </div>
    </div>
  );

  // MedATLAS İçerik Gösterimi
  const MedATLASContent = () => (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Brain className="w-7 h-7 text-cyan-400" />
          MedATLAS {seçiliModül === 'student' ? 'Student' : 'Resident'}
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Hızlı Filtreler */}
          <div className="flex gap-2">
            {['tümü', 'flash', 'focus', 'deep'].map((filtre) => (
              <button
                key={filtre}
                onClick={() => setAktifFiltre(filtre as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  aktifFiltre === filtre
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filtre === 'tümü' ? 'Tümü' :
                 filtre === 'flash' ? '⚡ Flash (5-7dk)' :
                 filtre === 'focus' ? '🎯 Focus (12-15dk)' :
                 '🧠 Deep (20-25dk)'}
              </button>
            ))}
          </div>

          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Konu ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* İçerik Kategorileri */}
      {seçiliModül === 'student' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Temel Bilimler */}
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-5 border border-cyan-500/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🔬 Temel Bilimler</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Anatomi Atlası</div>
                <div className="text-xs text-gray-400">Bölgesel, görsel, 3D modeller</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Fizyoloji Mekanizmaları</div>
                <div className="text-xs text-gray-400">Sistem şemaları, yolaklar</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Biyokimya Yolakları</div>
                <div className="text-xs text-gray-400">Glikoliz, Krebs, metabolizma</div>
              </div>
            </div>
          </div>

          {/* Temel Klinik */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-5 border border-purple-500/20">
            <h3 className="text-lg font-bold text-purple-400 mb-4">🩺 Temel Klinik Girişler</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Semptom Algoritmaları</div>
                <div className="text-xs text-gray-400">Ateş, göğüs ağrısı, dispne</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Temel Farmakoloji</div>
                <div className="text-xs text-gray-400">İlaç grupları özet tabloları</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Muayene Temelleri</div>
                <div className="text-xs text-gray-400">Vital bulgular, sistem muayenesi</div>
              </div>
            </div>
          </div>

          {/* TUS Destek */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/20">
            <h3 className="text-lg font-bold text-green-400 mb-4">🎯 TUS Destek</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Spot Bilgiler</div>
                <div className="text-xs text-gray-400">Mnemonikler, kısayollar</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Karıştırılan Kavramlar</div>
                <div className="text-xs text-gray-400">Addison vs Cushing vb.</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Yüksek Frekanslı Konular</div>
                <div className="text-xs text-gray-400">Son 5 yıl analizi</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vaka Odaklı */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-5 border border-red-500/20">
            <h3 className="text-lg font-bold text-red-400 mb-4">🚨 Vaka & Semptom Odaklı</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Acil Senaryolar</div>
                <div className="text-xs text-gray-400">Sepsis, şok, travma, MI, inme</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Klinik Pathway'ler</div>
                <div className="text-xs text-gray-400">Göğüs ağrısı, dispne algoritmaları</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Red Flag İşaretleri</div>
                <div className="text-xs text-gray-400">Acil müdahale gerektiren durumlar</div>
              </div>
            </div>
          </div>

          {/* Klinik Protokoller */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl p-5 border border-indigo-500/20">
            <h3 className="text-lg font-bold text-indigo-400 mb-4">📋 Klinik Protokoller & Kılavuzlar</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">ATLS & ACLS Özetleri</div>
                <div className="text-xs text-gray-400">Kritik hasta yönetimi</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">Sepsis 1-hour Bundle</div>
                <div className="text-xs text-gray-400">Antibiyotik, sıvı, vazopressör</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-white mb-1">2024 Güncel Kılavuzlar</div>
                <div className="text-xs text-gray-400">ESC, AHA, GOLD özetleri</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Görev Listesi */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">📚 Mevcut Görevler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrelenmişGörevler().map((görev) => (
            <motion.div
              key={görev.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setAktifGörev(görev)}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm mb-1">{görev.başlık}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{görev.süre} dakika</span>
                    <span className="text-gray-600">•</span>
                    <span>Zorluk: {görev.kognitifYük}/10</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {görev.konseptler.slice(0, 3).map((konsept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                  >
                    {konsept}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-cyan-400">{görev.içerik.kazanılanXP} XP</span>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  görev.süre <= 7 ? 'bg-green-900/50 text-green-400' :
                  görev.süre <= 15 ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-red-900/50 text-red-400'
                }`}>
                  {görev.süre <= 7 ? '⚡ Flash' :
                   görev.süre <= 15 ? '🎯 Focus' :
                   '🧠 Deep'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // Motivasyon Panel
  const MotivasyonPanel = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Daily Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">{dailyStreak} Gün</div>
              <div className="text-xs text-gray-400">Günlük Seri</div>
            </div>
          </div>
          <div className="text-4xl">🔥</div>
        </div>
        <div className="flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < dailyStreak ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Weekly Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {weeklyProgress.tamamlanan}/{weeklyProgress.hedef}
              </div>
              <div className="text-xs text-gray-400">Haftalık Hedef</div>
            </div>
          </div>
          <div className="text-sm text-green-400">
            {Math.round((weeklyProgress.tamamlanan / weeklyProgress.hedef) * 100)}%
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(weeklyProgress.tamamlanan / weeklyProgress.hedef) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
          />
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-purple-400" />
          <div>
            <div className="text-2xl font-bold text-white">{kazanılanBaşarılar.length}/{başarılar.length}</div>
            <div className="text-xs text-gray-400">Başarılar</div>
          </div>
        </div>
        <div className="flex gap-2">
          {başarılar.slice(0, 4).map((başarı) => (
            <div
              key={başarı.id}
              className={`text-2xl ${
                kazanılanBaşarılar.includes(başarı.id) ? 'opacity-100' : 'opacity-30'
              }`}
              title={başarı.açıklama}
            >
              {başarı.ikon}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Aktif Görev Modal
  const AktifGörevModal = () => {
    if (!aktifGörev) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setAktifGörev(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{aktifGörev.başlık}</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSesAçık(!sesAçık)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {sesAçık ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
                  </button>
                  <button
                    onClick={() => setAktifGörev(null)}
                    className="text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{aktifGörev.süre} dakika</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>Zorluk: {aktifGörev.kognitifYük}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{aktifGörev.içerik.kazanılanXP} XP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${görevİlerleme}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {aktifGörev.içerik.bölümler.map((bölüm, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gray-800/50 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        {bölüm.başlık}
                      </h3>
                      <span className="text-sm text-gray-400">{bölüm.süre} dk</span>
                    </div>

                    {/* Bölüm içeriği tipine göre render */}
                    {bölüm.tip === 'vaka' && (
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-gray-300 mb-4">{bölüm.içerik.sunum || bölüm.içerik.vaka}</p>
                        {bölüm.içerik.soru && (
                          <div className="space-y-3">
                            <p className="font-medium text-white">{bölüm.içerik.soru}</p>
                            {bölüm.içerik.seçenekler?.map((seçenek: any, i: number) => (
                              <button
                                key={i}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                  seçenek.doğru
                                    ? 'border-green-500 bg-green-900/20 text-green-400'
                                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                                }`}
                              >
                                {seçenek.metin}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {bölüm.tip === 'flashcard' && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(bölüm.içerik.karşılaştırma || {}).map(([başlık, içerik]: [string, any]) => (
                          <div key={başlık} className="bg-gray-900/50 rounded-lg p-4">
                            <h4 className="font-semibold text-cyan-400 mb-2">{başlık}</h4>
                            <div className="text-sm text-gray-300 space-y-1">
                              {Object.entries(içerik).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                  <span className="text-gray-400">{key}:</span>{' '}
                                  <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {bölüm.interaktif && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400">
                        <Zap className="w-4 h-4" />
                        İnteraktif içerik
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Özet Mesajlar */}
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">📌 Özet ve Kazanımlar</h3>
                  <div className="space-y-2">
                    {aktifGörev.içerik.özetMesajlar.map((mesaj, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-gray-300">{mesaj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 p-4 flex items-center justify-between">
              <button
                onClick={() => setGörevİlerleme(Math.min(100, görevİlerleme + 25))}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Devam Et
              </button>
              
              {görevİlerleme >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-lg"
                >
                  <Trophy className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Tamamlandı! +{aktifGörev.içerik.kazanılanXP} XP
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <ModülSeçiciHeader />
        <MotivasyonPanel />
        <MedATLASContent />
        <AktifGörevModal />
      </div>
    </div>
  );
};

export default TurkishMEPDashboard;