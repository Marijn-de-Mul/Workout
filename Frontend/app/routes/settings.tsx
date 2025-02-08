import React, { useState } from 'react';
import { IconChevronLeft } from '@tabler/icons-react';
import MobileNavbar from './components/MobileNavbar';
import AccountInformation from './components/settings/AccountInformation';
import Appearance from './components/settings/Appearance';
import Preferences from './components/settings/Preferences';

const Settings = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderCategory = () => {
    switch (selectedCategory) {
      case 'account':
        return <AccountInformation />;
      case 'appearance':
        return <Appearance />;
      case 'preferences':
        return <Preferences />;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9f9f9' }}>
      {selectedCategory && (
        <button onClick={() => setSelectedCategory(null)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: 'green' }}>
          <IconChevronLeft size={24} /> Back
        </button>
      )}
      {!selectedCategory && (
        <div style={{ width: '100%', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Settings</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div onClick={() => setSelectedCategory('account')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                Account
                <IconChevronLeft size={24} />
              </div>
            </li>
            <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div onClick={() => setSelectedCategory('appearance')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                Appearance
                <IconChevronLeft size={24} />
              </div>
            </li>
            <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div onClick={() => setSelectedCategory('preferences')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                Preferences
                <IconChevronLeft size={24} />
              </div>
            </li>
          </ul>
        </div>
      )}

      {renderCategory()}

      <MobileNavbar />
    </div>
  );
};

export default Settings;