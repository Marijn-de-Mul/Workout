import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Account = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const token = Cookies.get('authToken');

      if (!token) {
        setError('Please login or register first.');
        return;
      }

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
    };

    fetchAccountInfo();
  }, []);

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <p>{error}</p>
        <div>
          <a href="/login" style={{ marginRight: '10px' }}>Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
    );
  }

  if (!accountInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Account Information</h1>
      <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
    </div>
  );
};

export default Account;