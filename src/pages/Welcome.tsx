import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, GraduationCap, Stethoscope, Activity } from 'lucide-react';
import { useStore } from '../store';

const Welcome = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'student' | 'resident' | 'physician' | 'specialist'>('student');
  const setUser = useStore((state) => state.setUser);

  const handleStart = () => {
    if (name.trim()) {
      const user = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        level,
      };
      setUser(user);
      localStorage.setItem('medai-user', JSON.stringify(user));
      
      // Initialize user progress
      useStore.setState({
        userProgress: {
          userId: user.id,
          totalStudyTime: 0,
          booksCompleted: 0,
          currentStreak: 0,
          achievements: [],
          weakAreas: [],
          studyHistory: [],
        },
      });
    }
  };

  const levels = [
    { value: 'student', label: 'Medical Student', icon: GraduationCap },
    { value: 'resident', label: 'Resident', icon: Activity },
    { value: 'physician', label: 'Physician', icon: Stethoscope },
    { value: 'specialist', label: 'Specialist', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-medical-darker flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-medical-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-medical-purple/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-medical-cyan/5 rounded-full blur-3xl" />
      </div>

      {/* Medical grid pattern */}
      <div className="absolute inset-0 medical-grid opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="glass rounded-3xl p-12 shadow-2xl">
          {/* Logo and title */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-medical-blue to-medical-purple p-1 mb-6">
              <div className="w-full h-full rounded-full bg-medical-darker flex items-center justify-center">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">MedAI Education</span>
            </h1>
            
            <p className="text-xl text-gray-300">
              Bilişsel Bilim Destekli Tıbbi Eğitim Ekosistemi
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="w-5 h-5 text-medical-cyan animate-pulse" />
              <p className="text-sm text-gray-400">
                Powered by Gemini 2.5 Flash-Lite
              </p>
              <Sparkles className="w-5 h-5 text-medical-cyan animate-pulse" />
            </div>
          </motion.div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-medical-blue focus:shadow-glow transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                {levels.map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLevel(option.value as any)}
                      className={`p-4 rounded-lg border transition-all ${
                        level === option.value
                          ? 'bg-medical-blue/20 border-medical-blue shadow-glow'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        level === option.value ? 'text-medical-blue' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm font-medium ${
                        level === option.value ? 'text-white' : 'text-gray-300'
                      }`}>
                        {option.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              disabled={!name.trim()}
              className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Learning
                <Sparkles className="w-5 h-5" />
              </span>
            </motion.button>
          </div>

          {/* Features preview */}
          <div className="mt-10 pt-10 border-t border-white/10">
            <p className="text-center text-sm text-gray-400 mb-4">
              What awaits you:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'AI-Powered Learning',
                'Medical Books Library',
                'Interactive Study',
                'Progress Tracking',
                'Personalized Experience',
              ].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;