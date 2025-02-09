import React, { useState, Suspense } from 'react';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const AccountInformation = React.lazy(() => import('./components/settings/AccountInformation'));
const System = React.lazy(() => import('./components/settings/System'));
const RoutinesSettings = React.lazy(() => import('./components/settings/RoutinesSettings'));
const ExercisesSettings = React.lazy(() => import('./components/settings/ExercisesSettings'));

const Settings = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const renderCategory = () => {
    switch (selectedCategory) {
      case 'account':
        return <AccountInformation />;
      case 'system':
        return <System />;
      case 'routines':
        return <RoutinesSettings />;
      case 'exercises':
        return <ExercisesSettings />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {selectedCategory && (
          <button onClick={() => setSelectedCategory(null)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: 'green' }}>
            <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
              <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
            </svg>
            Back
          </button>
        )}
        {!selectedCategory && (
          <div style={{ width: '100%', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Settings</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div onClick={() => setSelectedCategory('account')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  Account
                  <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
                  </svg>
                </div>
              </li>
              <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div onClick={() => setSelectedCategory('system')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  System
                  <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
                  </svg>
                </div>
              </li>
              <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div onClick={() => setSelectedCategory('routines')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  Routines
                  <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
                  </svg>
                </div>
              </li>
              <li style={{ marginBottom: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div onClick={() => setSelectedCategory('exercises')} style={{ textDecoration: 'none', color: 'green', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  Exercises
                  <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
                    <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        )}

        <Suspense fallback={<div>Loading...</div>}>
          {renderCategory()}
        </Suspense>

        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
};

export default Settings;