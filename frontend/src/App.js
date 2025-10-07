import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/dashboard';
import Home from './pages/Home';
import ATSCheck from './pages/ATSCHECK';
import Auth from './pages/auth';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

// CSS
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={<Auth onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ats-check"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ATSCheck />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #292524 0%, #1c1917 100%)',
              color: '#f5f5f4',
              border: '1px solid #44403c',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#f5f5f4' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#f5f5f4' } },
            loading: { iconTheme: { primary: '#3b82f6', secondary: '#f5f5f4' } },
          }}
        />
      </div>
    </Router>
  );
}

export default App;


