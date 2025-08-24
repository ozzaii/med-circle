/**
 * AI Persona Selector Component
 * Allows users to choose between different AI personalities
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { AI_PERSONAS, type AIPersona } from '../services/aiPersonas';

interface PersonaSelectorProps {
  selectedPersona: AIPersona;
  onPersonaChange: (persona: AIPersona) => void;
  className?: string;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onPersonaChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonaSelect = (persona: AIPersona) => {
    onPersonaChange(persona);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Persona Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 bg-gradient-to-r from-${selectedPersona.color}/10 to-${selectedPersona.color}/5 border border-${selectedPersona.color}/20 rounded-lg hover:from-${selectedPersona.color}/15 hover:to-${selectedPersona.color}/10 transition-all duration-200`}
      >
        <div className="flex items-center gap-3">
          <div className="text-xl">{selectedPersona.icon}</div>
          <div className="text-left">
            <div className={`font-semibold text-${selectedPersona.color}`}>
              {selectedPersona.name}
            </div>
            <div className="text-xs text-gray-600">
              {selectedPersona.title}
            </div>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-4 h-4 text-${selectedPersona.color}`} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="py-2">
                {AI_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(persona)}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                  >
                    {/* Persona Icon */}
                    <div className="text-xl flex-shrink-0">
                      {persona.icon}
                    </div>
                    
                    {/* Persona Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-${persona.color}`}>
                          {persona.name}
                        </span>
                        {selectedPersona.id === persona.id && (
                          <Check className={`w-4 h-4 text-${persona.color}`} />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {persona.title}
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed">
                        {persona.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Footer Info */}
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Seçili AI Kişiliği:</span> {selectedPersona.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Her AI farklı yaklaşım ve uzmanlık alanı sunar
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonaSelector;