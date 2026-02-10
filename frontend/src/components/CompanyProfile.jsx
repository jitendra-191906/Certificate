import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/company-profile.css';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companyCIN: '',
    companyContact: '',
    companyEmail: '',
    companyWebsite: '',
    companyRegisteredOffice: '',
    signatoryName: '',
    signatoryDesignation: ''
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    // Fetch existing company profile
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/company', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setExistingProfile(profileData);
          setFormData({
            companyName: profileData.companyName || '',
            companyCIN: profileData.companyCIN || '',
            companyContact: profileData.companyContact || '',
            companyEmail: profileData.companyEmail || '',
            companyWebsite: profileData.companyWebsite || '',
            companyRegisteredOffice: profileData.companyRegisteredOffice || '',
            signatoryName: profileData.signatoryName || '',
            signatoryDesignation: profileData.signatoryDesignation || ''
          });
        } else if (response.status !== 404) {
          throw new Error('Failed to fetch company profile');
        }
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'companyLogo' && files[0]) {
      setCompanyLogo(files[0]);
    } else if (name === 'signature' && files[0]) {
      setSignature(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add files
      if (companyLogo) {
        formDataToSend.append('companyLogo', companyLogo);
      }
      if (signature) {
        formDataToSend.append('signature', signature);
      }

      const response = await fetch('http://localhost:3001/api/company', {
        method: existingProfile ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setExistingProfile(updatedProfile);
        alert(existingProfile ? 'Company profile updated successfully!' : 'Company profile created successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save company profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error saving company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-profile-container">
      <div className="company-profile-header">
        <h1>Company Profile</h1>
        <p>Configure your company letterhead and signature for professional documents</p>
        {existingProfile && (
          <div className="profile-status">
            <span className="status-badge">✓ Profile Active</span>
          </div>
        )}
      </div>

      <div className="profile-form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="company-profile-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyCIN">CIN Number</label>
                <input
                  type="text"
                  id="companyCIN"
                  name="companyCIN"
                  value={formData.companyCIN}
                  onChange={handleChange}
                  placeholder="e.g., U62013MH2025PTC448010"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyContact">Contact Number</label>
                <input
                  type="tel"
                  id="companyContact"
                  name="companyContact"
                  value={formData.companyContact}
                  onChange={handleChange}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="companyEmail">Email Address</label>
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="company@example.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Online Presence</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyWebsite">Website</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="www.example.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Registered Office</h3>
            <div className="form-group full-width">
              <label htmlFor="companyRegisteredOffice">Office Address</label>
              <textarea
                id="companyRegisteredOffice"
                name="companyRegisteredOffice"
                value={formData.companyRegisteredOffice}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your complete registered office address"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Authorized Signatory</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="signatoryName">Full Name *</label>
                <input
                  type="text"
                  id="signatoryName"
                  name="signatoryName"
                  value={formData.signatoryName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="signatoryDesignation">Designation</label>
                <input
                  type="text"
                  id="signatoryDesignation"
                  name="signatoryDesignation"
                  value={formData.signatoryDesignation}
                  onChange={handleChange}
                  placeholder="e.g., HR Manager, Director"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Document Assets</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyLogo">Company Logo</label>
                <input
                  type="file"
                  id="companyLogo"
                  name="companyLogo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {companyLogo && (
                  <div className="file-preview">
                    <img src={URL.createObjectURL(companyLogo)} alt="Logo preview" />
                    <span>{companyLogo.name}</span>
                  </div>
                )}
                {existingProfile?.companyLogoPath && !companyLogo && (
                  <small className="file-hint">Current logo saved</small>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="signature">Authorized Signature</label>
                <input
                  type="file"
                  id="signature"
                  name="signature"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {signature && (
                  <div className="file-preview">
                    <img src={URL.createObjectURL(signature)} alt="Signature preview" />
                    <span>{signature.name}</span>
                  </div>
                )}
                {existingProfile?.signaturePath && !signature && (
                  <small className="file-hint">Current signature saved</small>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : (existingProfile ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
