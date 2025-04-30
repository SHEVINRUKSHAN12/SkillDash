import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNav from '../Nav/HomeNav';

function ServiceProviderLogin() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)', // Adjusted to account for navbar
    backgroundColor: '#f5f5f5',
    marginTop: '64px', // Added to prevent content from hiding behind navbar
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
  };

  const inputStyle = {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '3px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        console.log('Attempting login...');
        const response = await fetch('http://localhost:5000/api/sprovider/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                gmail: email.trim(),
                password: password
            })
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (data.success) {
            localStorage.setItem('serviceProviderToken', data.token);
            localStorage.setItem('providerData', JSON.stringify(data.provider));
            navigate('/service-provider/dashboard');
        } else {
            setError(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        setError('Server connection error. Please try again.');
    }
  };

  return (
    <>
      <HomeNav />
      <div style={containerStyle}>
        <h2>Service Provider Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form style={formStyle} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Username"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
      </div>
    </>
  );
}

export default ServiceProviderLogin;
