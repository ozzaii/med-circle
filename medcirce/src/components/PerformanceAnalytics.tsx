import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  TrendingUp, TrendingDown, Target, Award, Clock, Brain,
  Activity, AlertTriangle, Download, Calendar, Filter,
  ChevronRight, Zap, Users, BookOpen, BarChart3
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { useStore } from '../store';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface AnalyticsData {
  overview: {
    totalModulesCompleted: number;
    totalCasesCompleted: number;
    averageScore: number;
    totalTimeSpent: number;
    accuracyRate: number;
    improvementRate: number;
  };
  performanceTrend: Array<{
    date: string;
    averageScore: number;
    totalTime: number;
    casesCompleted: number;
  }>;
  moduleBreakdown: Array<{
    moduleId: string;
    attempts: number;
    averageScore: number;
    averageTime: number;
    accuracy: number;
  }>;
  timeAnalysis: Array<{
    hour: number;
    averageScore: number;
    activityLevel: number;
  }>;
  learningPattern: {
    strongAreas: string[];
    weakAreas: string[];
    improvementRate: number;
    consistencyScore: number;
    learningVelocity: number;
    masteryLevel: Map<string, number>;
  } | null;
  sessions: Array<{
    sessionStart: number;
    sessionEnd: number;
    activeDuration: number;
    idleDuration: number;
    modulesCompleted: string[];
    averageScore: number;
  }>;
  recommendations: string[];
}

export default function PerformanceAnalytics() {
  const { user } = useStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'time' | 'accuracy'>('score');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAnalytics();
    
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const range = getTimeRange();
      const data = await analyticsService.getDetailedAnalytics(user.id, range);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (timeRange) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'all':
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  const exportPDF = async () => {
    if (!analyticsData || !user) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('MedCircle Performance Report', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Student: ${user.name}`, 20, 35);
    pdf.text(`Date: ${new Date().toLocaleDateString('tr-TR')}`, 20, 42);
    pdf.text(`Period: ${timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'All time'}`, 20, 49);
    
    // Overview section
    pdf.setFontSize(14);
    pdf.text('Performance Overview', 20, 65);
    pdf.setFontSize(10);
    
    const overviewData = [
      ['Metric', 'Value'],
      ['Total Modules Completed', analyticsData.overview.totalModulesCompleted.toString()],
      ['Total Cases Completed', analyticsData.overview.totalCasesCompleted.toString()],
      ['Average Score', `${analyticsData.overview.averageScore.toFixed(1)}%`],
      ['Total Time Spent', `${Math.round(analyticsData.overview.totalTimeSpent / 60)} minutes`],
      ['Accuracy Rate', `${analyticsData.overview.accuracyRate.toFixed(1)}%`],
      ['Improvement Rate', `${analyticsData.overview.improvementRate > 0 ? '+' : ''}${analyticsData.overview.improvementRate.toFixed(1)}%`]
    ];
    
    pdf.autoTable({
      startY: 70,
      head: [overviewData[0]],
      body: overviewData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [6, 182, 212] }
    });
    
    // Learning Pattern
    if (analyticsData.learningPattern) {
      const currentY = (pdf as any).lastAutoTable.finalY + 15;
      pdf.setFontSize(14);
      pdf.text('Learning Pattern Analysis', 20, currentY);
      
      pdf.setFontSize(10);
      pdf.text(`Strong Areas: ${analyticsData.learningPattern.strongAreas.join(', ') || 'None identified yet'}`, 20, currentY + 10);
      pdf.text(`Areas for Improvement: ${analyticsData.learningPattern.weakAreas.join(', ') || 'None identified yet'}`, 20, currentY + 17);
      pdf.text(`Consistency Score: ${analyticsData.learningPattern.consistencyScore.toFixed(0)}%`, 20, currentY + 24);
      pdf.text(`Learning Velocity: ${analyticsData.learningPattern.learningVelocity > 0 ? 'Positive' : analyticsData.learningPattern.learningVelocity < 0 ? 'Negative' : 'Stable'}`, 20, currentY + 31);
    }
    
    // Recommendations
    if (analyticsData.recommendations.length > 0) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text('Personalized Recommendations', 20, 20);
      pdf.setFontSize(10);
      
      let yPosition = 30;
      analyticsData.recommendations.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, 20, yPosition);
        yPosition += 10;
      });
    }
    
    // Performance Trend Chart Data
    if (analyticsData.performanceTrend.length > 0) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text('Performance Trend', 20, 20);
      
      const trendData = analyticsData.performanceTrend.map(item => [
        new Date(item.date).toLocaleDateString('tr-TR'),
        item.averageScore.toFixed(1),
        item.casesCompleted.toString()
      ]);
      
      pdf.autoTable({
        startY: 30,
        head: [['Date', 'Avg Score', 'Cases']],
        body: trendData,
        theme: 'striped',
        headStyles: { fillColor: [6, 182, 212] }
      });
    }
    
    // Save the PDF
    pdf.save(`MedCircle_Performance_Report_${user.name}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportCSV = async () => {
    if (!analyticsData || !user) return;
    
    const blob = await analyticsService.exportAnalyticsReport(user.id, 'csv');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedCircle_Analytics_${user.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-400">No analytics data available yet</p>
          <p className="text-sm text-gray-500 mt-2">Complete some modules to see your performance analytics</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BarChart3 className="w-10 h-10 text-cyan-400" />
                Performance Analytics
              </h1>
              <p className="text-gray-400">Real-time insights into your medical education journey</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                {(['week', 'month', 'all'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeRange === range
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === 'week' ? '7 Days' : range === 'month' ? '30 Days' : 'All Time'}
                  </button>
                ))}
              </div>
              
              {/* Export Buttons */}
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className={`text-sm font-medium ${analyticsData.overview.improvementRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analyticsData.overview.improvementRate > 0 ? '+' : ''}{analyticsData.overview.improvementRate.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {analyticsData.overview.averageScore.toFixed(1)}%
            </h3>
            <p className="text-gray-400 text-sm">Average Score</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-cyan-400" />
              <span className="text-sm font-medium text-green-400">
                {analyticsData.overview.accuracyRate.toFixed(0)}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {analyticsData.overview.totalCasesCompleted}
            </h3>
            <p className="text-gray-400 text-sm">Cases Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {Math.round(analyticsData.overview.totalTimeSpent / 60)}
            </h3>
            <p className="text-gray-400 text-sm">Minutes Studied</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-green-400" />
              <span className="text-sm font-medium text-gray-400">
                Completed
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {analyticsData.overview.totalModulesCompleted}
            </h3>
            <p className="text-gray-400 text-sm">Modules</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#06b6d4" 
                  fill="url(#colorScore)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Module Performance Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Module Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analyticsData.moduleBreakdown.map(m => ({
                module: m.moduleId.replace('case-', '').replace('-complete', '').substring(0, 10),
                score: m.averageScore,
                accuracy: m.accuracy
              }))}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="module" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Time Analysis Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Activity Heatmap
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.timeAnalysis.filter(t => t.activityLevel > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'activityLevel') return [`${value} sessions`, 'Activity'];
                    if (name === 'averageScore') return [`${value.toFixed(1)}%`, 'Avg Score'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="activityLevel" fill="#10b981" />
                <Bar dataKey="averageScore" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Learning Pattern */}
          {analyticsData.learningPattern && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Learning Pattern Analysis
              </h3>
              
              <div className="space-y-4">
                {/* Consistency Score */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Consistency Score</span>
                    <span className="text-white font-bold">
                      {analyticsData.learningPattern.consistencyScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${analyticsData.learningPattern.consistencyScore}%` }}
                    />
                  </div>
                </div>

                {/* Learning Velocity */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Learning Velocity</span>
                    <span className={`font-bold ${
                      analyticsData.learningPattern.learningVelocity > 0 
                        ? 'text-green-400' 
                        : analyticsData.learningPattern.learningVelocity < 0 
                        ? 'text-red-400' 
                        : 'text-gray-400'
                    }`}>
                      {analyticsData.learningPattern.learningVelocity > 0 ? '↑' : 
                       analyticsData.learningPattern.learningVelocity < 0 ? '↓' : '→'} 
                      {Math.abs(analyticsData.learningPattern.learningVelocity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Strong Areas */}
                {analyticsData.learningPattern.strongAreas.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-2">Strong Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {analyticsData.learningPattern.strongAreas.map(area => (
                        <span key={area} className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg text-sm border border-green-800">
                          {area.replace('case-', '').replace('-complete', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weak Areas */}
                {analyticsData.learningPattern.weakAreas.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-2">Needs Improvement</p>
                    <div className="flex flex-wrap gap-2">
                      {analyticsData.learningPattern.weakAreas.map(area => (
                        <span key={area} className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg text-sm border border-red-800">
                          {area.replace('case-', '').replace('-complete', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Recommendations */}
        {analyticsData.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-800/30"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-cyan-400" />
              Personalized Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}