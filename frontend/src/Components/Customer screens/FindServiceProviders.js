import React, { useState, useEffect } from 'react';
import CustomerNav from '../Nav/CustomerNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatWindow from '../Chat/ChatWindow';
import { initializeChat, canInitiateChat } from '../../utils/chatUtils';

function FindServiceProviders() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [detailService, setDetailService] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatData, setChatData] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [serviceReviews, setServiceReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [serviceRatingsMap, setServiceRatingsMap] = useState({});

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
  
  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5000/api/services/public/all');
        if (!response.ok) {
          throw new Error(`Failed to fetch services (Status: ${response.status})`);
        }
        
        const data = await response.json();
        console.log('Services data fetched:', data);
        
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
          
          // Fetch ratings for all services
          const ratingsMap = {};
          await Promise.all(data.services.map(async (service) => {
            try {
              const ratingResponse = await fetch(`http://localhost:5000/api/reviews/${service._id}`);
              const ratingData = await ratingResponse.json();
              if (ratingData.success && Array.isArray(ratingData.reviews)) {
                const reviews = ratingData.reviews;
                if (reviews.length > 0) {
                  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
                  const avg = sum / reviews.length;
                  ratingsMap[service._id] = {
                    average: avg,
                    count: reviews.length
                  };
                }
              }
            } catch (err) {
              console.error(`Error fetching ratings for service ${service._id}:`, err);
            }
          }));
          
          setServiceRatingsMap(ratingsMap);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Filter services based on search and selected filters
  const filteredServices = services.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      service.title?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower) ||
      service.provider?.fullname?.toLowerCase().includes(searchLower) ||
      service.serviceArea?.toLowerCase().includes(searchLower) || 
      (service.price && searchLower.includes(service.price.toString()));
      
    const matchesServiceType = selectedServiceType === '' ||
      (Array.isArray(service.serviceTypes) && service.serviceTypes.includes(selectedServiceType));
      
    return matchesSearch && matchesServiceType;
  });

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
  };

  const handleContactProvider = (provider, service) => {
    // Check if customer is logged in
    if (!canInitiateChat('Customer')) {
      toast.error('Please login to contact service providers', {
        position: "top-center",
      });
      return;
    }

    if (!provider || !provider._id || !service || !service._id) {
      console.error("Invalid provider or service data for chat:", provider, service);
      toast.error("Cannot initiate chat. Invalid data.", { position: "top-center" });
      return;
    }

    // Use the shared utility to initialize the chat
    initializeChat(
      setChatData, 
      setShowChat,
      provider._id,
      provider.fullname || 'Service Provider',
      'Customer',
      service._id
    );
  };

  const fetchServiceReviews = async (serviceId) => {
    setReviewsLoading(true);
    setReviewsLoading(true);
    try {
      console.log("Fetching reviews for serviceId:", serviceId);
      const res = await fetch(`http://localhost:5000/api/reviews/${serviceId}`);
      const data = await res.json();
      console.log("Reviews API response:", data); // Add this log
      
      if (data.success) {
        setServiceReviews(data.reviews);
        console.log("Reviews loaded:", data.reviews.length, "reviews");
      } else {
        console.error("Failed to load reviews:", data.message);
        setServiceReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setServiceReviews([]);
    }
    setReviewsLoading(false);
  };

  const handleViewDetails = (service) => {
    setDetailService(service);
    fetchServiceReviews(service._id);
  };

  const handleRateService = () => {
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    const customerToken = localStorage.getItem('customerToken');
    if (!customerToken) {
      toast.error('Please login to submit ratings', { position: "top-center" });
      return;
    }

    if (ratingValue === 0) {
      toast.error('Please select a star rating', { position: "top-center" });
      return;
    }

    setSubmittingRating(true);

    try {
      const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
      console.log("Customer data for review:", customerData); // Debug log
      
      // Use id instead of _id based on your customer data structure
      const customerId = customerData.id || customerData._id;
      
      // Log the actual data being sent
      const reviewData = {
        serviceId: detailService._id,
        providerId: detailService.provider._id,
        customerId: customerId,
        rating: ratingValue,
        feedback: feedbackText
      };
      
      console.log("Sending review data:", reviewData);
      
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`
        },
        body: JSON.stringify(reviewData)
      });

      // Log the response for debugging
      console.log("Response status:", response.status);
      
      // Get the error details when it's a 400 error
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error(errorData.message || 'Failed to submit rating. Please try again.');
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success('Thank you for your feedback!', { position: "top-center" });
        setRatingSubmitted(true);
        fetchServiceReviews(detailService._id); // Refresh reviews
        setTimeout(() => {
          setShowRatingModal(false);
        }, 1500);
      } else {
        throw new Error(responseData.message || 'Failed to submit rating. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit rating. Please try again.', {
        position: "top-center"
      });
    } finally {
      setSubmittingRating(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const createdAt = timestamp ? new Date(timestamp) : new Date(Date.now() - 60000);
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);
    
    if (diffInSeconds < 5) {
      return 'Just now';
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return createdAt.toLocaleDateString(undefined, options);
    }
  };

  const getAverageRating = () => {
    if (!serviceReviews.length) return null;
    const sum = serviceReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / serviceReviews.length).toFixed(1);
  };

  const renderServiceRating = (serviceId) => {
    const rating = serviceRatingsMap[serviceId];
    
    if (!rating) {
      return (
        <div style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>
          No ratings yet
        </div>
      );
    }
    
    const stars = Math.round(rating.average);
    
    return (
      <div style={{ marginTop: '5px' }}>
        <div style={{ color: '#FFD700', fontSize: '1.2rem', display: 'inline-block', marginRight: '6px' }}>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
        <span style={{ color: '#666', fontSize: '0.85rem' }}>
          ({rating.count})
        </span>
      </div>
    );
  };

  const RatingModal = ({ 
    showRatingModal, 
    setShowRatingModal, 
    feedbackText, 
    setFeedbackText, 
    ratingValue, 
    setRatingValue, 
    hoverRating, 
    setHoverRating,
    submittingRating,
    ratingSubmitted,
    handleRatingSubmit
  }) => {
    // Move hooks outside of conditional render
    const textareaRef = React.useRef(null);
    
    // Initialize textarea with current value
    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.value = feedbackText;
      }
    }, []); // Remove showRatingModal dependency

    if (!showRatingModal) return null;

    // Update feedback text from textarea
    const updateFeedbackText = () => {
      if (textareaRef.current) {
        setFeedbackText(textareaRef.current.value);
      }
    };

    const renderStars = () => {
      return [1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRatingValue(star)}
          style={{
            cursor: 'pointer',
            fontSize: '2.5rem',
            color: (hoverRating || ratingValue) >= star ? '#FFD700' : '#e4e5e9',
            marginRight: '5px',
            transition: 'color 0.2s ease'
          }}
        >★</span>
      ));
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1200
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          width: '500px',
          maxWidth: '90%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          <button 
            onClick={() => setShowRatingModal(false)} 
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#aaa'
            }}
          >×</button>
          
          <h3 style={{
            color: '#2c3e50',
            marginTop: 0,
            marginBottom: '25px',
            textAlign: 'center',
            fontSize: '1.5rem'
          }}>Rate this Service</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            {renderStars()}
            <p style={{ marginTop: '10px', color: '#666' }}>
              {ratingValue === 1 && "Poor"}
              {ratingValue === 2 && "Fair"}
              {ratingValue === 3 && "Good"}
              {ratingValue === 4 && "Very Good"}
              {ratingValue === 5 && "Excellent"}
            </p>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontSize: '0.95rem'
            }}>
              Share your experience (optional):
            </label>
            <textarea
              ref={textareaRef}
              placeholder="Write your feedback here..."
              defaultValue={feedbackText}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '120px',
                fontSize: '1rem'
              }}
              disabled={submittingRating || ratingSubmitted}
              onBlur={updateFeedbackText}
            />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                if (textareaRef.current) {
                  setFeedbackText(textareaRef.current.value);
                }
                handleRatingSubmit();
              }}
              disabled={submittingRating || ratingSubmitted || ratingValue === 0}
              style={{
                backgroundColor: '#0177cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 25px',
                fontSize: '1.1rem',
                fontWeight: '500',
                cursor: submittingRating || ratingSubmitted || ratingValue === 0 ? 'not-allowed' : 'pointer',
                opacity: submittingRating || ratingSubmitted || ratingValue === 0 ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {submittingRating ? 'Submitting...' : ratingSubmitted ? 'Submitted!' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ServiceDetailModal = () => {
    if (!detailService) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            backgroundColor: '#f2f7ff',
            padding: '20px 30px',
            borderBottom: '1px solid #dde6f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 2,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            <h2 style={{ 
              margin: 0, 
              color: '#1a3a6b', 
              fontSize: '1.8rem', 
              fontWeight: 600
            }}>{detailService.title}</h2>
            <button onClick={() => setDetailService(null)} style={{
              background: 'transparent',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#444',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              padding: 0,
              lineHeight: 1
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#eaeef5'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>×</button>
          </div>
          
          <div style={{ padding: '30px 35px' }}>
            <div style={{ 
              marginBottom: '30px',
              borderBottom: '1px solid #eaeff8', 
              paddingBottom: '25px'
            }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                color: '#1a3a6b', 
                fontSize: '1.4rem', 
                fontWeight: 600
              }}>About this service</h3>
              <p style={{ 
                fontSize: '1.15rem',
                lineHeight: '1.6', 
                color: '#444', 
                marginBottom: '10px'
              }}>
                {detailService.description}
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8fafe', 
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '35px',
              border: '1px solid #eaeff8'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: '#1a3a6b', 
                fontSize: '1.4rem', 
                fontWeight: 600,
                borderBottom: '2px solid #dde6f6',
                paddingBottom: '10px'
              }}>Service Details</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '25px'
              }}>
                <div>
                  <p style={{ 
                    color: '#667799', 
                    fontSize: '1.05rem',
                    margin: '0 0 8px 0', 
                    fontWeight: 500
                  }}>Price</p>
                  <p style={{ 
                    color: '#1a3a6b', 
                    fontSize: '1.4rem',
                    fontWeight: 600, 
                    margin: 0
                  }}>Rs. {detailService.price}</p>
                </div>
                <div>
                  <p style={{ 
                    color: '#667799', 
                    fontSize: '1.05rem',
                    margin: '0 0 8px 0',
                    fontWeight: 500 
                  }}>Duration</p>
                  <p style={{ 
                    color: '#1a3a6b', 
                    fontSize: '1.4rem',
                    fontWeight: 600, 
                    margin: 0
                  }}>{detailService.duration}</p>
                </div>
                <div>
                  <p style={{ 
                    color: '#667799', 
                    fontSize: '1.05rem',
                    margin: '0 0 8px 0',
                    fontWeight: 500 
                  }}>Service Area</p>
                  <p style={{ 
                    color: '#1a3a6b', 
                    fontSize: '1.4rem',
                    fontWeight: 600, 
                    margin: 0
                  }}>{detailService.serviceArea}</p>
                </div>
                <div>
                  <p style={{ 
                    color: '#667799', 
                    fontSize: '1.05rem',
                    margin: '0 0 8px 0',
                    fontWeight: 500 
                  }}>Posted</p>
                  <p style={{ 
                    color: '#1a3a6b', 
                    fontSize: '1.4rem',
                    fontWeight: 600, 
                    margin: 0
                  }}>{getTimeAgo(detailService.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {detailService.serviceTypes && detailService.serviceTypes.length > 0 && (
              <div style={{ 
                marginBottom: '35px',
                borderBottom: '1px solid #eaeff8',
                paddingBottom: '25px'
              }}>
                <h3 style={{ 
                  margin: '0 0 18px 0', 
                  color: '#1a3a6b',
                  fontSize: '1.4rem',
                  fontWeight: 600
                }}>Service Categories</h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  {detailService.serviceTypes.map((type, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#e6f0ff',
                      color: '#0055cc',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      fontSize: '1.05rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,85,204,0.1)',
                      border: '1px solid #cce0ff'
                    }}>{type}</span>
                  ))}
                </div>
              </div>
            )}
            
            {detailService.provider && (
              <div style={{
                backgroundColor: '#f8fafe',
                padding: '25px',
                borderRadius: '12px',
                marginBottom: '35px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                border: '1px solid #eaeff8'
              }}>
                {detailService.provider.profilePicture ? (
                  <img
                    src={`http://localhost:5000${detailService.provider.profilePicture}`}
                    alt={detailService.provider.fullname}
                    style={{ 
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=SP";
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#6c757d',
                    border: '3px solid white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.12)'
                  }}>
                    {detailService.provider.fullname?.charAt(0).toUpperCase() || 'SP'}
                  </div>
                )}
                <div>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    fontSize: '1.4rem',
                    color: '#1a3a6b',
                    fontWeight: 600
                  }}>Service Provider</h3>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    color: '#333'
                  }}>
                    {detailService.provider.fullname}
                  </p>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '1.1rem',
                    color: '#555'
                  }}>
                    {detailService.provider.phonenumber}
                  </p>
                </div>
              </div>
            )}
            
            <div style={{ 
              marginBottom: '35px',
              borderBottom: '1px solid #eaeff8',
              paddingBottom: '25px'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: '#1a3a6b', 
                fontSize: '1.4rem', 
                fontWeight: 600
              }}>Ratings & Reviews</h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#f8fafe',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #eaeff8'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: '#1a3a6b',
                    marginRight: '20px'
                  }}>
                    {getAverageRating() || 'N/A'}
                  </div>
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      color: '#FFD700',
                      fontSize: '1.8rem',
                      marginBottom: '5px'
                    }}>
                      {(() => {
                        const avg = Math.round(getAverageRating() || 0);
                        return '★'.repeat(avg) + '☆'.repeat(5 - avg);
                      })()}
                    </div>
                    <div style={{ color: '#667799', fontSize: '1rem' }}>
                      {serviceReviews.length} review{serviceReviews.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleRateService}
                  style={{
                    backgroundColor: '#0177cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 25px',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 8px rgba(1,119,204,0.15)'
                  }}
                  onMouseOver={(e) => { 
                    e.target.style.backgroundColor = '#0165ac'; 
                    e.target.style.boxShadow = '0 6px 10px rgba(1,119,204,0.25)';
                  }}
                  onMouseOut={(e) => { 
                    e.target.style.backgroundColor = '#0177cc'; 
                    e.target.style.boxShadow = '0 4px 8px rgba(1,119,204,0.15)';
                  }}
                >
                  Rate this Service
                </button>
              </div>
              
              <div style={{ marginTop: '25px' }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#1a3a6b', 
                  fontSize: '1.2rem'
                }}>Customer Reviews</h4>
                {reviewsLoading ? (
                  <div>Loading reviews...</div>
                ) : serviceReviews.length === 0 ? (
                  <div style={{ color: '#888', fontStyle: 'italic' }}>No reviews yet.</div>
                ) : (
                  serviceReviews.map((review) => (
                    <div key={review._id} style={{
                      padding: '15px',
                      borderBottom: '1px solid #eee',
                      marginBottom: '15px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>
                          {/* Display "Customer" + last 4 chars of ID for better identification */}
                          Customer {review.customerId?.toString?.().slice(-4) || ''}
                        </div>
                        <div style={{ color: '#777', fontSize: '0.9rem' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ 
                        color: '#FFD700',
                        marginBottom: '10px'
                      }}>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                      <p style={{ 
                        margin: 0, 
                        lineHeight: 1.5,
                        color: '#444'
                      }}>
                        {review.feedback}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <button 
              style={{
                width: '100%',
                backgroundColor: '#0177cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 10px rgba(1,119,204,0.25)',
                marginTop: '10px'
              }}
              onMouseOver={(e) => { 
                e.target.style.backgroundColor = '#0165ac'; 
                e.target.style.boxShadow = '0 6px 12px rgba(1,119,204,0.35)';
              }}
              onMouseOut={(e) => { 
                e.target.style.backgroundColor = '#0177cc'; 
                e.target.style.boxShadow = '0 4px 10px rgba(1,119,204,0.25)';
              }}
              onClick={() => handleContactProvider(detailService.provider, detailService)}
            >
              Contact Service Provider
            </button>
          </div>
        </div>
      </div>
    );
  };

  const styles = {
    page: {
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 80px)',
      paddingTop: '80px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '10px',
      fontWeight: '600'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      maxWidth: '800px',
      margin: '0 auto 30px'
    },
    filters: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px'
    },
    input: {
      flex: '1 1 300px',
      padding: '12px 15px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    select: {
      flex: '1 1 200px',
      padding: '12px 15px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    serviceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginTop: '20px'
    },
    serviceCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    providerInfoBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      backgroundColor: '#f9f9f9'
    },
    smallProfilePic: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginRight: '10px',
      border: '2px solid white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    smallProfilePlaceholder: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#e9ecef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6c757d',
      fontSize: '16px',
      fontWeight: 'bold',
      marginRight: '10px',
      border: '2px solid white'
    },
    providerName: {
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#555'
    },
    serviceContent: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    serviceTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#333',
      marginBottom: '12px',
      lineHeight: '1.3'
    },
    serviceDescription: {
      fontSize: '0.95rem',
      color: '#666',
      marginBottom: '16px',
      lineHeight: '1.5'
    },
    serviceMetaContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '16px'
    },
    serviceMetaItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      color: '#555'
    },
    metaIcon: {
      marginRight: '5px',
      fontSize: '1rem'
    },
    metaValue: {
      fontWeight: '500'
    },
    tagsRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px'
    },
    serviceTag: {
      backgroundColor: '#ebf5ff',
      color: '#0069c2',
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    actionButtonsRow: {
      display: 'flex',
      gap: '10px',
      marginTop: 'auto'
    },
    contactButton: {
      flex: '1',
      padding: '10px',
      backgroundColor: '#0177cc',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    detailsButton: {
      flex: '1',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      fontWeight: '500',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    clearButton: {
      padding: '12px 15px',
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      border: '1px solid #dee2e6',
      borderRadius: '5px',
      fontWeight: '500',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    noResults: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      textAlign: 'center'
    },
    loading: {
      textAlign: 'center',
      padding: '40px 20px',
      fontSize: '1.2rem',
      color: '#666'
    },
    error: {
      textAlign: 'center',
      padding: '30px',
      color: '#dc3545',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '30px'
    }
  };

  return (
    <>
      <CustomerNav />
      <ToastContainer position="top-center" />
      
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>Find Services</h1>
            <p style={styles.subtitle}>
              Browse through our marketplace of professional services and find exactly what you need.
            </p>
          </div>
          
          <div style={styles.filters}>
            <input 
              type="text" 
              placeholder="Search for services, providers, locations or price" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
            
            <select 
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              style={styles.select}
            >
              <option value="">All Service Types</option>
              {availableServiceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedServiceType('');
              }}
              style={styles.clearButton}
            >
              Clear Filters
            </button>
          </div>
          
          {loading ? (
            <div style={styles.loading}>Looking for services...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : filteredServices.length === 0 ? (
            <div style={styles.noResults}>
              No services found matching your criteria.
            </div>
          ) : (
            <div style={styles.serviceGrid}>
              {filteredServices.map((service, index) => (
                <div
                  key={`${service._id || index}`}
                  style={{
                    ...styles.serviceCard,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleViewDetails(service)}
                >
                  {/* Provider info section */}
                  {service.provider && (
                    <div style={styles.providerInfoBar} onClick={(e) => e.stopPropagation()}>
                      {service.provider.profilePicture ? (
                        <img
                          src={`http://localhost:5000${service.provider.profilePicture}`}
                          alt={service.provider.fullname || 'Provider'}
                          style={styles.smallProfilePic}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40?text=SP";
                          }}
                        />
                      ) : (
                        <div style={styles.smallProfilePlaceholder}>
                          {service.provider.fullname ? service.provider.fullname.charAt(0).toUpperCase() : 'SP'}
                        </div>
                      )}
                      <span style={styles.providerName}>
                        {service.provider.fullname || 'Service Provider'}
                      </span>
                    </div>
                  )}

                  {/* Service details section */}
                  <div style={styles.serviceContent}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={styles.serviceTitle}>{service.title}</h3>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#777', 
                        fontStyle: 'italic'
                      }}>
                        {getTimeAgo(service.createdAt)}
                      </span>
                    </div>
                    <p style={styles.serviceDescription}>
                      {service.description?.length > 150
                        ? `${service.description.substring(0, 150)}...`
                        : service.description}
                    </p>
                    
                    {/* Add rating stars here */}
                    {renderServiceRating(service._id)}
                    
                    <div style={styles.serviceMetaContainer}>
                      <div style={styles.serviceMetaItem}>
                        <span style={styles.metaIcon}>💰</span>
                        <span style={styles.metaValue}>Rs. {service.price}</span>
                      </div>
                      
                      <div style={styles.serviceMetaItem}>
                        <span style={styles.metaIcon}>⏱️</span>
                        <span style={styles.metaValue}>{service.duration}</span>
                      </div>
                      
                      <div style={styles.serviceMetaItem}>
                        <span style={styles.metaIcon}>📍</span>
                        <span style={styles.metaValue}>{service.serviceArea}</span>
                      </div>
                    </div>
                    
                    {Array.isArray(service.serviceTypes) && service.serviceTypes.length > 0 && (
                      <div style={styles.tagsRow}>
                        {service.serviceTypes.map((type, typeIndex) => (
                          <span key={typeIndex} style={styles.serviceTag}>{type}</span>
                        ))}
                      </div>
                    )}
                    
                    <div style={styles.actionButtonsRow} onClick={(e) => e.stopPropagation()}>
                      {service.provider && (
                        <button 
                          style={styles.contactButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactProvider(service.provider, service);
                          }}
                        >
                          Contact Provider
                        </button>
                      )}
                      <button 
                        style={styles.detailsButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(service);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {detailService && <ServiceDetailModal />}
      </div>

      {showChat && chatData && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          right: '20px',
          width: '350px',
          height: '500px',
          zIndex: 1050
        }}>
          <ChatWindow
            userType="Customer"
            receiverId={chatData.receiverId}
            receiverType={chatData.receiverType}
            serviceId={chatData.serviceId}
            receiverName={chatData.providerName}
            onClose={() => {
                setShowChat(false);
                setChatData(null);
            }}
          />
        </div>
      )}

      <RatingModal 
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
        submittingRating={submittingRating}
        ratingSubmitted={ratingSubmitted}
        handleRatingSubmit={handleRatingSubmit}
      />
    </>
  );
}

export default FindServiceProviders;
