import React from 'react';

const CompanyProfile = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
        <p className="text-gray-600 mt-2">Manage your company information and branding</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <span className="text-6xl">🏢</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Company Profile Setup</h2>
          <p className="text-gray-600 mt-2">This section will be implemented in the next step</p>
          <div className="mt-6 text-sm text-gray-500">
            Features coming soon:
            <ul className="mt-2 space-y-1">
              <li>• Company logo upload</li>
              <li>• Company details configuration</li>
              <li>• Authorized signature upload</li>
              <li>• Address and contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
