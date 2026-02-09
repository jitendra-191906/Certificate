import React from 'react';

const GenerateLetter = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Letter</h1>
        <p className="text-gray-600 mt-2">Create experience and internship letters</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <span className="text-6xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Letter Generation</h2>
          <p className="text-gray-600 mt-2">This section will be implemented in the next step</p>
          <div className="mt-6 text-sm text-gray-500">
            Features coming soon:
            <ul className="mt-2 space-y-1">
              <li>• Select employee</li>
              <li>• Choose letter type (Experience/Internship)</li>
              <li>• Preview letter before generation</li>
              <li>• Download as PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateLetter;
