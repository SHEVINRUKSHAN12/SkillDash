import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNav from '../Nav/CustomerNav';
import { toast } from 'react-toastify';
import axios from 'axios';

function CustomerProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCustomerProfile = useCallback(async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers/profile/${customerId}`);
      if (response.data.success) {
        setCustomerData(response.data.customer);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile data');
      if (error.response?.status === 404) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem('customerData'));
    if (!storedCustomer) {
      navigate('/login');
      return;
    }
    // Make sure we're using the correct property name from localStorage
    if (storedCustomer.customer && storedCustomer.customer.id) {
      fetchCustomerProfile(storedCustomer.customer.id);
    } else if (storedCustomer.id) {
      fetchCustomerProfile(storedCustomer.id);
    }
  }, [navigate, fetchCustomerProfile]);

  const handleInputChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/customers/${customerData.id}`,
        customerData
      );
      if (response.data.success) {
        // Update localStorage
        localStorage.setItem('customerData', JSON.stringify(response.data.customer));
        
        // Dispatch custom event
        window.dispatchEvent(new Event('customerDataChanged'));
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/customers/${customerData.id}`
      );
      if (response.data.success) {
        localStorage.removeItem('customerData');
        toast.success('Account deleted successfully');
        setShowDeleteModal(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      setShowDeleteModal(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '100px auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '5px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '10px',
    minWidth: '120px',
    display: 'inline-block'
  };

  const valueStyle = {
    margin: '0',
    display: 'inline-block'
  };

  const fieldContainerStyle = {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center'
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: showDeleteModal ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const modalButtonStyle = {
    padding: '10px 20px',
    margin: '10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div>
      <CustomerNav />
      <div style={containerStyle}>
        <h2>My Profile</h2>
        <div style={{ marginBottom: '20px' }}>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Name -</span>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={customerData.fullName}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : (
              <p style={valueStyle}>{customerData.fullName}</p>
            )}
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Email -</span>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : (
              <p style={valueStyle}>{customerData.email}</p>
            )}
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Phone Number -</span>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={customerData.phoneNumber}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : (
              <p style={valueStyle}>{customerData.phoneNumber}</p>
            )}
          </div>
          <div style={fieldContainerStyle}>
            <span style={labelStyle}>Address -</span>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={customerData.address}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px' }}
              />
            ) : (
              <p style={valueStyle}>{customerData.address}</p>
            )}
          </div>
        </div>
        <div>
          {isEditing ? (
            <>
              <button
                onClick={handleUpdateProfile}
                style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }}
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: 'white' }}
          >
            Delete Account
          </button>
        </div>
      </div>
      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>Delete Account</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
            Warning: This will permanently delete your account!<br />
            All your data will be lost and cannot be recovered.
          </p>
          <div>
            <button
              onClick={handleDelete}
              style={{ ...modalButtonStyle, backgroundColor: '#dc3545', color: 'white' }}
            >
              Yes, Delete My Account
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              style={{ ...modalButtonStyle, backgroundColor: '#6c757d', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
