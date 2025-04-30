import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceProviderNav from '../Nav/ServiceProviderNav';
import ChatWindow from '../Chat/ChatWindow'; // Import ChatWindow component
import { initializeChat, chatFetch } from '../../utils/chatUtils'; // Import the shared utility
import { toast } from 'react-toastify'; // Import toast

function ServiceProviderDashboard() {
    const [providerData, setProviderData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usedMockData, setUsedMockData] = useState(false);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [apiFailureCount, setApiFailureCount] = useState(0);
    const [apiCallsDisabled, setApiCallsDisabled] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatData, setChatData] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null); // State to hold the job being viewed in detail
    const [showJobDetailModal, setShowJobDetailModal] = useState(false); // State to control modal visibility
    const [reviewCount, setReviewCount] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const navigate = useNavigate();

    const lastApiCallTime = useRef(0);
    const apiCallThrottleMs = 2000; // Reduce from 10000 to 2000 (2 seconds)
    const isMounted = useRef(true);

    const dashboardContainerStyle = {
        display: 'flex',
        flexDirection: 'row',
        padding: '20px',
        marginTop: '64px',
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)',
        gap: '20px',
    };

    const mainContentStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minWidth: 0,
    };

    const chatContainerStyle = {
        width: '350px',
        flexShrink: 0,
        position: 'sticky',
        top: '84px',
        height: 'calc(100vh - 104px)',
        display: showChat ? 'flex' : 'none',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 50,
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,
        overflowY: 'auto',
        padding: '40px 20px',
    };

    const modalContentStyle = {
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '12px',
        maxWidth: '700px',
        width: '90%',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxHeight: '90vh',
        overflowY: 'auto',
    };

    const modalCloseButtonStyle = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#aaa',
        cursor: 'pointer',
        lineHeight: '1',
    };

    const welcomeStyles = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center'
    };

    const welcomeHeaderStyles = {
        fontSize: '2.2rem',
        color: '#2c3e50',
        marginBottom: '15px',
        fontWeight: 'bold'
    };

    const welcomeSubheaderStyles = {
        fontSize: '1.3rem',
        color: '#34495e',
        marginBottom: '20px'
    };

    const welcomeDescriptionStyles = {
        fontSize: '1.1rem',
        color: '#7f8c8d',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.6'
    };

    const statsSectionStyles = {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '25px',
        flexWrap: 'wrap'
    };

    const statCardStyles = {
        backgroundColor: '#f8f9fa',
        padding: '15px 25px',
        borderRadius: '8px',
        minWidth: '150px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    };

    const statNumberStyles = {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#007BFF'
    };

    const statLabelStyles = {
        fontSize: '0.9rem',
        color: '#6c757d'
    };

    const sectionHeaderStyles = {
        color: '#2c3e50',
        margin: '30px 0 15px',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px'
    };

    const servicesSectionStyles = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    };

    const jobsSectionStyle = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    };

    const jobsContainerStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px 0'
    };

    const jobCardStyles = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        borderLeft: '4px solid #4CAF50',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
    };

    const jobCardHoverStyle = {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    };

    const jobTitleStyles = {
        color: '#2c3e50',
        fontSize: '1.2rem',
        marginBottom: '10px',
        fontWeight: 'bold'
    };

    const jobDetailStyles = {
        color: '#666',
        fontSize: '0.9rem',
        marginBottom: '8px'
    };

    const tagStyles = {
        backgroundColor: '#e1f5fe',
        color: '#0288d1',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        display: 'inline-block',
        marginRight: '8px',
        marginBottom: '5px'
    };

    const matchingServiceStyle = {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        display: 'inline-block',
        marginRight: '8px',
        marginBottom: '5px',
        border: '1px solid #c8e6c9'
    };

    const contactButtonStyle = {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    };

    const getProviderServiceTypes = useCallback(() => {
        const extractTypes = () => {
            const types = [];
            
            if (services && services.length > 0) {
                services.forEach(service => {
                    if (service.serviceTypes && Array.isArray(service.serviceTypes)) {
                        service.serviceTypes.forEach(type => {
                            if (type && type.trim() !== '' && !types.includes(type)) {
                                types.push(type);
                            }
                        });
                    } else if (service.serviceType && !types.includes(service.serviceType)) {
                        types.push(service.serviceType);
                    }
                });
            }
            
            if (types.length === 0 && providerData) {
                if (providerData.serviceType && providerData.serviceType.trim() !== '') {
                    types.push(providerData.serviceType);
                }

                if (providerData.serviceTypes && Array.isArray(providerData.serviceTypes)) {
                    providerData.serviceTypes.forEach(type => {
                        if (type && type.trim() !== '' && !types.includes(type)) {
                            types.push(type);
                        }
                    });
                }
            }
            
            return [...new Set(types)].filter(type => type && type.trim() !== '');
        };
        
        return extractTypes();
    }, [services, providerData]);
    
    useEffect(() => {
        if ((services && services.length > 0) || providerData) {
            const types = getProviderServiceTypes();
            if (JSON.stringify(types) !== JSON.stringify(serviceTypes)) {
                setServiceTypes(types);
            }
        }
    }, [services, providerData, getProviderServiceTypes, serviceTypes]);

    const filterJobsByProviderServices = useCallback((jobsToFilter, providerServices) => {
        if (!jobsToFilter || !jobsToFilter.length) return [];
        if (!providerServices || !providerServices.length) return [];

        return jobsToFilter.filter(job => {
            if (job.serviceTypes && Array.isArray(job.serviceTypes)) {
                return job.serviceTypes.some(jobType => 
                    providerServices.includes(jobType)
                );
            }
            
            if (job.serviceType) {
                return providerServices.includes(job.serviceType);
            }
            
            return false;
        });
    }, []);

    const throttledFetch = useCallback(async (url, options = {}) => {
        const now = Date.now();
        if (now - lastApiCallTime.current < apiCallThrottleMs) {
            console.log('API call throttled - too soon since last call');
            return null;
        }
        
        lastApiCallTime.current = now;
        try {
            return await fetch(url, options);
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        const token = localStorage.getItem('serviceProviderToken');
        if (!token) {
            navigate('/service-provider/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && Array.isArray(data.jobs)) {
                    const filteredJobs = filterJobsByProviderServices(data.jobs, serviceTypes);
                    setJobs(filteredJobs);
                }
            } else {
                console.error('Failed to fetch jobs:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    }, [navigate, serviceTypes, filterJobsByProviderServices]);

    const fetchProviderReviews = useCallback(async () => {
        const token = localStorage.getItem('serviceProviderToken');
        const providerDataStr = localStorage.getItem('providerData');
        
        console.log("Raw provider data from localStorage:", providerDataStr);
        
        let providerInfo = null;
        try {
            providerInfo = JSON.parse(providerDataStr || '{}');
        } catch (e) {
            console.error("Error parsing provider data:", e);
        }
        
        const providerId = providerInfo?._id || providerInfo?.id;
        
        if (!token || !providerId) {
            console.log("Cannot fetch reviews - missing token or provider ID", {
                hasToken: !!token,
                providerDataStr: providerDataStr?.substring(0, 50) + '...',
                parsedData: providerInfo,
                providerId
            });
            return;
        }
        
        setReviewsLoading(true);
        try {
            console.log(`Fetching reviews for provider ID: ${providerId}`);
            
            const response = await fetch(`http://localhost:5000/api/reviews/provider/${providerId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const responseText = await response.text();
            console.log("Raw API response:", responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("Error parsing response JSON:", e);
                return;
            }
            
            if (data.success) {
                console.log("Reviews received:", data.reviews);
                setReviews(data.reviews || []);
                setReviewCount(data.reviews?.length || 0);
            } else {
                console.error("API returned success: false", data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    }, []);

    useEffect(() => {
        const providerDataFromStorage = localStorage.getItem('providerData');
        console.log("Provider data from localStorage:", providerDataFromStorage);
        
        try {
            const parsedData = JSON.parse(providerDataFromStorage || '{}');
            const providerId = parsedData._id || parsedData.id;
            
            if (providerId) {
                console.log("Found provider ID:", providerId);
            } else {
                console.warn("No provider ID found in localStorage");
            }
        } catch (e) {
            console.error("Error processing provider data:", e);
        }
    }, [fetchProviderReviews]);

    useEffect(() => {
        if (serviceTypes.length > 0) {
            fetchJobs();
        }
    }, [serviceTypes, fetchJobs]);

    useEffect(() => {
        isMounted.current = true;
        
        const token = localStorage.getItem('serviceProviderToken');
        if (!token) {
            navigate('/service-provider/login');
            return;
        }
        
        const providerStored = localStorage.getItem('providerData');
        if (providerStored && !providerData) {
            try {
                const parsedData = JSON.parse(providerStored);
                console.log("Setting provider data from localStorage:", parsedData);
                setProviderData(parsedData);
                
                const providerId = parsedData._id || parsedData.id;
                if (providerId) {
                    fetchProviderReviews();
                }
            } catch (error) {
                console.error("Error parsing provider data:", error);
            }
        }
        
        const fetchData = async () => {
            if (!isMounted.current || apiCallsDisabled) return;
            
            try {
                setServicesLoading(true);
                const servicesResponse = await throttledFetch('http://localhost:5000/api/services', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (servicesResponse?.ok) {
                    const servicesData = await servicesResponse.json();
                    if (servicesData.success && Array.isArray(servicesData.data)) {
                        if (isMounted.current) {
                            setServices(servicesData.data);
                            setApiFailureCount(0);
                        }
                    }
                } else {
                    if (isMounted.current) {
                        setApiFailureCount(prev => prev + 1);
                    }
                }
                
                if (isMounted.current) {
                    setServicesLoading(false);
                }
                
                if (servicesResponse?.ok) {
                    if (isMounted.current) setLoading(true);
                    
                    const jobsResponse = await throttledFetch('http://localhost:5000/api/jobs', {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (jobsResponse?.ok) {
                        const jobsData = await jobsResponse.json();
                        let jobsArray = [];
                        
                        if (Array.isArray(jobsData)) {
                            jobsArray = jobsData;
                        } else if (jobsData.success && Array.isArray(jobsData.jobs)) {
                            jobsArray = jobsData.jobs;
                        } else if (jobsData.success && Array.isArray(jobsData.data)) {
                            jobsArray = jobsData.data;
                        }
                        
                        const currentServiceTypes = getProviderServiceTypes();
                        const filteredJobs = filterJobsByProviderServices(jobsArray, currentServiceTypes);
                        
                        if (isMounted.current) {
                            setJobs(filteredJobs);
                            setUsedMockData(false);
                        }
                    }
                    
                    if (isMounted.current) {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
                if (isMounted.current) {
                    setApiFailureCount(prev => prev + 1);
                    setServicesLoading(false);
                    setLoading(false);
                }
            }
        };
        
        fetchData();
        
        const handleServiceUpdate = () => {
            if (!apiCallsDisabled) {
                setTimeout(fetchData, 1000);
            }
        };
        
        window.addEventListener('serviceProviderServicesUpdated', handleServiceUpdate);
        
        return () => {
            isMounted.current = false;
            window.removeEventListener('serviceProviderServicesUpdated', handleServiceUpdate);
        };
    }, [
        navigate,
        apiCallsDisabled,
        filterJobsByProviderServices,
        getProviderServiceTypes,
        providerData,
        throttledFetch,
        fetchProviderReviews
    ]);

    useEffect(() => {
        if (apiFailureCount > 3 && !usedMockData) {
            console.log('Too many API failures, switching to mock data');
            setApiCallsDisabled(true);
            setLoading(false);
            setServicesLoading(false);
            
            const mockTypes = getProviderServiceTypes();
            if (mockTypes.length > 0) {
                const filteredMockJobs = filterJobsByProviderServices([], mockTypes);
                setJobs(filteredMockJobs.length > 0 ? filteredMockJobs : []);
                setUsedMockData(true);
                setError("Server connection unstable. Showing sample data.");
            }
        }
    }, [apiFailureCount, getProviderServiceTypes, filterJobsByProviderServices, usedMockData]);

    useEffect(() => {
        if (providerData && providerData._id) {
            console.log("Provider data loaded:", {
                providerId: providerData._id,
                name: providerData.fullname
            });
            
            const checkReviewsInDB = async () => {
                try {
                    const token = localStorage.getItem('serviceProviderToken');
                    const response = await fetch('http://localhost:5000/api/reviews/debug', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ providerId: providerData._id })
                    });
                    
                    const data = await response.json();
                    console.log("Review debug info:", data);
                } catch (err) {
                    console.error("Failed to debug reviews:", err);
                }
            };
            
            checkReviewsInDB();
        }
    }, [providerData]);

    const handleJobClick = (job) => {
        console.log('Job card clicked, opening modal for:', job);
        setSelectedJob(job);
        setShowJobDetailModal(true);
        setShowChat(false);
    };

    const handleCloseJobDetailModal = () => {
        setShowJobDetailModal(false);
        setSelectedJob(null);
    };

    const handleOpenChat = (receiverId, receiverName) => {
        if (!receiverId || !receiverName) {
            console.error("Cannot open chat: Missing receiverId or receiverName");
            return;
        }
        
        try {
            // IMPORTANT: Use local storage directly, don't use any auth utility functions
            const token = localStorage.getItem('serviceProviderToken');
            if (!token) {
                console.error("No authentication token found. Can't initialize chat.");
                toast?.error?.("Please log in to chat with customers") || 
                    console.error("Please log in to chat with customers");
                return;
            }
            
            console.log("Opening chat with customer:", receiverName, receiverId);
            
            // Set state ONCE and directly - don't use the utility which might do extra checks
            setChatData({
                receiverId,
                receiverType: 'Customer',
                receiverName
            });
            
            // Show chat UI
            setShowChat(true);
            
            // Close modal if open
            if (showJobDetailModal) {
                setShowJobDetailModal(false);
                setSelectedJob(null);
            }
        } catch (error) {
            console.error("Error opening chat:", error);
            toast?.error?.("Chat error: " + (error.message || "Failed to open chat")) || 
                console.error("Chat error:", error.message);
        }
    };

    const handleCloseChat = () => {
        setShowChat(false);
        setChatData(null);
    };

    const handleServiceManage = () => {
        navigate('/service-provider/services');
    };

    const handleViewReviews = () => {
        const providerDataStr = localStorage.getItem('providerData');
        try {
            const parsedData = JSON.parse(providerDataStr || '{}');
            const providerId = parsedData._id || parsedData.id;
            if (providerId) {
                console.log("Viewing reviews for provider:", providerId);
                fetchProviderReviews();
            } else {
                console.warn("No provider ID available for fetching reviews");
            }
        } catch (e) {
            console.error("Error parsing provider data for reviews:", e);
        }
        
        setShowReviewsModal(true);
    };

    const renderJobCard = (job) => {
        const matchingServices = job.serviceTypes?.filter(
            service => serviceTypes.includes(service)
        ) || [];

        const customerId = job.customer?._id || job.customerId;
        const customerName = job.customer?.fullname || job.customerName || 'Customer';

        return (
            <div
                key={job._id}
                style={jobCardStyles}
                onClick={() => handleJobClick(job)}
                onMouseEnter={(e) => { const target = e.currentTarget; target.style.transform = jobCardHoverStyle.transform; target.style.boxShadow = jobCardHoverStyle.boxShadow; }}
                onMouseLeave={(e) => { const target = e.currentTarget; target.style.transform = 'translateY(0)'; target.style.boxShadow = jobCardStyles.boxShadow; }}
            >
                <div>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#2196F3', color: 'white', borderRadius: '4px', fontSize: '0.7rem', padding: '2px 6px', }}>Customer Request</div>
                    <h3 style={jobTitleStyles}>{job.title}</h3>
                    <p style={jobDetailStyles}>
                        {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
                    </p>
                    <p style={jobDetailStyles}><strong>Budget:</strong> Rs. {job.budget}</p>
                    <p style={jobDetailStyles}><strong>Location:</strong> {job.location}</p>
                    <p style={jobDetailStyles}><strong>Posted By:</strong> {customerName}</p>
                    <div style={{ marginTop: '10px' }}>
                        <p style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>Services Needed:</p>
                        {matchingServices.map(service => (
                            <span key={service} style={{...matchingServiceStyle, fontWeight: 'bold'}}>
                                {service} ✓ <span style={{fontSize: '0.7rem'}}>(You offer this)</span>
                            </span>
                        ))}
                        {job.serviceTypes?.filter(service => !matchingServices.includes(service)).map(service => (
                            <span key={service} style={tagStyles}>{service}</span>
                        ))}
                    </div>
                </div>
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                    <button
                        style={contactButtonStyle}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent job modal
                            
                            // Close any open modal
                            if (showJobDetailModal) {
                                setShowJobDetailModal(false);
                                setSelectedJob(null);
                            }
                            
                            // Just the essential data for chat
                            const customerId = job.customer?._id || job.customerId;
                            const customerName = job.customer?.fullname || job.customerName || 'Customer';
                            
                            // Direct call without going through complex init logic
                            if (customerId && customerName) {
                                console.log(`Contact button: Opening chat with ${customerName} (${customerId})`);
                                handleOpenChat(customerId, customerName);
                            } else {
                                toast.error("Missing customer information");
                            }
                        }}
                        disabled={!customerId}
                        title={!customerId ? "Customer details unavailable" : "Contact Customer"}
                    >
                        Contact Customer
                    </button>
                </div>
            </div>
        );
    };

    const renderJobDetailModalContent = (job) => {
        const customerId = job.customer?._id || job.customerId;
        const customerName = job.customer?.fullname || job.customerName || 'Customer';

        const detailRowStyle = {
            display: 'flex',
            marginBottom: '15px',
            borderBottom: '1px solid #eee',
            paddingBottom: '15px',
            alignItems: 'flex-start'
        };

        const detailLabelStyle = {
            width: '180px',
            fontWeight: '600',
            color: '#444',
            fontSize: '1.05rem',
            paddingRight: '15px',
            textAlign: 'right'
        };

        const detailValueStyle = {
            flex: 1,
            fontSize: '1.05rem',
            color: '#333',
            lineHeight: '1.5',
            paddingLeft: '15px',
            borderLeft: '2px solid #4CAF50'
        };

        const tagContainerStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingLeft: '15px',
            flex: 1,
            borderLeft: '2px solid #4CAF50'
        };

        const jobTagStyle = {
            backgroundColor: '#e1f5fe',
            color: '#0288d1',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500'
        };

        const matchingTagStyle = {
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            border: '1px solid #c8e6c9'
        };

        const statusStyle = {
            display: 'inline-block',
            backgroundColor: job.status?.toLowerCase() === 'open' ? '#4CAF50' : '#FFA726',
            color: 'white',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            textTransform: 'capitalize'
        };

        return (
            <div style={{
                padding: '10px 0',
                backgroundColor: 'white',
                borderRadius: '10px'
            }}>
                <h3 style={{
                    color: '#2c3e50',
                    margin: '0 0 25px 0',
                    padding: '0 0 15px 0',
                    borderBottom: '2px solid #4CAF50',
                    fontSize: '1.8rem',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>{job.title}</h3>

                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Description</div>
                    <div style={detailValueStyle}>{job.description}</div>
                </div>

                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Budget</div>
                    <div style={detailValueStyle}>Rs. {job.budget}</div>
                </div>

                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Location</div>
                    <div style={detailValueStyle}>{job.location}</div>
                </div>

                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Posted By</div>
                    <div style={detailValueStyle}>{customerName}</div>
                </div>

                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Services Needed</div>
                    <div style={tagContainerStyle}>
                        {job.serviceTypes?.map(service => {
                            const isMatching = serviceTypes.includes(service);
                            return (
                                <span key={service} style={isMatching ? matchingTagStyle : jobTagStyle}>
                                    {service} {isMatching && '✓'}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {job.dueDate && (
                    <div style={detailRowStyle}>
                        <div style={detailLabelStyle}>Due Date</div>
                        <div style={detailValueStyle}>
                            {new Date(job.dueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}
                        </div>
                    </div>
                )}

                {job.status && (
                    <div style={detailRowStyle}>
                        <div style={detailLabelStyle}>Status</div>
                        <div style={detailValueStyle}>
                            <span style={statusStyle}>{job.status}</span>
                        </div>
                    </div>
                )}

                <div style={{ 
                    marginTop: '30px', 
                    textAlign: 'center', 
                    borderTop: '2px solid #eee', 
                    paddingTop: '20px' 
                }}>
                    <button
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '12px 25px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#3e9142'; e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#4CAF50'; e.target.style.boxShadow = '0 3px 5px rgba(0,0,0,0.1)'; }}
                        onClick={(e) => {
                            e.stopPropagation();
                            
                            // Close modal first
                            setShowJobDetailModal(false);
                            setSelectedJob(null);
                            
                            // Direct chat opening
                            const customerId = job.customer?._id || job.customerId;
                            const customerName = job.customer?.fullname || job.customerName || 'Customer';
                            
                            if (customerId) {
                                // Delay chat open slightly to let modal close first
                                setTimeout(() => {
                                    handleOpenChat(customerId, customerName);
                                }, 50);
                            }
                        }}
                        disabled={!customerId}
                        title={!customerId ? "Customer details unavailable" : "Contact Customer"}
                    >
                        Contact Customer
                    </button>
                </div>
            </div>
        );
    };

    const ReviewsModal = () => {
        if (!showReviewsModal) return null;
        
        const modalStyles = {
            overlay: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1050,
                padding: '20px'
            },
            content: {
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '800px',
                maxWidth: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '30px',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            },
            header: {
                borderBottom: '2px solid #f0f0f0',
                paddingBottom: '15px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            title: {
                fontSize: '1.8rem',
                color: '#2c3e50',
                margin: 0,
                fontWeight: 'bold'
            },
            closeButton: {
                background: 'none',
                border: 'none',
                fontSize: '1.8rem',
                cursor: 'pointer',
                color: '#aaa',
                transition: 'color 0.2s'
            },
            reviewCard: {
                borderBottom: '1px solid #eee',
                paddingBottom: '20px',
                marginBottom: '20px'
            },
            reviewHeader: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '10px'
            },
            serviceTitle: {
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#2c3e50',
                marginBottom: '5px'
            },
            customerName: {
                fontSize: '0.9rem',
                color: '#666'
            },
            date: {
                fontSize: '0.85rem',
                color: '#999'
            },
            rating: {
                color: '#FFD700',
                fontSize: '1.1rem',
                marginBottom: '8px'
            },
            feedback: {
                color: '#444',
                fontSize: '1rem',
                lineHeight: 1.6,
                margin: 0
            },
            emptyReviews: {
                textAlign: 'center',
                color: '#666',
                padding: '30px',
                fontSize: '1.1rem'
            }
        };

        return (
            <div style={modalStyles.overlay} onClick={() => setShowReviewsModal(false)}>
                <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
                    <div style={modalStyles.header}>
                        <h2 style={modalStyles.title}>My Customer Reviews</h2>
                        <button 
                            style={modalStyles.closeButton} 
                            onClick={() => setShowReviewsModal(false)}
                            onMouseOver={(e) => e.target.style.color = '#666'}
                            onMouseOut={(e) => e.target.style.color = '#aaa'}
                        >×</button>
                    </div>

                    {reviewsLoading ? (
                        <p style={{ textAlign: 'center' }}>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <div style={modalStyles.emptyReviews}>
                            <p>You don't have any customer reviews yet.</p>
                            <p>Reviews will appear here when customers rate your services.</p>
                        </div>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} style={modalStyles.reviewCard}>
                                <div style={modalStyles.reviewHeader}>
                                    <div>
                                        <div style={modalStyles.serviceTitle}>
                                            {review.serviceTitle || 'Service'}
                                        </div>
                                        <div style={modalStyles.customerName}>
                                            Customer {review.customerId?.slice(-4) || 'Anonymous'}
                                        </div>
                                    </div>
                                    <div style={modalStyles.date}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={modalStyles.rating}>
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                                <p style={modalStyles.feedback}>
                                    {review.feedback || 'No written feedback provided.'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <ServiceProviderNav />
            <div style={dashboardContainerStyle}>
                <div style={mainContentStyle}>
                    <div style={welcomeStyles}>
                        <h1 style={welcomeHeaderStyles}>Welcome to SkillDash!</h1>
                        {providerData && (<h2 style={welcomeSubheaderStyles}>Hello, {providerData.fullname}</h2>)}
                        <p style={welcomeDescriptionStyles}>
                            Manage your services, view job requests, and grow your business...
                        </p>
                        <div style={statsSectionStyles}>
                            <div style={statCardStyles}><div style={statNumberStyles}>{jobs.length}</div><div style={statLabelStyles}>Matching Jobs</div></div>
                            <div style={statCardStyles}><div style={statNumberStyles}>{services.length}</div><div style={statLabelStyles}>Services Offered</div></div>
                            <div 
                                style={{
                                    ...statCardStyles,
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onClick={handleViewReviews}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={statNumberStyles}>{reviewCount}</div>
                                <div style={statLabelStyles}>Customer Reviews</div>
                            </div>
                        </div>
                    </div>

                    <div style={servicesSectionStyles}>
                        <h2 style={sectionHeaderStyles}>My Services</h2>
                        {servicesLoading ? ( <p>Loading your services...</p> )
                         : services.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p>You haven't added any services yet.</p>
                                <button onClick={handleServiceManage} style={contactButtonStyle}>Add Services</button>
                            </div>
                         ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Services You Offer:</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {serviceTypes.map((type, index) => (<span key={index} style={matchingServiceStyle}>{type}</span>))}
                                        </div>
                                        <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#7f8c8d' }}>Jobs are filtered based on your selected service types.</p>
                                    </div>
                                    <button onClick={handleServiceManage} style={contactButtonStyle}>Manage Services</button>
                                </div>
                            </>
                         )}
                    </div>

                    <div style={jobsSectionStyle}>
                        <h2 style={sectionHeaderStyles}>Available Jobs Matching Your Services</h2>

                        {loading ? ( <p>Loading jobs...</p> )
                         : error ? ( <div style={{ color: 'red' }}>Error loading jobs: {error}</div> )
                         : jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                {services.length === 0 ? (
                                    <>
                                        <p>You haven't added any services yet.</p>
                                        <button onClick={handleServiceManage} style={contactButtonStyle}>Add Your First Service</button>
                                    </>
                                ) : (
                                    <p>No customer job requests matching your services are available right now.</p>
                                )}
                            </div>
                         ) : (
                            <>
                                <p style={{ color: '#666', margin: '0 0 15px 0', fontStyle: 'italic' }}>
                                    Showing {jobs.length} customer {jobs.length === 1 ? 'request' : 'requests'}...
                                </p>
                                <div style={jobsContainerStyles}>
                                    {jobs.map(renderJobCard)}
                                </div>
                            </>
                         )}
                    </div>
                </div>

                <div style={chatContainerStyle}>
                    {showChat && chatData && (
                        <ChatWindow
                            userType="ServiceProvider"
                            receiverId={chatData.receiverId}
                            receiverType={chatData.receiverType}
                            receiverName={chatData.receiverName}
                            onClose={handleCloseChat}
                        />
                    )}
                </div>
            </div>

            {showJobDetailModal && selectedJob && (
                <div style={modalOverlayStyle} onClick={handleCloseJobDetailModal}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <button style={modalCloseButtonStyle} onClick={handleCloseJobDetailModal}>
                            &times;
                        </button>
                        {renderJobDetailModalContent(selectedJob)}
                    </div>
                </div>
            )}
            
            <ReviewsModal />
        </>
    );
}

export default ServiceProviderDashboard;
