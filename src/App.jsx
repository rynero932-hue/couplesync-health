import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PasswordScreen from './pages/PasswordScreen';
import PairingScreen from './pages/PairingScreen';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Workout from './pages/Workout';
import Progress from './pages/Progress';
import CouplePage from './pages/CouplePage';
import AIAssistant from './pages/AIAssistant';
import Navbar from './components/Navbar';
import './styles/globals.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [user, setUser] = useState(null); // { name, gender, role }

  // Check local storage on mount
  useEffect(() => {
    const auth = localStorage.getItem('cs_auth');
    const paired = localStorage.getItem('cs_paired');
    const userData = localStorage.getItem('cs_user');
    
    if (auth === 'true') setIsAuthenticated(true);
    if (paired === 'true') setIsPaired(true);
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('cs_auth', 'true');
  };

  const handlePairingSuccess = (userData) => {
    localStorage.setItem('cs_user', JSON.stringify(userData));
    localStorage.setItem('cs_paired', 'true');
    setUser(userData);
    setIsPaired(true);
  };

  if (!isAuthenticated) {
    return <PasswordScreen onSuccess={handlePasswordSuccess} />;
  }

  if (!isPaired) {
    return <PairingScreen onSuccess={handlePairingSuccess} />;
  }

  return (
    <Router>
      <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64">
        <Navbar user={user} />
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/habits" element={<Habits user={user} />} />
            <Route path="/workout" element={<Workout user={user} />} />
            <Route path="/progress" element={<Progress user={user} />} />
            <Route path="/couple" element={<CouplePage user={user} />} />
            <Route path="/ai" element={<AIAssistant user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
