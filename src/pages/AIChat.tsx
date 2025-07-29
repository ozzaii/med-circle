import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Brain,
  Sparkles,
  User,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { useStore } from '../store';
import { medicalAI } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedConcepts?: string[];
  references?: any[];
  isLoading?: boolean;
}

const AIChat = () => {
  const { user, currentBook } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize with greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hello ${user?.name}! I'm your AI medical education assistant. I can help you:

• Explain complex medical concepts
• Answer questions about any medical topic
• Generate practice questions and quizzes
• Summarize chapters from your books
• Provide clinical correlations and mnemonics
• Help with differential diagnoses

What would you like to learn about today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user?.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const suggestedPrompts = [
    {
      icon: BookOpen,
      text: 'Explain the cardiac cycle in detail',
      category: 'physiology',
    },
    {
      icon: Lightbulb,
      text: 'What are the key differences between Type 1 and Type 2 diabetes?',
      category: 'pathology',
    },
    {
      icon: AlertCircle,
      text: 'Generate 5 practice questions about antibiotics',
      category: 'pharmacology',
    },
    {
      icon: Brain,
      text: 'Create a mnemonic for cranial nerves',
      category: 'anatomy',
    },
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await medicalAI.generateResponse(
        userMessage.content,
        {
          bookId: currentBook?.id || 'general',
          recentTopics: messages.slice(-5).map(m => m.content.substring(0, 50)),
          userLevel: user?.level || 'student',
        }
      );

      // Remove loading message and add response
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isLoading);
        return [
          ...filtered,
          {
            id: response.id,
            role: 'assistant',
            content: response.response,
            timestamp: response.timestamp,
            relatedConcepts: response.relatedConcepts,
            references: response.references,
          },
        ];
      });

      useStore.getState().addAIResponse(response);
    } catch (error) {
      // Remove loading message
      setMessages(prev => prev.filter(m => !m.isLoading));
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleFeedback = (_messageId: string, feedback: 'positive' | 'negative') => {
    toast.success(`Thank you for your ${feedback} feedback!`);
    // In production, this would send feedback to backend
  };

  return (
    <div className="h-full flex">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-purple to-medical-pink p-0.5">
                <div className="w-full h-full rounded-full bg-medical-darker flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Medical AI Assistant</h2>
                <p className="text-sm text-gray-400">Powered by Gemini 2.5 Flash-Lite</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages(messages.slice(0, 1))}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-5 h-5 text-gray-400" />
              </button>
              
              {currentBook && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-medical-blue/10 border border-medical-blue/20">
                  <BookOpen className="w-4 h-4 text-medical-blue" />
                  <span className="text-sm text-medical-blue">{currentBook.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-purple to-medical-pink p-0.5">
                        <div className="w-full h-full rounded-full bg-medical-darker flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex-1 max-w-2xl ${
                      message.role === 'user' ? 'order-1' : 'order-2'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-4 ${
                        message.role === 'user'
                          ? 'bg-medical-blue/20 border border-medical-blue/30'
                          : 'glass border border-white/10'
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-medical-purple" />
                          <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                      ) : (
                        <>
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>

                          {message.relatedConcepts && message.relatedConcepts.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-xs text-gray-400 mb-2">Related concepts:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.relatedConcepts.map((concept, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-300"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.role === 'assistant' && (
                            <div className="flex items-center gap-2 mt-4">
                              <button
                                onClick={() => copyToClipboard(message.content)}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Copy"
                              >
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, 'positive')}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Good response"
                              >
                                <ThumbsUp className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, 'negative')}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Poor response"
                              >
                                <ThumbsDown className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 order-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-cyan to-medical-blue flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-gray-400 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInput(prompt.text)}
                      className="flex items-start gap-3 p-4 rounded-xl glass border border-white/10 hover:border-medical-blue/50 transition-all text-left"
                    >
                      <Icon className="w-5 h-5 text-medical-blue mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{prompt.text}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{prompt.category}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="glass border-t border-white/10 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about medicine..."
                rows={1}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-medical-blue focus:shadow-glow transition-all resize-none"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-medical-blue to-medical-purple hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions sidebar */}
      <div className="w-80 glass border-l border-white/10 p-4 hidden lg:block">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => setInput('Generate 5 practice questions about ' + (currentBook?.title || 'general medicine'))}
            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-medical-green/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-medical-green" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Practice Questions</p>
                <p className="text-xs text-gray-400">Generate quiz questions</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setInput('Summarize the key concepts from my recent studies')}
            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-medical-purple/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-medical-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Summary</p>
                <p className="text-xs text-gray-400">Summarize recent topics</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setInput('Create a study plan for ' + (user?.level || 'medical student'))}
            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-medical-blue/20 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-medical-blue" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Study Plan</p>
                <p className="text-xs text-gray-400">Get personalized plan</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent topics */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Topics</h4>
          <div className="space-y-2">
            {['Cardiac Cycle', 'Antibiotics', 'Neuroanatomy', 'Diabetes Management'].map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setInput(`Tell me more about ${topic}`)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <p className="text-sm text-gray-300">{topic}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;