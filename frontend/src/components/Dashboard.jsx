import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLetters: 0,
    recentLetters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch employees count
        const employeesResponse = await fetch('http://localhost:3001/api/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch letters history
        const lettersResponse = await fetch('http://localhost:3001/api/letters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (employeesResponse.ok && lettersResponse.ok) {
          const employeesData = await employeesResponse.json();
          const lettersData = await lettersResponse.json();
          
          setStats({
            totalEmployees: employeesData.length || 0,
            totalLetters: lettersData.length || 0,
            recentLetters: lettersData.slice(0, 5) || []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to your Letter Generator Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-icon blue">
              <span className="stats-icon-emoji">👥</span>
            </div>
            <div className="stats-info">
              <p className="stats-label">Total Employees</p>
              <p className="stats-value">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-icon green">
              <span className="stats-icon-emoji">📝</span>
            </div>
            <div className="stats-info">
              <p className="stats-label">Letters Generated</p>
              <p className="stats-value">{stats.totalLetters}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-icon purple">
              <span className="stats-icon-emoji">🏢</span>
            </div>
            <div className="stats-info">
              <p className="stats-label">Company Profile</p>
              <p className="stats-value green">Configured</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-content">
            <div className="stats-icon orange">
              <span className="stats-icon-emoji">�</span>
            </div>
            <div className="stats-info">
              <p className="stats-label">Generate Letter</p>
              <button className="generate-letter-btn" onClick={() => navigate('/generate-certificate')}>
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="recent-letters-container">
        <div className="recent-letters-header">
          <h2 className="recent-letters-title">Recent Letters</h2>
        </div>
        <div className="recent-letters-content">
          {stats.recentLetters.length > 0 ? (
            <div className="letter-list">
              {stats.recentLetters.map((letter, index) => (
                <div key={index} className="letter-item">
                  <div className="letter-info">
                    <p className="letter-type">{letter.letterType}</p>
                    <p className="letter-date">
                      Generated on {new Date(letter.generatedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="download-btn">
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No letters generated yet</p>
              <button className="generate-first-btn" onClick={() => navigate('/generate-certificate')}>
                Generate Your First Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
