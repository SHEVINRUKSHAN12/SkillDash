import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNav from '../Nav/HomeNav';

function SProviderRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    gmail: '',
    password: '',
    phonenumber: '',
    address: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        // Verify all required fields
        const requiredFields = ['fullname', 'username', 'gmail', 'password', 'phonenumber', 'address'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setMessage({
                text: `❌ Please fill in all required fields: ${missingFields.join(', ')}`,
                type: 'error'
            });
            return;
        }
        
        const formDataToSend = new FormData();
        
        // Add each field with explicit toString() conversion
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                console.log(`Adding ${key} to FormData: ${formData[key]}`);
                // Explicitly convert all values to strings
                formDataToSend.append(key, String(formData[key]));
            }
        });
        
        if (profilePicture) {
            console.log('Adding profile picture to FormData:', profilePicture.name);
            formDataToSend.append('profilePicture', profilePicture);
        }
        
        console.log('Submitting form data with profile picture');
        
        // Log all FormData entries
        const formDataEntries = [];
        for (let pair of formDataToSend.entries()) {
            const value = pair[0] === 'profilePicture' ? '[File]' : pair[1];
            formDataEntries.push(`${pair[0]}: ${value}`);
            console.log(`${pair[0]}: ${value}`);
        }
        console.log('FormData entries:', formDataEntries);

        const response = await fetch('http://localhost:5000/api/sprovider/register', {
            method: 'POST',
            body: formDataToSend
        });

        if (!response.ok) {
            let errorData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
                console.error('Error response from server (JSON):', errorData);
            } else {
                const errorText = await response.text();
                console.error('Error response from server (Text):', errorText);
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText || 'Unknown error' };
                }
            }
            
            throw new Error(errorData.message || 'Failed to register');
        }

        const data = await response.json();
        console.log('Server response:', data);

        setMessage({
            text: '✅ Registration successful! Redirecting to login...',
            type: 'success'
        });

        setTimeout(() => {
            navigate('/service-provider/login');
        }, 3000);

    } catch (error) {
        console.error('Registration error:', error);
        setMessage({
            text: `❌ ${error.message || 'Registration failed. Please try again.'}`,
            type: 'error'
        });
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '90px auto 20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '80px',
  };

  const messageStyle = {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    textAlign: 'center',
  };

  const successStyle = {
    ...messageStyle,
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  };

  const messageContainerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    minWidth: '300px',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.5s ease-out',
    zIndex: 1000,
    opacity: message.text ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const successMessageStyle = {
    ...messageContainerStyle,
    backgroundColor: '#4caf50',
    color: 'white',
    border: '1px solid #45a049',
  };

  const errorMessageStyle = {
    ...messageContainerStyle,
    backgroundColor: '#f44336',
    color: 'white',
    border: '1px solid #da3c31',
  };

  const fileInputContainerStyle = {
    marginBottom: '20px',
    textAlign: 'center',
  };
  
  const previewImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '10px auto',
    border: '2px solid #ccc',
    display: 'block',
  };
  
  const placeholderStyle = {
    ...previewImageStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    color: '#888',
    fontSize: '14px',
  };

  const fileInputLabelStyle = {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const hiddenFileInput = {
    display: 'none',
  };

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  return (
    <>
      <HomeNav />
      {message.text && (
        <div style={message.type === 'success' ? successMessageStyle : errorMessageStyle}>
          {message.text}
        </div>
      )}
      <div style={containerStyle}>
        <h2>Service Provider Registration</h2>
        {message.text && (
          <div style={message.type === 'success' ? successStyle : errorStyle}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div style={fileInputContainerStyle}>
            {previewUrl ? (
              <img src={previewUrl} alt="Profile preview" style={previewImageStyle} />
            ) : (
              <div style={placeholderStyle}>No image selected</div>
            )}
            <label htmlFor="profilePicture" style={fileInputLabelStyle}>
              Choose Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              style={hiddenFileInput}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="fullname" style={labelStyle}>Full Name:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              style={inputStyle}
              required
              autoComplete="name"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="username" style={labelStyle}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
              autoComplete="username"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="gmail" style={labelStyle}>Email:</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              style={inputStyle}
              required
              autoComplete="email"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
              autoComplete="new-password"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="phonenumber" style={labelStyle}>Phone Number:</label>
            <input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              style={inputStyle}
              required
              autoComplete="tel"
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="address" style={labelStyle}>Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={textareaStyle}
              required
              autoComplete="street-address"
            />
          </div>
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
      </div>
    </>
  );
}

export default SProviderRegister;
