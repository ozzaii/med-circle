import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  MessageSquare,
  BarChart3,
  Home,
  LogOut,
  User,
  Sparkles,
  GraduationCap,
  Stethoscope,
} from 'lucide-react';
import { useStore } from '../store';

const Sidebar = () => {
  const { user, setUser } = useStore();

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/library', label: 'Kütüphane', icon: BookOpen },
    { path: '/reader', label: 'Okuyucu', icon: BookOpen },
    { path: '/turkish-mep', label: 'MEP Modülleri', icon: GraduationCap },
    { path: '/virtual-patient', label: 'Sanal Hasta', icon: Stethoscope },
    { path: '/ai-chat', label: 'AI Asistan', icon: MessageSquare },
    { path: '/progress', label: 'Öğrenme Analitiği', icon: BarChart3 },
  ];

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medai-user');
    useStore.setState({
      userProgress: null,
      currentBook: null,
      aiHistory: [],
    });
  };

  return (
    <div className="w-72 h-full glass border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-blue to-medical-purple p-0.5">
            <div className="w-full h-full rounded-xl bg-medical-darker flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gradient">MedCircle</h2>
            <p className="text-xs text-gray-400">Türk Tıp Eğitimi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-medical-blue/20 text-white shadow-glow'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-medical-blue' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'AI Asistan' && (
                    <Sparkles className="w-4 h-4 ml-auto text-medical-cyan animate-pulse" />
                  )}
                  {item.label === 'MEP Modülleri' && (
                    <div className="ml-auto">
                      <span className="text-xs bg-medical-blue/20 text-medical-blue px-2 py-1 rounded-full">
                        YENİ
                      </span>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-cyan to-medical-blue flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white text-sm">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.level}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Çıkış</span>
        </motion.button>
      </div>

      {/* Premium indicator */}
      <div className="p-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-medical-purple/20 to-medical-pink/20 border border-medical-purple/30">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-medical-pink" />
            <span className="text-xs font-semibold text-white">Türk Tıp Eğitimi</span>
          </div>
          <p className="text-xs text-gray-300">
            Tıp eğitiminin geleceğini deneyimle
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;