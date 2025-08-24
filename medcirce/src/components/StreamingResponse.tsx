/**
 * Streaming Response Component for Turkish Medical AI
 * Displays real-time AI responses with medical formatting and TTS integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Loader,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Brain,
  Stethoscope,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Square
} from 'lucide-react';
import { getTurkishMedicalTTS } from '../services/turkishTTS';
import type { StreamChunk } from '../services/streamingService';

interface StreamingResponseProps {
  streamChunks: StreamChunk[];
  isStreaming: boolean;
  title?: string;
  type?: 'analysis' | 'explanation' | 'recommendation';
  enableTTS?: boolean;
  onComplete?: (fullContent: string) => void;
  onCancel?: () => void;
}

interface StreamingState {
  displayedContent: string;
  currentChunk: number;
  isAutoPlaying: boolean;
  ttsEnabled: boolean;
  isPlayingTTS: boolean;
}

export const StreamingResponse: React.FC<StreamingResponseProps> = ({
  streamChunks,
  isStreaming,
  title,
  type = 'analysis',
  enableTTS = true,
  onComplete,
  onCancel
}) => {
  const [state, setState] = useState<StreamingState>({
    displayedContent: '',
    currentChunk: 0,
    isAutoPlaying: false,
    ttsEnabled: enableTTS,
    isPlayingTTS: false
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const ttsService = getTurkishMedicalTTS();
  const fullContent = streamChunks.map(chunk => chunk.content).join('');

  // Auto-scroll to bottom as content streams
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [streamChunks]);

  // Build displayed content from chunks
  useEffect(() => {
    const content = streamChunks.map(chunk => chunk.content).join('');
    setState(prev => ({ ...prev, displayedContent: content }));
  }, [streamChunks]);

  // Handle completion
  useEffect(() => {
    const isComplete = streamChunks.some(chunk => chunk.isComplete);
    if (isComplete && !isStreaming && onComplete) {
      onComplete(fullContent);
    }
  }, [streamChunks, isStreaming, fullContent, onComplete]);

  // Auto TTS for completed chunks
  useEffect(() => {
    if (state.ttsEnabled && state.isAutoPlaying && streamChunks.length > 0) {
      const lastChunk = streamChunks[streamChunks.length - 1];
      if (lastChunk && !state.isPlayingTTS) {
        handleAutoTTS(lastChunk.content);
      }
    }
  }, [streamChunks, state.ttsEnabled, state.isAutoPlaying]);

  const handleAutoTTS = async (content: string) => {
    try {
      setState(prev => ({ ...prev, isPlayingTTS: true }));
      await ttsService.speak(content, { rate: 0.9 }, 'normal');
    } catch (error) {
      console.error('Auto TTS Error:', error);
    } finally {
      setState(prev => ({ ...prev, isPlayingTTS: false }));
    }
  };

  const handleManualTTS = async () => {
    if (state.isPlayingTTS) {
      ttsService.stop();
      setState(prev => ({ ...prev, isPlayingTTS: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isPlayingTTS: true }));
      await ttsService.speak(fullContent, { rate: 0.85 }, 'normal');
    } catch (error) {
      console.error('Manual TTS Error:', error);
    } finally {
      setState(prev => ({ ...prev, isPlayingTTS: false }));
    }
  };

  const toggleTTS = () => {
    setState(prev => ({ ...prev, ttsEnabled: !prev.ttsEnabled }));
  };

  const toggleAutoPlay = () => {
    setState(prev => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'analysis': return <Brain className="w-5 h-5" />;
      case 'explanation': return <BookOpen className="w-5 h-5" />;
      case 'recommendation': return <Stethoscope className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'analysis': return 'medical-purple';
      case 'explanation': return 'medical-blue';
      case 'recommendation': return 'medical-green';
      default: return 'medical-cyan';
    }
  };

  const formatContent = (content: string) => {
    // Format medical content with proper highlighting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-medical-blue">$1</strong>')
      .replace(/(\d+\.\s[^.\n]+)/g, '<div class="mb-2 font-medium">$1</div>')
      .replace(/(•\s[^.\n]+)/g, '<div class="ml-4 mb-1 text-gray-700">$1</div>')
      .split('\n').map(line => line.trim()).filter(line => line.length > 0)
      .join('<br />');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${getTypeColor()}/10`}>
            <div className={`text-${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {title || (type === 'analysis' ? 'AI Analiz' : type === 'explanation' ? 'Terim Açıklaması' : 'Öneriler')}
            </h4>
            {isStreaming && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader className="w-3 h-3 animate-spin" />
                <span>Yanıt oluşturuluyor...</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Streaming Status */}
          <div className="flex items-center gap-1">
            {streamChunks.map((chunk, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  chunk.isComplete 
                    ? 'bg-green-500' 
                    : isStreaming && index === streamChunks.length - 1
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* TTS Controls */}
          {fullContent && (
            <>
              <button
                onClick={toggleTTS}
                className={`p-2 rounded-lg transition-colors ${
                  state.ttsEnabled 
                    ? `bg-${getTypeColor()}/20 text-${getTypeColor()}` 
                    : 'bg-gray-200 text-gray-600'
                }`}
                title={state.ttsEnabled ? 'TTS Açık' : 'TTS Kapalı'}
              >
                {state.ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleManualTTS}
                disabled={!state.ttsEnabled}
                className={`p-2 rounded-lg transition-colors ${
                  state.ttsEnabled
                    ? state.isPlayingTTS 
                      ? 'bg-red-500 text-white'
                      : `bg-${getTypeColor()} text-white hover:bg-${getTypeColor()}/80`
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={state.isPlayingTTS ? 'Durdur' : 'Sesli Oku'}
              >
                {state.isPlayingTTS ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* Cancel Button */}
          {isStreaming && onCancel && (
            <button
              onClick={onCancel}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="İptal Et"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        ref={containerRef}
        className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
      >
        <AnimatePresence>
          {streamChunks.map((chunk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3"
            >
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(chunk.content) 
                }}
              />
              
              {/* Chunk Metadata */}
              {chunk.metadata && (
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span className={`flex items-center gap-1 ${getConfidenceColor(chunk.metadata.confidence)}`}>
                    {chunk.metadata.confidence >= 0.8 ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    Güven: {Math.round(chunk.metadata.confidence * 100)}%
                  </span>
                  {chunk.metadata.medicalTerms.length > 0 && (
                    <span>
                      Tıbbi Terimler: {chunk.metadata.medicalTerms.slice(0, 3).join(', ')}
                      {chunk.metadata.medicalTerms.length > 3 && '...'}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming Cursor */}
        {isStreaming && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`inline-block w-2 h-4 bg-${getTypeColor()} ml-1`}
          />
        )}

        {/* Completion Status */}
        {!isStreaming && streamChunks.some(chunk => chunk.isComplete) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex items-center gap-2 text-sm text-green-600"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Yanıt tamamlandı • {streamChunks.length} parça • {fullContent.split(' ').length} kelime</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StreamingResponse;