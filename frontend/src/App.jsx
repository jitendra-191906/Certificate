import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CompanyProfile from './components/CompanyProfile';
import Employees from './components/Employees';
import GenerateLetter from './components/GenerateLetter';
import LetterHistory from './components/LetterHistory';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } 
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar user={user} setUser={setUser} />}
        <div className="flex">
          {user && <Sidebar />}
          <main className={`flex-1 ${user ? 'ml-64' : ''}`}>
            <Routes>
              <Route 
                path="/login" 
                element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/company-profile" 
                element={user ? <CompanyProfile /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/employees" 
                element={user ? <Employees /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/generate-letter" 
                element={user ? <GenerateLetter /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/letter-history" 
                element={user ? <LetterHistory /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/" 
                element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;




