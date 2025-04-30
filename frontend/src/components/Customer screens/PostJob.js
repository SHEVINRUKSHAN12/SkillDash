import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomerNav from '../Nav/CustomerNav';
import axios from 'axios';

function PostJob() {
  // Available service types - matching the ones in ServiceManagement component
  const availableServiceTypes = [
    "Plumbing",
    "Electrical Services",
    "Cleaning Services",
    "AC & Appliance Repair",
    "Carpentry & Woodwork",
    "Painting & Renovation",
    "Gardening & Grass Cutting",
    "Home & Furniture Assembly",
    "CCTV & Smart Device Installation",
    "Moving & Delivery Services",
    "Pest Control",
    "Locksmith Services",
    "Water Tank & Gutter Cleaning",
    "Handyman / General Fixes"
  ];

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    serviceType: '', // Changed from serviceTypes array to serviceType string
    dueDate: ''
  });
  
  const navigate = useNavigate();

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (new Date(jobForm.dueDate) < new Date()) {
      toast.error('Due date cannot be in the past');
      return;
    }

    if (!jobForm.serviceType) {
      toast.error('Please select a service type');
      return;
    }

    try {
      const customerData = JSON.parse(localStorage.getItem('customerData'));
      if (!customerData) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      const customerId = customerData._id || customerData.id;
      
      const response = await axios.post('http://localhost:5000/api/jobs/create', {
        ...jobForm,
        customerId: customerId,
        serviceTypes: [jobForm.serviceType], // Convert single selection to array for backend compatibility
        budget: Number(jobForm.budget) // Ensure budget is a number
      });

      if (response.data.success) {
        toast.success('Job posted successfully!');
        navigate('/customer-dashboard');
      } else {
        toast.error(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  // Styling - matching the styling from ServiceManagement component
  const pageStyles = {
    padding: '20px',
    marginTop: '64px',
    backgroundColor: '#f5f5f5',
    minHeight: 'calc(100vh - 64px)'
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '20px auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const formGroupStyles = {
    marginBottom: '15px'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyles = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  };

  // Removed unused style variables: checkboxContainerStyles, checkboxGroupStyles, checkboxLabelStyles

  return (
    <>
      <CustomerNav />
      <div style={pageStyles}>
        <div style={containerStyle}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Post a New Job</h2>
          <form style={formStyle} onSubmit={handleJobSubmit}>
            <div style={formGroupStyles}>
              <label style={labelStyles} htmlFor="title">Job Title*</label>
              <input
                style={inputStyles}
                type="text"
                id="title"
                placeholder="Job Title"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                required
              />
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles} htmlFor="description">Description*</label>
              <textarea
                style={{...inputStyles, minHeight: '150px'}}
                id="description"
                placeholder="Job Description"
                value={jobForm.description}
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{...formGroupStyles, flex: 1}}>
                <label style={labelStyles} htmlFor="budget">Budget (Rs.)*</label>
                <input
                  style={inputStyles}
                  type="number"
                  id="budget"
                  placeholder="Budget"
                  value={jobForm.budget}
                  onChange={(e) => setJobForm({...jobForm, budget: e.target.value})}
                  required
                />
              </div>

              <div style={{...formGroupStyles, flex: 1}}>
                <label style={labelStyles} htmlFor="dueDate">Due Date*</label>
                <input
                  style={inputStyles}
                  type="date"
                  id="dueDate"
                  value={jobForm.dueDate}
                  onChange={(e) => setJobForm({...jobForm, dueDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
                  required
                />
              </div>
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles} htmlFor="location">Location*</label>
              <input
                style={inputStyles}
                type="text"
                id="location"
                placeholder="Location"
                value={jobForm.location}
                onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                required
              />
            </div>

            <div style={formGroupStyles}>
              <label style={labelStyles} htmlFor="serviceType">Service Type*</label>
              <select
                id="serviceType"
                style={inputStyles}
                value={jobForm.serviceType}
                onChange={(e) => setJobForm({...jobForm, serviceType: e.target.value})}
                required
              >
                <option value="">-- Select a Service Type --</option>
                {availableServiceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" style={buttonStyle}>Post Job</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostJob;
