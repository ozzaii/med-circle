import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';
import { sampleBooks } from './data/books';
import ErrorBoundary from './utils/errorBoundary';
import { FullPageLoader } from './components/LoadingStates';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import MEPDashboard from './pages/MEPDashboard';
import { VirtualPatientSimulator } from './components/VirtualPatientSimulator';

// Lazy load non-critical pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Library = lazy(() => import('./pages/Library'));
const Reader = lazy(() => import('./pages/Reader'));
const AIChat = lazy(() => import('./pages/AIChat'));
const Progress = lazy(() => import('./pages/Progress'));
const PerformanceAnalytics = lazy(() => import('./components/PerformanceAnalytics'));

function App() {
  const { user, setBooks, setUser } = useStore();

  useEffect(() => {
    // Initialize books data
    setBooks(sampleBooks);
    
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('medai-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [setBooks, setUser]);

  if (!user) {
    return <Welcome />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-medical-darker">
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'glass',
              style: {
                background: 'rgba(10, 14, 39, 0.9)',
                color: '#fff',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="reader" element={<Reader />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="progress" element={<Progress />} />
            <Route path="mep" element={<MEPDashboard />} />
            <Route path="analytics" element={<PerformanceAnalytics />} />
            <Route path="virtual-patient" element={<VirtualPatientSimulator />} />
          </Route>
        </Routes>
      </Suspense>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;