import React, { useState, useEffect } from 'react';

const Dashboard = () => {
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
      <div className="p-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your Letter Generator Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Letters Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLetters}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Company Profile</p>
              <p className="text-sm font-bold text-green-600">Configured</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentLetters.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Letters */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Letters</h2>
        </div>
        <div className="p-6">
          {stats.recentLetters.length > 0 ? (
            <div className="space-y-4">
              {stats.recentLetters.map((letter, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{letter.letterType}</p>
                    <p className="text-sm text-gray-600">
                      Generated on {new Date(letter.generatedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No letters generated yet</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Generate Your First Letter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
