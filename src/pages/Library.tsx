import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Grid,
  List,
  BookOpen,
  ChevronRight,
  Star,
  Download,
} from 'lucide-react';
import { useStore } from '../store';
import type { MedicalCategory } from '../types';

const Library = () => {
  const navigate = useNavigate();
  const { books, setCurrentBook } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicalCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'progress' | 'difficulty'>('title');

  const categories: { value: MedicalCategory | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Books', color: 'from-gray-500 to-gray-600' },
    { value: 'anatomy', label: 'Anatomy', color: 'from-red-500 to-pink-500' },
    { value: 'physiology', label: 'Physiology', color: 'from-blue-500 to-cyan-500' },
    { value: 'pathology', label: 'Pathology', color: 'from-purple-500 to-indigo-500' },
    { value: 'pharmacology', label: 'Pharmacology', color: 'from-green-500 to-emerald-500' },
    { value: 'internal-medicine', label: 'Internal Medicine', color: 'from-amber-500 to-orange-500' },
    { value: 'emergency-medicine', label: 'Emergency', color: 'from-red-600 to-rose-600' },
    { value: 'clinical-skills', label: 'Clinical Skills', color: 'from-teal-500 to-cyan-500' },
  ];

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'difficulty':
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const handleBookClick = (book: typeof books[0]) => {
    setCurrentBook(book);
    navigate('/reader');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Medical Library</h1>
        
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${
                viewMode === 'grid'
                  ? 'bg-medical-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-medical-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-medical-blue"
          >
            <option value="title">Sort by Title</option>
            <option value="progress">Sort by Progress</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>
      </div>

      {/* Search and filters */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, or topics..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-medical-blue focus:shadow-glow transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r text-white shadow-glow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              style={
                selectedCategory === category.value
                  ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }
                  : {}
              }
            >
              <span className={selectedCategory === category.value ? '' : `bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Books grid/list */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => handleBookClick(book)}
                className="group cursor-pointer"
              >
                <div className="card-holographic rounded-xl overflow-hidden border border-white/10 hover:border-medical-blue/50 transition-all">
                  {/* Cover image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-medical-darker via-transparent to-transparent" />
                    
                    {/* Progress indicator */}
                    {book.progress && book.progress > 0 && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                        <span className="text-xs font-medium text-white">{book.progress}%</span>
                      </div>
                    )}

                    {/* Difficulty badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                        {book.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-medical-blue transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-1">{book.author}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-300">4.8</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-medical-blue opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                onClick={() => handleBookClick(book)}
                className="glass rounded-xl p-4 border border-white/10 hover:border-medical-blue/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Cover thumbnail */}
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />

                  {/* Book info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 group-hover:text-medical-blue transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{book.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium ${getDifficultyColor(book.difficulty)}`}>
                        {book.difficulty.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {book.chapters?.length || 0} chapters
                      </span>
                      {book.progress && book.progress > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-medical-green"
                              style={{ width: `${book.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{book.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality
                      }}
                    >
                      <Download className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <ChevronRight className="w-5 h-5 text-medical-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <BookOpen className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No books found matching your criteria</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-medical-blue hover:text-medical-cyan transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Library;