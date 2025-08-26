import React from 'react';
import { motion } from 'framer-motion';

export const CaseCardSkeleton: React.FC = () => (
  <div className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-14 h-14 bg-gray-700 rounded-xl" />
      <div className="flex-1">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-700 rounded" />
      <div className="h-4 bg-gray-700 rounded w-5/6" />
    </div>
    <div className="flex gap-4 mb-6">
      <div className="h-4 bg-gray-700 rounded w-20" />
      <div className="h-4 bg-gray-700 rounded w-20" />
    </div>
    <div className="h-12 bg-gray-700 rounded-xl" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-12 bg-gray-800 rounded w-1/3 mb-3" />
        <div className="h-6 bg-gray-800 rounded w-1/2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-2xl p-8 animate-pulse">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl mb-6" />
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-6 bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <CaseCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-2/3 mb-6" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-gray-700 border-t-cyan-400 rounded-full`}
      />
      {message && (
        <p className="mt-4 text-gray-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export const FullPageLoader: React.FC = () => (
  <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <LoadingSpinner size="lg" />
      <h2 className="text-xl font-bold text-white mt-4">MedCircle Yükleniyor</h2>
      <p className="text-gray-400 mt-2">Lütfen bekleyin...</p>
    </motion.div>
  </div>
);

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => (
  <div className="w-full">
    {label && (
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white font-bold">{progress}%</span>
      </div>
    )}
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
      />
    </div>
  </div>
);

export const ErrorState: React.FC<{ 
  message: string; 
  onRetry?: () => void;
}> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">Bir Hata Oluştu</h3>
    <p className="text-gray-400 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
      >
        Tekrar Dene
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ 
  title: string; 
  message: string;
  action?: { label: string; onClick: () => void };
}> = ({ title, message, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
      >
        {action.label}
      </button>
    )}
  </div>
);