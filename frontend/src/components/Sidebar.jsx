import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/company-profile', label: 'Company Profile', icon: '🏢' },
    { path: '/employees', label: 'Employees', icon: '👥' },
    { path: '/generate-letter', label: 'Generate Letter', icon: '📝' },
    { path: '/letter-history', label: 'Letter History', icon: '📚' },
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
