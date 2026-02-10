import React from 'react';

const TestComponent = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>Test Component</h1>
        <p style={{ color: '#666' }}>If you can see this, the basic rendering works.</p>
      </div>
    </div>
  );
};

export default TestComponent;
