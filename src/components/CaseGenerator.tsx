/**
 * Clinical Case Generator Component
 * AI-powered case presentation generator for Turkish medical education
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Loader,
  FileText,
  Stethoscope,
  Brain,
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { getClinicalCaseGenerator, type CaseGenerationOptions, type GeneratedCase } from '../services/caseGenerator';
import PersonaSelector from './PersonaSelector';
import { AI_PERSONAS } from '../services/aiPersonas';

interface CaseGeneratorProps {
  onCaseGenerated?: (cases: GeneratedCase[]) => void;
}

export const CaseGenerator: React.FC<CaseGeneratorProps> = ({ onCaseGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCases, setGeneratedCases] = useState<GeneratedCase[]>([]);
  const [selectedPersona] = useState(AI_PERSONAS[1]); // Prof. Dr. Klinik for case generation
  
  const [options, setOptions] = useState<CaseGenerationOptions>({
    specialty: 'Acil Tıp',
    difficulty: 'intermediate',
    caseType: 'emergency',
    patientAge: '45',
    gender: 'male',
    chiefComplaint: 'Göğüs ağrısı',
    duration: '2 saat',
    teachingPoints: []
  });

  const specialties = [
    'Acil Tıp', 'İç Hastalıkları', 'Kardiyoloji', 'Nöroloji', 
    'Genel Cerrahi', 'Ortopedi', 'Anestezi-YBU', 'Pediatri',
    'Kadın Hastalıkları', 'Göğüs Hastalıkları', 'Enfeksiyon Hastalıkları'
  ];

  const commonComplaints = {
    'Acil Tıp': ['Göğüs ağrısı', 'Nefes darlığı', 'Karın ağrısı', 'Bilinç bulanıklığı', 'Ateş'],
    'Kardiyoloji': ['Göğüs ağrısı', 'Çarpıntı', 'Nefes darlığı', 'Bacak şişliği', 'Bayılma'],
    'Nöroloji': ['Baş ağrısı', 'Bilinç kaybı', 'Konvülsiyon', 'Güçsüzlük', 'Denge bozukluğu'],
    'İç Hastalıkları': ['Ateş', 'Halsizlik', 'Kilo kaybı', 'Karın ağrısı', 'Eklem ağrısı']
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const generator = getClinicalCaseGenerator(apiKey);
      const cases = await generator.generateMultipleCases(options, 1); // Generate 1 case
      
      setGeneratedCases(cases);
      if (onCaseGenerated) {
        onCaseGenerated(cases);
      }
      
    } catch (error) {
      console.error('Case generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = (preset: Partial<CaseGenerationOptions>) => {
    setOptions(prev => ({ ...prev, ...preset }));
    setTimeout(() => handleGenerate(), 100);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-medical-purple to-medical-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* Case Generator Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-medical-purple/10 rounded-lg">
                    <Sparkles className="w-6 h-6 text-medical-purple" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Klinik Vaka Oluşturucu</h2>
                    <p className="text-gray-600">AI destekli Türkçe tıbbi vaka sunumları</p>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Hızlı Vaka Şablonları</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleQuickGenerate({
                      specialty: 'Acil Tıp',
                      caseType: 'emergency',
                      chiefComplaint: 'Göğüs ağrısı',
                      difficulty: 'advanced'
                    })}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-left hover:bg-red-100 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-600 mb-2" />
                    <div className="text-sm font-medium text-red-800">Kardiyak Acil</div>
                    <div className="text-xs text-red-600">STEMI, Unstable Angina</div>
                  </button>

                  <button
                    onClick={() => handleQuickGenerate({
                      specialty: 'Nöroloji',
                      caseType: 'emergency',
                      chiefComplaint: 'Bilinç kaybı',
                      difficulty: 'advanced'
                    })}
                    className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
                  >
                    <Brain className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="text-sm font-medium text-purple-800">Nörolojik Acil</div>
                    <div className="text-xs text-purple-600">Stroke, Status Epilepticus</div>
                  </button>

                  <button
                    onClick={() => handleQuickGenerate({
                      specialty: 'İç Hastalıkları',
                      caseType: 'inpatient',
                      chiefComplaint: 'Ateş',
                      difficulty: 'intermediate'
                    })}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
                  >
                    <Stethoscope className="w-5 h-5 text-blue-600 mb-2" />
                    <div className="text-sm font-medium text-blue-800">İç Hastalıkları</div>
                    <div className="text-xs text-blue-600">Enfeksiyon, Metabolik</div>
                  </button>

                  <button
                    onClick={() => handleQuickGenerate({
                      specialty: 'Anestezi-YBU',
                      caseType: 'icu',
                      chiefComplaint: 'Solunum yetmezliği',
                      difficulty: 'advanced'
                    })}
                    className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-left hover:bg-orange-100 transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 text-orange-600 mb-2" />
                    <div className="text-sm font-medium text-orange-800">YBU Vakası</div>
                    <div className="text-xs text-orange-600">Kritik Hasta Yönetimi</div>
                  </button>
                </div>
              </div>

              {/* Custom Case Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık Dalı</label>
                    <select
                      value={options.specialty}
                      onChange={(e) => setOptions(prev => ({ ...prev, specialty: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    >
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ana Şikayet</label>
                    <select
                      value={options.chiefComplaint}
                      onChange={(e) => setOptions(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    >
                      {(commonComplaints[options.specialty as keyof typeof commonComplaints] || commonComplaints['Acil Tıp']).map(complaint => (
                        <option key={complaint} value={complaint}>{complaint}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hasta Yaşı</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={options.patientAge}
                        onChange={(e) => setOptions(prev => ({ ...prev, patientAge: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                      <select
                        value={options.gender}
                        onChange={(e) => setOptions(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                      >
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk Seviyesi</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                        <button
                          key={level}
                          onClick={() => setOptions(prev => ({ ...prev, difficulty: level }))}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                            options.difficulty === level
                              ? 'bg-medical-blue text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level === 'beginner' ? 'Başlangıç' : level === 'intermediate' ? 'Orta' : 'İleri'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vaka Tipi</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { key: 'emergency', label: 'Acil', icon: AlertTriangle },
                        { key: 'outpatient', label: 'Poliklinik', icon: Users },
                        { key: 'inpatient', label: 'Yataklı', icon: FileText },
                        { key: 'icu', label: 'YBU', icon: Heart }
                      ] as const).map(({ key, label, icon: Icon }) => (
                        <button
                          key={key}
                          onClick={() => setOptions(prev => ({ ...prev, caseType: key }))}
                          className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            options.caseType === key
                              ? 'bg-medical-purple text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şikayet Süresi</label>
                    <input
                      type="text"
                      placeholder="örn: 2 saat, 3 gün, 1 hafta"
                      value={options.duration || ''}
                      onChange={(e) => setOptions(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  AI: {selectedPersona.name} ({selectedPersona.title})
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-medical-purple to-medical-blue text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Vaka Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Vaka Oluştur
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Cases Preview */}
              {generatedCases.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Oluşturulan Vaka</h3>
                  </div>
                  
                  {generatedCases.map((case_, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">{case_.title}</h4>
                      <p className="text-sm text-green-700 mb-3">{case_.patient.history}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {case_.diagnosis.primary}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {case_.clinicalQuestions.length} soru
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseGenerator;