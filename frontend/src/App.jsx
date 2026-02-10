import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CertificateGenerator from './components/CertificateGenerator';
import CompanyProfile from './components/CompanyProfile';
import Navbar from './components/Navbar';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:3001/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
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
                path="/generate-certificate" 
                element={user ? <CertificateGenerator /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/company-profile" 
                element={user ? <CompanyProfile /> : <Navigate to="/login" />} 
              />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




