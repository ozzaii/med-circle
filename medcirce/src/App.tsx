import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';
import { sampleBooks } from './data/books';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Reader from './pages/Reader';
import AIChat from './pages/AIChat';
import Progress from './pages/Progress';
import Welcome from './pages/Welcome';
import MEPDashboard from './pages/MEPDashboard';

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
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="reader" element={<Reader />} />
            <Route path="ai-chat" element={<AIChat />} />
            <Route path="progress" element={<Progress />} />
            <Route path="mep" element={<MEPDashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;