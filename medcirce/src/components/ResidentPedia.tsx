/**
 * ResidentPedia - Comprehensive Medical Knowledge System
 * Turkish Medical Education Encyclopedia with AI-powered insights
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Bookmark,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Grid,
  List,
  ChevronRight,
  Play,
  Users,
  Award,
  Lightbulb,
  Database,
  Globe,
  Stethoscope
} from 'lucide-react';
import PersonaSelector from './PersonaSelector';
import StreamingResponse from './StreamingResponse';
import { AI_PERSONAS, type AIPersona } from '../services/aiPersonas';
import { getTurkishMedicalStreamingService, type StreamChunk } from '../services/streamingService';

interface MedicalTopic {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  specialty: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  tags: string[];
  lastUpdated: string;
  readTime: number;
  popularity: number;
  bookmarked: boolean;
  turkishTerms: string[];
  clinicalRelevance: number;
}

interface ResidentPediaProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResidentPedia: React.FC<ResidentPediaProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(AI_PERSONAS[2]); // Research persona
  const [streamingChunks, setStreamingChunks] = useState<StreamChunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<MedicalTopic | null>(null);

  const streamingService = import.meta.env.VITE_GEMINI_API_KEY 
    ? getTurkishMedicalStreamingService(import.meta.env.VITE_GEMINI_API_KEY)
    : null;

  // Comprehensive medical topics database
  const [medicalTopics] = useState<MedicalTopic[]>([
    {
      id: 'septic-shock-pathophysiology',
      title: 'Septik Şok Patofizyolojisi',
      titleEn: 'Septic Shock Pathophysiology',
      category: 'Pathophysiology',
      specialty: 'Acil Tıp',
      difficulty: 'advanced',
      summary: 'Septik şokun moleküler ve hücresel mekanizmaları, SIRS yanıtı ve organ yetmezliği gelişimi',
      tags: ['sepsis', 'şok', 'acil tıp', 'yoğun bakım', 'patofizyoloji'],
      lastUpdated: '2024-12-15',
      readTime: 15,
      popularity: 95,
      bookmarked: false,
      turkishTerms: ['septik şok', 'sistemik inflamatuvar yanıt sendromu', 'organ yetmezliği'],
      clinicalRelevance: 98
    },
    {
      id: 'stemi-management-2024',
      title: 'STEMI Yönetimi - 2024 Kılavuzları',
      titleEn: 'STEMI Management - 2024 Guidelines',
      category: 'Guidelines',
      specialty: 'Kardiyoloji',
      difficulty: 'advanced',
      summary: 'ST elevasyonlu miyokard infarktüsü akut dönem yönetimi ve güncel tedavi algoritmaları',
      tags: ['STEMI', 'miyokard infarktüsü', 'kardiyoloji', 'acil kardiyoloji'],
      lastUpdated: '2024-11-20',
      readTime: 20,
      popularity: 92,
      bookmarked: true,
      turkishTerms: ['ST elevasyonlu miyokard infarktüsü', 'primer perkütan koroner girişim'],
      clinicalRelevance: 96
    },
    {
      id: 'status-epilepticus-protocol',
      title: 'Status Epileptikus Tedavi Protokolü',
      titleEn: 'Status Epilepticus Treatment Protocol',
      category: 'Protocols',
      specialty: 'Nöroloji',
      difficulty: 'advanced',
      summary: 'Status epileptikus tanı ve tedavi protokolü, ilaç dozları ve algoritmaları',
      tags: ['status epileptikus', 'nöroloji', 'acil nöroloji', 'antiepileptik'],
      lastUpdated: '2024-10-30',
      readTime: 12,
      popularity: 88,
      bookmarked: false,
      turkishTerms: ['status epileptikus', 'konvülzif status epileptikus', 'refrakter status'],
      clinicalRelevance: 94
    },
    {
      id: 'febrile-neutropenia-approach',
      title: 'Febril Nötropeni Yaklaşımı',
      titleEn: 'Febrile Neutropenia Approach',
      category: 'Clinical Approach',
      specialty: 'Onkoloji',
      difficulty: 'intermediate',
      summary: 'Kanser hastalarında febril nötropeni risk değerlendirmesi ve yönetim stratejileri',
      tags: ['febril nötropeni', 'onkoloji', 'enfeksiyon', 'kemoterapi'],
      lastUpdated: '2024-12-01',
      readTime: 18,
      popularity: 85,
      bookmarked: true,
      turkishTerms: ['febril nötropeni', 'mutlak nötrofil sayısı', 'empirik antibiyoterapi'],
      clinicalRelevance: 91
    },
    {
      id: 'diabetic-ketoacidosis-management',
      title: 'Diabetik Ketoasidoz Yönetimi',
      titleEn: 'Diabetic Ketoacidosis Management',
      category: 'Emergency Medicine',
      specialty: 'Endokrinoloji',
      difficulty: 'intermediate',
      summary: 'DKA tanı kriterleri, sıvı-elektrolit yönetimi ve insülin protokolleri',
      tags: ['DKA', 'diabetes', 'endokrinoloji', 'acil endokrinoloji'],
      lastUpdated: '2024-11-15',
      readTime: 16,
      popularity: 89,
      bookmarked: false,
      turkishTerms: ['diabetik ketoasidoz', 'anyon açığı', 'ketonemi'],
      clinicalRelevance: 93
    }
  ]);

  const categories = ['all', 'Pathophysiology', 'Guidelines', 'Protocols', 'Clinical Approach', 'Emergency Medicine'];
  const specialties = ['all', 'Acil Tıp', 'Kardiyoloji', 'Nöroloji', 'Onkoloji', 'Endokrinoloji'];

  const filteredTopics = medicalTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSpecialty = selectedSpecialty === 'all' || topic.specialty === selectedSpecialty;
    
    return matchesSearch && matchesCategory && matchesSpecialty;
  });

  const handleTopicExploration = async (topic: MedicalTopic) => {
    if (!streamingService) return;
    
    setSelectedTopic(topic);
    setStreamingChunks([]);
    setIsStreaming(true);

    try {
      const stream = streamingService.streamMedicalTermExplanation(
        topic.title,
        `ResidentPedia - Comprehensive medical topic: ${topic.summary}`,
        'resident',
        { 
          chunkSize: 50, 
          delayBetweenChunks: 120,
          aiPersona: selectedPersona
        }
      );

      const chunks: StreamChunk[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
        setStreamingChunks([...chunks]);
      }
      
    } catch (error) {
      console.error('ResidentPedia streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPopularityStars = (popularity: number) => {
    const stars = Math.round(popularity / 20);
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-blue to-medical-purple p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Database className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">ResidentPedia</h1>
                  <p className="text-blue-100">Türk Tıp Eğitimi Ansiklopedisi</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <PersonaSelector
                  selectedPersona={selectedPersona}
                  onPersonaChange={setSelectedPersona}
                  className="min-w-64"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tıbbi konu, hastalık veya etiket ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Tüm Kategoriler' : cat}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                {specialties.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'Tüm Uzmanlıklar' : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex h-[calc(90vh-200px)]">
            {/* Topics List */}
            <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  {filteredTopics.length} Tıbbi Konu
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-medical-blue text-white' : 'text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-medical-blue text-white' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTopic?.id === topic.id 
                        ? 'border-medical-blue bg-medical-blue/5' 
                        : 'border-gray-200 hover:border-medical-blue/50'
                    }`}
                    onClick={() => handleTopicExploration(topic)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex-1">{topic.title}</h3>
                      {topic.bookmarked && (
                        <Bookmark className="w-4 h-4 text-medical-blue fill-current" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{topic.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty === 'beginner' ? 'Başlangıç' : 
                           topic.difficulty === 'intermediate' ? 'Orta' : 'İleri'}
                        </span>
                        <span className="text-xs text-gray-500">{topic.specialty}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex">{getPopularityStars(topic.popularity)}</div>
                        <span className="text-xs text-gray-500">{topic.readTime} dk</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2">
                      {topic.turkishTerms.slice(0, 2).map((term, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                          {term}
                        </span>
                      ))}
                      {topic.turkishTerms.length > 2 && (
                        <span className="text-xs text-gray-500">+{topic.turkishTerms.length - 2}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="w-1/2 overflow-y-auto p-6">
              {selectedTopic ? (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h2>
                    <p className="text-gray-600 mb-4">{selectedTopic.titleEn}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-medical-blue" />
                        <span className="text-sm text-gray-700">{selectedTopic.specialty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{selectedTopic.readTime} dakika okuma</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">%{selectedTopic.clinicalRelevance} klinik ilgi</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {streamingChunks.length > 0 && (
                    <StreamingResponse
                      streamChunks={streamingChunks}
                      isStreaming={isStreaming}
                      title={`${selectedPersona.name} - ${selectedTopic.title}`}
                      type="explanation"
                      enableTTS={true}
                      onComplete={(content) => {
                        console.log('ResidentPedia analysis complete:', content);
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tıbbi Konu Seçin</h3>
                  <p className="text-gray-600 mb-4">
                    Sol taraftan bir tıbbi konu seçerek detaylı AI analizi alın
                  </p>
                  <div className="text-sm text-gray-500">
                    AI Persona: {selectedPersona.name} ({selectedPersona.title})
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResidentPedia;