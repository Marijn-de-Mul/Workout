import React, { useState } from 'react';

const Preferences = () => {
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Preferences</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'black' }}>
        <p style={{ margin: 0 }}>Language</p>
        <select value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'black' }}>
        <p style={{ margin: 0 }}>Timezone</p>
        <select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
          <option value="UTC">UTC</option>
          <option value="PST">Pacific Standard Time</option>
          <option value="EST">Eastern Standard Time</option>
        </select>
      </div>
    </div>
  );
};

export default Preferences;