import { motion } from 'framer-motion';
import { Menu, Search, Bell, Moon, Sun } from 'lucide-react';
import { useStore } from '../store';
import { useState } from 'react';

const Header = () => {
  const { toggleSidebar, activeTab } = useStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitle = {
    library: 'Medical Library',
    reading: 'Reading Session',
    'ai-chat': 'AI Assistant',
    progress: 'Your Progress',
  }[activeTab] || 'Dashboard';

  return (
    <header className="glass border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, topics, or ask a question..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-medical-blue focus:shadow-glow transition-all"
            />
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl glass border border-white/10 shadow-2xl"
              >
                <p className="text-sm text-gray-400">
                  Press Enter to search or ask AI
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-medical-pink rounded-full animate-pulse" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-white" />
            ) : (
              <Sun className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Quick stats */}
          <div className="hidden lg:flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs text-gray-400">Study Streak</p>
              <p className="text-sm font-semibold text-medical-green">7 days</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress</p>
              <p className="text-sm font-semibold text-medical-blue">42%</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;