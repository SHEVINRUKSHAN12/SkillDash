import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerNav from '../Nav/CustomerNav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dashboardBg from '../../assets/images/dashboard-bg.jpg';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Available service types - matching the ones in ServiceManagement and PostJob components
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

  useEffect(() => {
    // Set overflow-x to hidden to prevent horizontal scrolling
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
    document.body.style.overflowY = 'auto';   // Allow vertical scrolling
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.width = '100%';
    document.documentElement.style.overflowX = 'hidden'; // Add this to prevent horizontal scrolling

    // Cleanup function
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  const pageStyle = {
    backgroundImage: `url(${dashboardBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    position: 'relative',
    width: '100%',         // Changed from 100vw to 100% to prevent overflow
    margin: 0,
    padding: 0,
    overflowX: 'hidden',   // Prevent horizontal scrolling
    overflowY: 'auto'      // Allow vertical scrolling
  };

  const overlayStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: '100vh', // Keep minHeight
    paddingBottom: '100px', // Increase bottom padding
    position: 'relative',
    zIndex: 1
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '80px',
    paddingBottom: '80px',
    width: '100%',
    boxSizing: 'border-box' // Add this to include padding in width calculation
  };

  // Enhanced welcome section styles
  const enhancedWelcomeStyle = {
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 255, 0.97) 100%)',
    padding: '36px',
    marginBottom: '36px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    border: '1px solid rgba(220, 225, 235, 0.7)'
  };

  const enhancedWelcomeHeadingStyle = {
    color: '#1a365d',
    marginBottom: '16px',
    fontSize: '2.7em',
    fontWeight: '700',
    textShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Poppins', sans-serif"
  };

  const enhancedWelcomeTextStyle = {
    color: '#4a5568',
    fontSize: '1.1em',
    lineHeight: '1.7',
    maxWidth: '750px',
    margin: '0 auto',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Enhanced section title style
  const enhancedSectionTitleStyle = {
    color: '#1a365d',
    marginBottom: '30px',
    padding: '20px 0',
    borderBottom: '2px solid #e2e8f0',
    fontSize: '2em',
    fontWeight: '700',
    textAlign: 'center',
    position: 'relative',
    fontFamily: "'Poppins', sans-serif"
  };

  // Enhanced grid container
  const enhancedGridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '35px', // Increase gap between cards
    marginTop: '32px',
    width: '100%',
    padding: '10px 0',
    boxSizing: 'border-box',
    alignItems: 'start', // Change from 'stretch' to 'start' to prevent stretching
    gridAutoRows: 'minmax(min-content, max-content)', // Ensure rows expand properly
  };

  // Enhanced job card style
  const enhancedCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'auto', // Change from 100% to auto to prevent stretching
    minHeight: '400px', // Add minimum height for consistency
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.04)',
    border: '1px solid rgba(240, 242, 245, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
    overflow: 'hidden',
    position: 'relative',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    marginBottom: '0', // Remove bottom margin as grid gap handles spacing
  };

  // Update the job card style for edit mode to prevent overlap
  const jobCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    border: '1px solid rgba(0,0,0,0.1)',
    width: '100%',
    height: 'auto',
    minHeight: '500px', // Match the enhanced card minimum height
    position: 'relative',
    zIndex: 5, // Higher z-index so it appears above other cards
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: '0' // Remove bottom margin as grid handles spacing
  };

  // Add a background overlay for edit mode to prevent visual clashing
  const editOverlayContainerStyle = {
    position: 'relative',
    height: '100%',
    width: '100%',
    gridColumn: '1 / -1', // Make the edit form span full width in the grid
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '20px',
    boxSizing: 'border-box'
  };

  // Basic form input style
  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '15px',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Add a label style for the edit form
  const editFormLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '14px',
    fontFamily: "'Open Sans', sans-serif"
  };

  // Card body style
  const cardBodyStyle = {
    flex: 1,
    overflow: 'hidden'
  };

  // Modal styles
  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    maxWidth: '450px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    animation: 'modalFadeIn 0.3s ease-out'
  };

  // Basic button style (will be enhanced by the more specific styles)
  const buttonStyle = {
    padding: '10px 16px',
    margin: '0 5px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  // Create hover effect with JavaScript since inline CSS doesn't support pseudo-classes
  const handleCardMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-8px)';
    e.currentTarget.style.boxShadow = '0 20px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)';
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateZ(0)';
    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04), 0 0 1px rgba(0,0,0,0.04)';
  };

  // Enhanced status badge
  const getEnhancedStatusBadgeStyle = (status) => {
    const baseStyle = {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '8px 16px',
      borderRadius: '30px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.07)',
      fontFamily: "'Open Sans', sans-serif"
    };

    switch(status) {
      case 'open':
        return { ...baseStyle, backgroundColor: '#ebf8ff', color: '#2b6cb0', border: '1px solid #bee3f8' };
      case 'assigned':
        return { ...baseStyle, backgroundColor: '#fffaf0', color: '#c05621', border: '1px solid #feebc8' };
      case 'completed':
        return { ...baseStyle, backgroundColor: '#f0fff4', color: '#2f855a', border: '1px solid #c6f6d5' };
      case 'cancelled':
        return { ...baseStyle, backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7' };
      default:
        return { ...baseStyle, backgroundColor: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0' };
    }
  };

  // Enhanced card content styles
  const enhancedCardTitleStyle = {
    color: '#2d3748',
    fontSize: '22px',
    fontWeight: '700',
    marginTop: '0',
    marginBottom: '20px',
    lineHeight: '1.3',
    fontFamily: "'Poppins', sans-serif"
  };

  const enhancedCardSectionStyle = {
    marginBottom: '24px'
  };

  const enhancedCardContentItemStyle = {
    margin: '12px 0',
    fontSize: '15px',
    color: '#4a5568',
    lineHeight: '1.6',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Open Sans', sans-serif"
  };

  const enhancedLabelStyle = {
    fontWeight: '600',
    color: '#718096',
    marginBottom: '4px',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const enhancedValueStyle = {
    color: '#2d3748'
  };

  const enhancedPriceStyle = {
    color: '#2f855a',
    fontWeight: '700',
    fontSize: '18px'
  };

  // Enhanced service tag style
  const enhancedServiceTagStyle = {
    backgroundColor: '#f0fff4',
    color: '#2f855a',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    marginRight: '5px',
    marginBottom: '5px',
    display: 'inline-block',
    border: '1px solid #c6f6d5',
    fontWeight: '500'
  };

  // Enhanced card footer
  const enhancedCardFooterStyle = {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #edf2f7',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px'
  };

  // Enhanced button styles
  const enhancedActionButtonStyle = {
    padding: '10px 18px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: '8px',
    border: '0',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Open Sans', sans-serif",
    width: '100%'
  };

  const enhancedEditButtonStyle = {
    backgroundColor: '#3182ce',
    color: 'white',
    boxShadow: '0 2px 4px rgba(49, 130, 206, 0.3)'
  };

  const enhancedDeleteButtonStyle = {
    backgroundColor: '#fff',
    color: '#e53e3e',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #fed7d7'
  };

  const refreshCustomerData = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem('customerData'));
      if (!storedData || !storedData._id) return;

      const response = await axios.get(`http://localhost:5000/api/customers/profile/${storedData._id}`);
      if (response.data.success) {
        const updatedData = response.data.customer;
        localStorage.setItem('customerData', JSON.stringify(updatedData));
        setCustomerData(updatedData);
      }
    } catch (error) {
      console.error('Error refreshing customer data:', error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const freshData = localStorage.getItem('customerData');
      if (freshData) {
        setCustomerData(JSON.parse(freshData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customerDataChanged', handleStorageChange);

    refreshCustomerData();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customerDataChanged', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('customerData');
    if (!storedData) {
      navigate('/customer-login');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      const customerId = parsedData._id || parsedData.id;
      
      if (!customerId) {
        console.error('No customer ID found in stored data:', parsedData);
        navigate('/customer-login');
        return;
      }
      
      setCustomerData({
        ...parsedData,
        _id: customerId
      });
      
      fetchJobs(customerId);
    } catch (error) {
      console.error('Error parsing customer data:', error);
      navigate('/customer-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!customerData) {
      refreshCustomerData();
    }
  }, [customerData]);

  const fetchJobs = async (customerId) => {
    try {
      console.log('Fetching jobs for customer ID:', customerId);
      const response = await axios.get(`http://localhost:5000/api/jobs/customer/${customerId}`);
      
      if (response.data.success) {
        setJobs(response.data.jobs || []);
      } else {
        setJobs([]);
        toast.error(response.data.message || 'Failed to fetch jobs');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      toast.error('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editJob._id}`, {
        ...editJob,
        serviceTypes: editJob.serviceTypes || [editJob.serviceType]
      });
      
      // Enhanced success notification
      toast.success('Job updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: 'linear-gradient(to right, #43c6ac, #3c9fa8)',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      });
      
      setIsEditing(false);
      const customerData = JSON.parse(localStorage.getItem('customerData'));
      fetchJobs(customerData._id || customerData.id);
    } catch (error) {
      toast.error('Failed to update job', {
        position: "top-center",
        autoClose: 4000,
        style: {
          background: '#ffecec',
          color: '#e74c3c',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      });
    }
  };

  const confirmDelete = (jobId) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${selectedJobId}`);
      
      toast.success('Job deleted successfully', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        style: {
          background: 'linear-gradient(to right, #43c6ac, #3c9fa8)',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      });
      
      setShowDeleteModal(false);
      const customerData = JSON.parse(localStorage.getItem('customerData'));
      fetchJobs(customerData._id || customerData.id);
    } catch (error) {
      toast.error('Failed to delete job', {
        position: "top-center",
        autoClose: 4000
      });
    }
  };

  // Format date function  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!customerData) {
    console.log('No customer data available');
    return <div style={{ 
      textAlign: 'center', 
      marginTop: '50px',
      fontSize: '20px'
    }}>Loading...</div>;
  }

  return (
    <div style={pageStyle}>
      <CustomerNav />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div style={overlayStyle}>
        <div style={containerStyle}>
          {customerData && (
            <div style={enhancedWelcomeStyle}>
              <h1 style={enhancedWelcomeHeadingStyle}>
                Welcome back, {customerData.fullName || customerData.name || 'Valued Customer'}!
              </h1>
              <p style={enhancedWelcomeTextStyle}>
                Manage your job postings and track their progress all in one place. 
                Your dashboard shows all your current and past job listings.
              </p>
            </div>
          )}
          
          <h2 style={enhancedSectionTitleStyle}>My Posted Jobs</h2>

          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>
          ) : !Array.isArray(jobs) ? (
            <div style={{textAlign: 'center', padding: '20px', color: '#e74c3c'}}>Error loading jobs</div>
          ) : jobs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              marginTop: '20px'
            }}>
              <p style={{fontSize: '1.2em', color: '#7f8c8d'}}>No jobs posted yet.</p>
              <button 
                onClick={() => navigate('/post-job')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  marginTop: '15px',
                  cursor: 'pointer'
                }}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div style={enhancedGridContainerStyle}>
              {jobs.map((job) => (
                <div 
                  key={job._id} 
                  style={isEditing && editJob?._id === job._id ? editOverlayContainerStyle : { width: '100%' }}
                >
                  <div
                    style={isEditing && editJob?._id === job._id ? jobCardStyle : enhancedCardStyle}
                    onMouseEnter={!isEditing ? handleCardMouseEnter : undefined}
                    onMouseLeave={!isEditing ? handleCardMouseLeave : undefined}
                  >
                    {isEditing && editJob?._id === job._id ? (
                      <div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={editFormLabelStyle} htmlFor="title">Job Title</label>
                          <input
                            id="title"
                            type="text"
                            placeholder="Job Title"
                            value={editJob.title}
                            onChange={(e) => setEditJob({...editJob, title: e.target.value})}
                            style={inputStyle}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={editFormLabelStyle} htmlFor="description">Description</label>
                          <textarea
                            id="description"
                            placeholder="Job Description"
                            value={editJob.description}
                            onChange={(e) => setEditJob({...editJob, description: e.target.value})}
                            style={{...inputStyle, minHeight: '100px'}}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={editFormLabelStyle} htmlFor="location">Location</label>
                          <input
                            id="location"
                            type="text"
                            placeholder="Location"
                            value={editJob.location}
                            onChange={(e) => setEditJob({...editJob, location: e.target.value})}
                            style={inputStyle}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={editFormLabelStyle} htmlFor="budget">Budget (Rs.)</label>
                          <input
                            id="budget"
                            type="number"
                            placeholder="Budget"
                            value={editJob.budget}
                            onChange={(e) => setEditJob({...editJob, budget: e.target.value})}
                            style={inputStyle}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={editFormLabelStyle} htmlFor="serviceType">Service Type</label>
                          <select
                            id="serviceType"
                            value={editJob.serviceType || (editJob.serviceTypes && editJob.serviceTypes[0]) || ''}
                            onChange={(e) => setEditJob({
                              ...editJob, 
                              serviceTypes: [e.target.value]
                            })}
                            style={inputStyle}
                          >
                            <option value="">Select Service Type</option>
                            {availableServiceTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                          <label style={editFormLabelStyle} htmlFor="dueDate">Due Date</label>
                          <input
                            id="dueDate"
                            type="date"
                            value={editJob.dueDate ? editJob.dueDate.split('T')[0] : ''}
                            min={getMinDate()}
                            onChange={(e) => {
                              setEditJob({...editJob, dueDate: e.target.value});
                            }}
                            style={inputStyle}
                          />
                        </div>
                        
                        <div>
                          <button
                            onClick={handleUpdate}
                            style={{...buttonStyle, backgroundColor: '#28a745', color: 'white'}}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            style={{...buttonStyle, backgroundColor: '#6c757d', color: 'white'}}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Status badge */}
                        <div style={getEnhancedStatusBadgeStyle(job.status || 'open')}>
                          {job.status || 'Open'}
                        </div>
                        
                        <div style={cardBodyStyle}>
                          <h3 style={enhancedCardTitleStyle}>{job.title}</h3>
                          <div style={enhancedCardSectionStyle}>
                            <div style={enhancedCardContentItemStyle}>
                              <span style={enhancedLabelStyle}>Description</span>
                              <span style={enhancedValueStyle}>
                                {job.description.length > 120 
                                  ? `${job.description.substring(0, 120)}...` 
                                  : job.description}
                              </span>
                            </div>
                            
                            <div style={enhancedCardContentItemStyle}>
                              <span style={enhancedLabelStyle}>Location</span>
                              <span style={enhancedValueStyle}>{job.location}</span>
                            </div>
                            
                            <div style={enhancedCardContentItemStyle}>
                              <span style={enhancedLabelStyle}>Budget</span>
                              <span style={enhancedPriceStyle}>Rs. {job.budget}</span>
                            </div>
                            
                            <div style={enhancedCardContentItemStyle}>
                              <span style={enhancedLabelStyle}>Service Type</span>
                              <div>
                                {job.serviceTypes && job.serviceTypes.length > 0 
                                  ? job.serviceTypes.map((type, i) => (
                                    <span key={i} style={enhancedServiceTagStyle}>{type}</span>
                                  ))
                                  : 'Not specified'}
                              </div>
                            </div>
                            
                            <div style={enhancedCardContentItemStyle}>
                              <span style={enhancedLabelStyle}>Due Date</span>
                              <span style={enhancedValueStyle}>{formatDate(job.dueDate)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div style={enhancedCardFooterStyle}>
                          <button
                            onClick={() => handleEdit(job)}
                            style={{...enhancedActionButtonStyle, ...enhancedEditButtonStyle}}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(job._id)}
                            style={{...enhancedActionButtonStyle, ...enhancedDeleteButtonStyle}}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3 style={{color: '#dc3545'}}>Delete Job</h3>
            <p>Are you sure you want to delete this job?</p>
            <p>This action cannot be undone.</p>
            <div>
              <button
                onClick={handleDelete}
                style={{...buttonStyle, backgroundColor: '#dc3545', color: 'white'}}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{...buttonStyle, backgroundColor: '#6c757d', color: 'white'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
