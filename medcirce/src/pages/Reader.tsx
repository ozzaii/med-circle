import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Bookmark,
  MessageSquare,
  Highlighter,
  ZoomIn,
  ZoomOut,
  Brain,
  Sparkles,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { useStore } from '../store';
import { getBookContent } from '../data/books';
import { medicalAI } from '../services/gemini';
import toast from 'react-hot-toast';

const Reader = () => {
  const navigate = useNavigate();
  const { currentBook, currentPage, setCurrentPage, addNote, user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [zoom, setZoom] = useState(100);
  const [bookContent, setBookContent] = useState('');

  useEffect(() => {
    if (currentBook) {
      // Simulate loading book content
      setIsLoading(true);
      setTimeout(() => {
        setBookContent(getBookContent(currentBook.id, currentPage));
        setIsLoading(false);
      }, 500);
      
      // Start study session
      useStore.getState().startStudySession(currentBook.id);
    }
  }, [currentBook, currentPage]);

  if (!currentBook) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No book selected</p>
          <button
            onClick={() => navigate('/library')}
            className="text-medical-blue hover:text-medical-cyan transition-colors"
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  const totalPages = currentBook.chapters
    ? Math.max(...currentBook.chapters.map(ch => ch.pageEnd))
    : 100;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Update progress
      const progress = Math.round((newPage / totalPages) * 100);
      useStore.getState().updateBookProgress(currentBook.id, progress);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text) {
      setSelectedText(text);
      setShowAI(true);
      setAiQuery(`Explain: "${text}"`);
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await medicalAI.generateResponse(
        aiQuery,
        {
          bookId: currentBook.id,
          currentPage,
          currentChapter: currentBook.chapters?.find(
            ch => currentPage >= ch.pageStart && currentPage <= ch.pageEnd
          )?.title,
          recentTopics: [currentBook.category],
          userLevel: user?.level || 'student',
        },
        bookContent
      );
      
      setAiResponse(response.response);
      useStore.getState().addAIResponse(response);
      
      // Update study session
      const session = useStore.getState().currentSession;
      if (session) {
        useStore.setState({
          currentSession: {
            ...session,
            aiInteractions: session.aiInteractions + 1,
          },
        });
      }
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (selectedText) {
      const note = {
        id: `note-${Date.now()}`,
        page: currentPage,
        content: selectedText,
        timestamp: new Date(),
        highlight: {
          text: selectedText,
          position: { x: 0, y: 0 },
        },
      };
      addNote(note);
      toast.success('Note added');
      setSelectedText('');
    }
  };

  const currentChapter = currentBook.chapters?.find(
    ch => currentPage >= ch.pageStart && currentPage <= ch.pageEnd
  );

  return (
    <div className="h-full flex">
      {/* Chapters sidebar */}
      <AnimatePresence>
        {showChapters && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 glass border-r border-white/10 p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Chapters</h3>
              <button
                onClick={() => setShowChapters(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-2">
              {currentBook.chapters?.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handlePageChange(chapter.pageStart)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentChapter?.id === chapter.id
                      ? 'bg-medical-blue/20 border border-medical-blue/50'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className={`w-4 h-4 mt-0.5 ${
                      currentChapter?.id === chapter.id
                        ? 'text-medical-blue'
                        : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        currentChapter?.id === chapter.id
                          ? 'text-white'
                          : 'text-gray-300'
                      }`}>
                        {chapter.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pages {chapter.pageStart}-{chapter.pageEnd}
                      </p>
                    </div>
                    {chapter.completed && (
                      <div className="w-5 h-5 rounded-full bg-medical-green/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-medical-green" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main reader */}
      <div className="flex-1 flex flex-col">
        {/* Reader toolbar */}
        <div className="glass border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/library')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => setShowChapters(!showChapters)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-center"
                    min={1}
                    max={totalPages}
                  />
                  <span className="text-gray-400">/ {totalPages}</span>
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm text-gray-400 w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>

              <div className="h-8 w-px bg-white/10 mx-2" />

              {/* Tools */}
              <button
                onClick={() => toast.success('Bookmark added')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Bookmark className="w-5 h-5 text-white" />
              </button>
              
              <button
                onClick={() => setShowAI(!showAI)}
                className={`p-2 rounded-lg transition-colors ${
                  showAI ? 'bg-medical-purple/20 text-medical-purple' : 'hover:bg-white/10 text-white'
                }`}
              >
                <Brain className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleAddNote}
                disabled={!selectedText}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Highlighter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Current chapter indicator */}
          {currentChapter && (
            <div className="mt-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-medical-blue" />
              <span className="text-sm text-gray-300">{currentChapter.title}</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Book content */}
          <div
            className="flex-1 overflow-y-auto p-8"
            onMouseUp={handleTextSelection}
            style={{ fontSize: `${zoom}%` }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-blue"></div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="glass rounded-xl p-12 leading-relaxed">
                  <h2 className="text-3xl font-bold text-white mb-6">
                    {currentBook.title}
                  </h2>
                  
                  <div className="prose prose-lg prose-invert">
                    <pre className="whitespace-pre-wrap font-sans text-gray-200">
                      {bookContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant Panel */}
          <AnimatePresence>
            {showAI && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="glass border-l border-white/10 flex flex-col"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-medical-purple" />
                      <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                    </div>
                    <button
                      onClick={() => setShowAI(false)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {selectedText && (
                    <div className="mb-4 p-3 rounded-lg bg-medical-blue/10 border border-medical-blue/20">
                      <p className="text-xs text-medical-blue mb-1">Selected Text:</p>
                      <p className="text-sm text-gray-300">{selectedText}</p>
                    </div>
                  )}

                  {aiResponse && (
                    <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-medical-purple mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">
                            {aiResponse}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                      placeholder="Ask about this content..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-medical-purple"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAIQuery}
                      disabled={isLoading || !aiQuery.trim()}
                      className="p-2 rounded-lg bg-medical-purple hover:bg-medical-purple/80 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <MessageSquare className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Reader;