import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('https://localhost:7087/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      Cookies.set('authToken', data.token);
      console.log('Login successful:', data);
      window.location.href = '/'; 
    } else {
      console.error('Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '16px', color: 'green' }}>Login</h2>
        <div style={{ marginBottom: '10px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'black' }}>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: 'black' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px' }}>Login</button>
        <p style={{ marginTop: '16px', color: 'black' }}>
          Don't have an account? <Link to="/register" style={{ color: 'green' }}>Register</Link>
        </p>
      </form>
      {token && (
        <div style={{ marginTop: '20px', wordWrap: 'break-word', width: '80%', textAlign: 'center' }}>
          <p>Token:</p>
          <p style={{ whiteSpace: 'pre-wrap', color: 'black' }}>{token}</p>
        </div>
      )}
    </div>
  );
};

export default Login;