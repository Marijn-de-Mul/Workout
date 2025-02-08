import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ProtectedRoute from '../ProtectedRoute';

const AccountInformation = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const token = Cookies.get('authToken');

      if (!token) {
        setError('Please login or register first.');
        return;
      }

      try {
        const response = await fetch('https://localhost:7087/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccountInfo(data);
        } else {
          setError('Failed to fetch account information.');
        }
      } catch (error) {
        setError('Failed to fetch account information.');
      }
    };

    fetchAccountInfo();
  }, []);

  const handleLogout = () => {
    Cookies.remove('authToken');
    window.location.href = '/login';
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!accountInfo) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <ProtectedRoute>
      <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Account</h2>
        <div style={{ marginBottom: '8px', color: 'black' }}>
          <p style={{ margin: 0 }}><strong>Name:</strong> {accountInfo.name}</p>
        </div>
        <div style={{ marginBottom: '8px', color: 'black' }}>
          <p style={{ margin: 0 }}><strong>Email:</strong> {accountInfo.email}</p>
        </div>
        <div style={{ marginBottom: '8px', color: 'black' }}>
          <p style={{ margin: 0 }}><strong>Joined:</strong> {new Date(accountInfo.joined).toLocaleDateString()}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '16px' }}>
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default AccountInformation;