import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Clock,
  BookOpen,
  Brain,
  Award,
  BarChart3,
  Activity,
  Flame,
  Star,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import NeuralNetworkVisualization from '../components/NeuralNetworkVisualization';
// import { useStore } from '../store';

const Progress = () => {
  // const userProgress = useStore((state) => state.userProgress);

  // Calculate overall learning progress
  const calculateLearningProgress = () => {
    const totalCompleted = categoryProgress.reduce((acc, cat) => acc + cat.completed, 0);
    const totalPossible = categoryProgress.reduce((acc, cat) => acc + cat.total, 0);
    return Math.round((totalCompleted / totalPossible) * 100);
  };

  // Mock data for charts - Turkish labels
  const skillsData = [
    { subject: 'Anatomi', score: 85, fullMark: 100 },
    { subject: 'Fizyoloji', score: 72, fullMark: 100 },
    { subject: 'Patoloji', score: 65, fullMark: 100 },
    { subject: 'Farmakoloji', score: 58, fullMark: 100 },
    { subject: 'Klinik Beceriler', score: 78, fullMark: 100 },
    { subject: 'Acil Tıp', score: 45, fullMark: 100 },
  ];

  const weeklyProgress = [
    { day: 'Pzt', hours: 2.5, pages: 45 },
    { day: 'Sal', hours: 3.2, pages: 58 },
    { day: 'Çar', hours: 1.8, pages: 32 },
    { day: 'Per', hours: 4.1, pages: 73 },
    { day: 'Cum', hours: 3.5, pages: 62 },
    { day: 'Cmt', hours: 2.9, pages: 51 },
    { day: 'Paz', hours: 3.7, pages: 66 },
  ];

  const categoryProgress = [
    { category: 'Anatomi', completed: 45, total: 100 },
    { category: 'Fizyoloji', completed: 32, total: 100 },
    { category: 'Patoloji', completed: 28, total: 100 },
    { category: 'Farmakoloji', completed: 15, total: 100 },
    { category: 'Klinik', completed: 52, total: 100 },
  ];

  const achievements = [
    { id: 1, title: 'Erken Kalkan', description: 'Sabah 6dan önce çalışmaya başladın', icon: Zap, color: 'from-yellow-400 to-orange-500', unlockedAt: new Date('2024-01-15') },
    { id: 2, title: 'Week Warrior', description: '7-day study streak', icon: Flame, color: 'from-red-500 to-pink-500', unlockedAt: new Date('2024-01-20') },
    { id: 3, title: 'Knowledge Seeker', description: 'Read 5 different books', icon: BookOpen, color: 'from-blue-500 to-cyan-500', unlockedAt: new Date('2024-01-22') },
    { id: 4, title: 'AI Explorer', description: 'Asked 50 questions to AI', icon: Brain, color: 'from-purple-500 to-indigo-500', unlockedAt: new Date('2024-01-25') },
  ];

  const totalStudyHours = weeklyProgress.reduce((sum, day) => sum + day.hours, 0);
  const totalPages = weeklyProgress.reduce((sum, day) => sum + day.pages, 0);
  const averageDaily = (totalStudyHours / 7).toFixed(1);
  const currentStreak = 7;

  return (
    <div className="p-6 space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Toplam Çalışma Süresi', value: `${totalStudyHours.toFixed(1)} saat`, subtext: 'Bu hafta', color: 'from-medical-blue to-medical-cyan' },
          { icon: Flame, label: 'Güncel Seri', value: `${currentStreak} gün`, subtext: 'Devam et!', color: 'from-orange-500 to-red-500' },
          { icon: BookOpen, label: 'Okunan Sayfalar', value: totalPages, subtext: 'Bu hafta', color: 'from-medical-purple to-medical-pink' },
          { icon: Target, label: 'Tamamlanma Oranı', value: '%67', subtext: 'Tüm kurslar', color: 'from-medical-green to-emerald-400' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-lg bg-medical-darker flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-xs text-medical-cyan mt-1">{stat.subtext}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Neural Network Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-medical-cyan" />
          Öğrenme Ağı Görselleştirmesi
        </h3>
        <div className="h-96">
          <NeuralNetworkVisualization 
            learningProgress={calculateLearningProgress()} 
            activeConnections={Math.floor(calculateLearningProgress() / 5)}
          />
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5 text-medical-purple" />
            Beceri Özeti
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsData}>
                <PolarGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-green" />
            Haftalık Aktivite
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  strokeWidth={0}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  strokeWidth={0}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 14, 39, 0.9)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Average: <span className="text-white font-medium">{averageDaily} hours/day</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Category Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-medical-cyan" />
          Progress by Category
        </h3>
        <div className="space-y-4">
          {categoryProgress.map((cat, idx) => {
            const percentage = Math.round((cat.completed / cat.total) * 100);
            const colors = [
              'bg-medical-blue',
              'bg-medical-purple',
              'bg-medical-cyan',
              'bg-medical-green',
              'bg-medical-pink',
            ];
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{cat.category}</span>
                  <span className="text-sm text-gray-400">{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${colors[idx % colors.length]}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="card-holographic rounded-xl p-6 border border-white/10 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${achievement.color} p-0.5 mb-4`}>
                    <div className="w-full h-full rounded-full bg-medical-darker flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                  <p className="text-xs text-medical-cyan">
                    {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Locked achievements preview */}
        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-2">Next achievements to unlock:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                <Star className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-300">Master Student</p>
                <p className="text-xs text-gray-500">Complete 10 books</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                <Award className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-300">Quiz Champion</p>
                <p className="text-xs text-gray-500">Score 90%+ on 5 quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Study Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">AI-Powered Study Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-medical-blue/10 border border-medical-blue/20">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-medical-blue">Peak Hours:</span> You perform best between 2-6 PM
            </p>
          </div>
          <div className="p-4 rounded-lg bg-medical-purple/10 border border-medical-purple/20">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-medical-purple">Focus Area:</span> Spend more time on Pharmacology
            </p>
          </div>
          <div className="p-4 rounded-lg bg-medical-green/10 border border-medical-green/20">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-medical-green">Strength:</span> Excellent retention in Anatomy
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;