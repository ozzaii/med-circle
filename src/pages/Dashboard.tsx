import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  Clock,
  Award,
  Target,
  Sparkles,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useStore } from '../store';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, books, userProgress } = useStore();

  // Mock data for progress chart
  const progressData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 2.9 },
    { day: 'Sun', hours: 3.7 },
  ];

  const stats = [
    {
      icon: BookOpen,
      label: 'Books Started',
      value: books.filter(b => b.progress && b.progress > 0).length,
      color: 'from-medical-blue to-medical-cyan',
    },
    {
      icon: Clock,
      label: 'Study Time',
      value: `${Math.floor((userProgress?.totalStudyTime || 0) / 60)}h`,
      color: 'from-medical-purple to-medical-pink',
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: '67%',
      color: 'from-medical-green to-emerald-400',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: userProgress?.achievements.length || 0,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const recentBooks = books.filter(b => b.progress && b.progress > 0).slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-holographic rounded-2xl p-8 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-gray-300">
              Ready to continue your medical education journey?
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/library')}
            className="btn-premium"
          >
            <span className="flex items-center gap-2">
              Continue Learning
              <Sparkles className="w-5 h-5" />
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-0.5 mb-4`}>
                <div className="w-full h-full rounded-lg bg-medical-darker flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study progress chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Weekly Study Progress</h2>
            <Activity className="w-5 h-5 text-medical-blue" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
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
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-medical-purple" />
            <h2 className="text-xl font-semibold text-white">AI Insights</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-medical-blue/10 border border-medical-blue/20">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-medical-blue">Strength:</span> Anatomy
              </p>
              <p className="text-xs text-gray-400">
                You're excelling in anatomical concepts. Keep it up!
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-medium text-amber-500">Focus Area:</span> Pharmacology
              </p>
              <p className="text-xs text-gray-400">
                Consider spending more time on drug interactions.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/ai-chat')}
              className="w-full p-4 rounded-lg bg-gradient-to-r from-medical-purple/20 to-medical-pink/20 border border-medical-purple/30 hover:border-medical-purple/50 transition-all flex items-center justify-between group"
            >
              <span className="text-sm font-medium text-white">Ask AI for Help</span>
              <ChevronRight className="w-4 h-4 text-medical-purple group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Recent books */}
      {recentBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Continue Reading</h2>
            <button
              onClick={() => navigate('/library')}
              className="text-sm text-medical-blue hover:text-medical-cyan transition-colors"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBooks.map((book) => (
              <motion.div
                key={book.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => {
                  useStore.setState({ currentBook: book });
                  navigate('/reader');
                }}
              >
                <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="w-full bg-white/20 rounded-full h-1.5 backdrop-blur-sm">
                      <div
                        className="h-full bg-medical-green rounded-full"
                        style={{ width: `${book.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-400">{book.progress}% complete</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;