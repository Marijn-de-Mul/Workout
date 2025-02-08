import React, { useState } from 'react';

const Appearance = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Appearance</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'black' }}>
        <p style={{ margin: 0 }}>Dark Mode</p>
        <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
      </div>
    </div>
  );
};

export default Appearance;