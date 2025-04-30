import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HomeNav() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: '#333',
    textDecoration: 'none',
    fontSize: '1rem'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none', // Ensure this line ends with a comma, not a semicolon
    cursor: 'pointer',
    marginLeft: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    padding: '0.5rem',
    display: showRegisterOptions ? 'block' : 'none',
    zIndex: 1000,
    minWidth: '200px'
  };

  const dropdownButtonStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#333',
    margin: '0.25rem 0',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>SkillDash</div>
      
      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/happy-customers" style={linkStyle}>Happy Customers</Link>
        <Link to="/contact" style={linkStyle}>Contact Us</Link>
        <div>
          <Link to="/provider-login">
            <button style={{ ...buttonStyle, backgroundColor: 'orange' }}>Service Provider Login</button>
          </Link>
        </div>
        <div>
          <Link to="/customer-login">
            <button style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Customer Login</button>
          </Link>
        </div>
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowRegisterOptions(true)}
          onMouseLeave={() => setShowRegisterOptions(false)}
        >
          <button 
            style={{...buttonStyle, backgroundColor: '#6c757d'}}
            onClick={() => setShowRegisterOptions(!showRegisterOptions)}
          >
            Register ▼
          </button>
          <div style={dropdownStyle}>
            <Link 
              to="/customer-register"
              style={dropdownButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Customer Register
            </Link>
            <Link 
              to="/provider-register"
              style={dropdownButtonStyle}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Service Provider Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HomeNav;
