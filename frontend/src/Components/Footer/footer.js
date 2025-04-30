import React from 'react'

function Footer() {
  const footerStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '0.3rem 0',  // reduced from 0.5rem
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1000
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 0.5rem', // reduced padding
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }

  const textStyle = {
    margin: '0.05rem 0', // reduced margin
    fontSize: '0.7rem'   // reduced font size
  }

  const linksContainerStyle = {
    marginBottom: '0.2rem', // reduced margin
    display: 'flex',
    gap: '0.5rem', // reduced gap
    flexWrap: 'wrap',
    justifyContent: 'center'
  }

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.7rem', // reduced font size
    cursor: 'pointer'
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={linksContainerStyle}>
          <span style={linkStyle}>About Us</span> |
          <span style={linkStyle}>Contact Us</span> |
          <span style={linkStyle}>Terms of Service</span> |
          <span style={linkStyle}>Privacy Policy</span> |
          <span style={linkStyle}>FAQs</span>
        </div>
        <p style={textStyle}>&copy; 2024 SkillDash. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
