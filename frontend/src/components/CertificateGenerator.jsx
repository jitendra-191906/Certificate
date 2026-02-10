import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/certificate-generator.css';

const CertificateGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    employeeEmail: '',
    certificateType: 'offer',
    position: '',
    duration: '',
    joiningDate: '',
    salary: '',
    offerDate: '',
    designation: '',
    startDate: '',
    endDate: '',
    companyName: '',
    companyAddress: '',
    reason: '',
    additionalDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    // Fetch company profile
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
          setCompanyProfile(profileData);
          // Pre-fill company data
          setFormData(prev => ({
            ...prev,
            companyName: profileData.companyName || '',
            companyAddress: profileData.companyRegisteredOffice || ''
          }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/letters/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${formData.employeeName.replace(/\s+/g, '_')}_offer_letter.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Offer letter generated and downloaded successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate offer letter');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error generating offer letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOfferLetterFields = () => {
    if (formData.certificateType === 'offer') {
      return (
        <>
          <div className="form-section">
            <h3>Offer Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duration *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 Months"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="joiningDate">Joining Date *</label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary *</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., ₹120000 per year"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="offerDate">Offer Date</label>
                <input
                  type="date"
                  id="offerDate"
                  name="offerDate"
                  value={formData.offerDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Recipient Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeEmail">Employee Email</label>
                <input
                  type="email"
                  id="employeeEmail"
                  name="employeeEmail"
                  value={formData.employeeEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  const renderCertificateFields = () => {
    if (formData.certificateType !== 'offer') {
      return (
        <>
          <div className="form-section">
            <h3>Duration</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="certificate-generator-container">
      <div className="certificate-generator-header">
        <h1>Generate Document</h1>
        <p>Create professional documents for your employees</p>
        {companyProfile && (
          <div className="company-profile-indicator">
            <span className="profile-badge">✓ Company Profile Configured</span>
          </div>
        )}
      </div>

      <div className="certificate-form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="certificate-form">
          <div className="form-section">
            <h3>Document Type</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="certificateType">Document Type *</label>
                <select
                  id="certificateType"
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleChange}
                  required
                >
                  <option value="offer">Offer Letter</option>
                  <option value="experience">Experience Certificate</option>
                  <option value="internship">Internship Certificate</option>
                  <option value="completion">Course Completion Certificate</option>
                  <option value="appreciation">Appreciation Certificate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Employee Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name *</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>

              {formData.certificateType !== 'offer' && (
                <div className="form-group">
                  <label htmlFor="designation">Designation *</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required={formData.certificateType !== 'offer'}
                  />
                </div>
              )}
            </div>
          </div>

          {renderOfferLetterFields()}
          {renderCertificateFields()}

          <div className="form-section">
            <h3>Company Information</h3>
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
                  disabled={!!companyProfile?.companyName}
                />
                {companyProfile?.companyName && (
                  <small className="form-hint">From company profile</small>
                )}
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="companyAddress">Company Address</label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  rows="2"
                  disabled={!!companyProfile?.companyRegisteredOffice}
                />
                {companyProfile?.companyRegisteredOffice && (
                  <small className="form-hint">From company profile</small>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Details</h3>
            <div className="form-group full-width">
              <label htmlFor="reason">Reason/Purpose</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., For higher studies, visa application, etc."
              />
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="additionalDetails">Additional Information</label>
              <textarea
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional details you want to include in the document"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="generate-btn"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateGenerator;
