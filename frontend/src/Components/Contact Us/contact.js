import React from 'react'

function Contact() {
  const containerStyle = {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px'
  }

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Contact Us</h1>
      <form style={formStyle}>
        <input 
          type="text" 
          placeholder="Your Name"
          style={inputStyle}
        />
        <input 
          type="email" 
          placeholder="Your Email"
          style={inputStyle}
        />
        <textarea 
          placeholder="Your Message"
          style={{ ...inputStyle, minHeight: '150px' }}
        />
        <button style={buttonStyle}>
          Send Message
        </button>
      </form>
    </div>
  )
}

export default Contact
