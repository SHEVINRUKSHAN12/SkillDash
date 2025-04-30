import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeNav from '../Nav/HomeNav';

function CustomerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/customers/login', formData);
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Ensure we store the data with _id instead of id
        const customerData = {
          ...response.data.customer,
          _id: response.data.customer.id || response.data.customer._id
        };
        localStorage.setItem('customerData', JSON.stringify(customerData));
        toast.success('Login successful!');
        
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 1500);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
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
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <>
      <HomeNav />
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center' }}>Customer Login</h2>
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
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}

export default CustomerLogin;
