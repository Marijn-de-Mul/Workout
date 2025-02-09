import React from 'react';

const System = () => {
  const handleUpdate = async () => {
    try {
      const response = await fetch('https://localhost:7087/api/update', {
        method: 'POST',
      });
      if (response.ok) {
        alert('Update initiated successfully');
      } else {
        alert('Failed to initiate update');
      }
    } catch (error) {
      alert('Error initiating update');
    }
  };

  return (
    <div style={{ width: '100%', borderRadius: '8px', padding: '16px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>System Settings</h2>
      <button onClick={handleUpdate} style={{ width: '100%', padding: '12px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Update Application
      </button>
    </div>
  );
};

export default System;