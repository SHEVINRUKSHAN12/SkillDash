import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNav from '../Nav/HomeNav';

function Cregister() {
  const navigate = useNavigate(); // Add this hook
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form:', formData);
      const response = await axios.post('http://localhost:5000/api/customers/register', formData);
      console.log('Response:', response.data);

      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful!');
        setFormData({ fullName: '', email: '', password: '', phoneNumber: '', address: '' });
        
        // Add delay before redirect to show success message
        setTimeout(() => {
          navigate('/customer-login'); // Redirect to login page
        }, 2000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {  // Removed stray 'c' character here
      console.error('Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 70px)', // Adjusted for nav bar
    backgroundColor: '#f5f5f5',
    marginTop: '70px', // Added to prevent overlap with nav
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  return (
    <>
      <HomeNav />
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={headingStyle}>Customer Registration</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            style={inputStyle}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            style={inputStyle}
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            style={{...inputStyle, height: '80px'}}
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="submit" style={buttonStyle}>Register</button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default Cregister;
