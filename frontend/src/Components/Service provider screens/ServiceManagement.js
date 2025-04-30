import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceProviderNav from '../Nav/ServiceProviderNav';

function ServiceManagement() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [providerData, setProviderData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        serviceTypes: [],
        serviceArea: ''
    });
    const [token, setToken] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

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

    const pageStyles = {
        padding: '20px',
        marginTop: '64px',
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)'
    };

    const headerStyles = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const servicesContainerStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px 0'
    };

    const serviceCardStyles = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease'
    };

    const buttonStyles = {
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px'
    };

    const formContainerStyles = {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
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

    const checkboxContainerStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px',
        marginTop: '10px'
    };

    const checkboxGroupStyles = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    };

    const checkboxLabelStyles = {
        marginLeft: '8px',
        cursor: 'pointer'
    };

    const formButtonContainerStyles = {
        display: 'flex',
        gap: '15px',
        marginTop: '20px'
    };

    const tagStyles = {
        backgroundColor: '#e1f5fe',
        color: '#0288d1',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        display: 'inline-block',
        marginRight: '8px',
        marginTop: '5px'
    };

    const deleteButtonStyles = {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        marginLeft: '10px'
    };

    const deleteConfirmationStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const confirmationBoxStyles = {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const confirmationTitleStyles = {
        color: '#333',
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1.5rem'
    };

    const confirmationButtonsStyles = {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '20px'
    };

    const cancelDeleteStyles = {
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px'
    };

    const confirmDeleteStyles = {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px'
    };

    useEffect(() => {
        const fetchProviderData = async () => {
            const token = localStorage.getItem('serviceProviderToken');
            const provider = localStorage.getItem('providerData');

            if (!token) {
                navigate('/service-provider/login');
                return;
            }

            setToken(token);
            
            if (provider) {
                const providerObj = JSON.parse(provider);
                setProviderData(providerObj);
                
                try {
                    setLoading(true);
                    
                    const response = await fetch('http://localhost:5000/api/services', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Services fetched from API:', data);
                        
                        if (data.success && (data.data || data.services)) {
                            const servicesData = data.data || data.services;
                            setServices(servicesData);
                        } else {
                            setServices([]);
                        }
                    } else {
                        console.error('Failed to fetch services:', await response.text());
                        setServices([]);
                    }
                } catch (error) {
                    console.error('Error fetching services:', error);
                    setServices([]);
                }
                
                setLoading(false);
            }
        };

        fetchProviderData();
    }, [navigate]);

    const refreshServices = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            console.log('Refreshing services list...');
            
            const response = await fetch('http://localhost:5000/api/services', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setServices(data.data);
                    console.log(`Refreshed ${data.data.length} services`);
                } else {
                    console.warn('Received invalid data format during refresh');
                    setServices([]);
                }
            } else {
                console.error('Failed to refresh services:', response.status);
            }
        } catch (error) {
            console.error('Error refreshing services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = () => {
        setShowForm(true);
    };

    const handleEditService = (id) => {
        const serviceToEdit = services.find(service => service._id === id);
        if (serviceToEdit) {
            setFormData({
                _id: serviceToEdit._id,
                title: serviceToEdit.title,
                description: serviceToEdit.description,
                price: serviceToEdit.price.toString(),
                duration: serviceToEdit.duration,
                serviceTypes: serviceToEdit.serviceTypes,
                serviceArea: serviceToEdit.serviceArea,
                location: serviceToEdit.location
            });
            setShowForm(true);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.price || !formData.duration || 
            formData.serviceTypes.length === 0 || !formData.serviceArea) {
            alert("Please fill in all required fields and select a service type");
            return;
        }
        
        try {
            setLoading(true);
            
            // Check if we're updating (edit mode) or creating a new service
            const isUpdate = formData._id ? true : false;
            console.log(isUpdate ? 'Updating existing service' : 'Creating new service');
            
            // Set the URL and method based on whether we're updating or creating
            const url = isUpdate 
                ? `http://localhost:5000/api/services/${formData._id}`
                : 'http://localhost:5000/api/services';
            const method = isUpdate ? 'PUT' : 'POST';
            
            console.log(`Making ${method} request to: ${url}`);
            console.log('Form data:', formData);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    location: formData.serviceArea
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} service: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Service ${isUpdate ? 'updated' : 'created'} successfully:`, data);
            
            // Reset form and hide it
            setFormData({
                title: '',
                description: '',
                price: '',
                duration: '',
                serviceTypes: [],
                serviceArea: ''
            });
            setShowForm(false);
            
            // Show success popup instead of alert
            setSuccessMessage(`Service ${isUpdate ? 'updated' : 'created'} successfully!`);
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000); // Hide after 3 seconds
            
            // Refresh the services list
            await refreshServices();
            
        } catch (error) {
            console.error(`Error ${formData._id ? 'updating' : 'creating'} service:`, error);
            alert(`Error ${formData._id ? 'updating' : 'creating'} service: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (serviceType) => {
        setFormData({
            ...formData,
            serviceTypes: [serviceType]  // Now an array with just one item
        });
    };

    const cancelForm = () => {
        setFormData({
            title: '',
            description: '',
            price: '',
            duration: '',
            serviceTypes: [],
            serviceArea: ''
        });
        setShowForm(false);
    };

    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        if (serviceToDelete) {
            try {
                setLoading(true);
                
                const response = await fetch(`http://localhost:5000/api/services/${serviceToDelete._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to delete service: ${response.status}`);
                }
                
                setServices(prev => prev.filter(service => service._id !== serviceToDelete._id));
                
                setShowDeleteConfirmation(false);
                setServiceToDelete(null);
                
                // Show success popup instead of alert
                setSuccessMessage("Service deleted successfully!");
                setShowSuccessPopup(true);
                setTimeout(() => setShowSuccessPopup(false), 3000);
                
            } catch (error) {
                console.error('Error deleting service:', error);
                alert(`Error deleting service: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setServiceToDelete(null);
    };

    const DeleteConfirmation = () => {
        if (!serviceToDelete) return null;
        
        return (
            <div style={deleteConfirmationStyles}>
                <div style={confirmationBoxStyles}>
                    <h3 style={confirmationTitleStyles}>Confirm Deletion</h3>
                    <p>Are you sure you want to delete "{serviceToDelete.title}"?</p>
                    <p style={{ color: '#dc3545' }}>This action cannot be undone.</p>
                    <div style={confirmationButtonsStyles}>
                        <button
                            style={cancelDeleteStyles}
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            style={confirmDeleteStyles}
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SuccessPopup = () => {
        if (!showSuccessPopup) return null;
        
        return (
            <div style={{
                position: 'fixed',
                top: '30px',
                right: '30px',
                backgroundColor: '#4CAF50', // Full green background
                color: 'white',
                padding: '16px 20px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                minWidth: '320px',
                maxWidth: '400px',
                animation: 'fadeInDown 0.3s forwards',
                fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                overflow: 'hidden',
                border: 'none',
                transform: 'translateY(0)',
                opacity: 1,
                WebkitAnimation: 'fadeInDown 0.3s ease',
                MozAnimation: 'fadeInDown 0.3s ease',
                OAnimation: 'fadeInDown 0.3s ease'
            }}>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '18px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="white"/>
                    </svg>
                </div>
                <div style={{flexGrow: 1}}>
                    <h4 style={{margin: '0 0 4px 0', fontWeight: 600, fontSize: '16px', color: 'white'}}>Success</h4>
                    <p style={{margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px'}}>{successMessage}</p>
                </div>
                <button 
                    onClick={() => setShowSuccessPopup(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        marginLeft: '15px',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                    ×
                </button>
            </div>
        );
    };

    useEffect(() => {
        const animationStyles = document.createElement('style');
        animationStyles.innerHTML = `
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @-webkit-keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(animationStyles);
        
        return () => {
            document.head.removeChild(animationStyles);
        };
    }, []);

    return (
        <>
            <ServiceProviderNav />
            <div style={pageStyles}>
                <div style={headerStyles}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Service Management</h1>
                    {providerData && (
                        <p style={{ color: '#7f8c8d' }}>
                            Add and manage the services you want to offer to customers
                        </p>
                    )}
                    {!showForm && (
                        <button 
                            style={buttonStyles} 
                            onClick={handleAddService}
                        >
                            Add New Service
                        </button>
                    )}
                </div>

                {showForm && (
                    <div style={formContainerStyles}>
                        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
                            {formData.id ? 'Edit Service' : 'Add New Service'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div style={formGroupStyles}>
                                <label style={labelStyles} htmlFor="title">Service Title*</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    style={inputStyles}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter service title"
                                    required
                                />
                            </div>

                            <div style={formGroupStyles}>
                                <label style={labelStyles} htmlFor="description">Description*</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    style={{...inputStyles, height: '100px'}}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your service in detail"
                                    required
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{...formGroupStyles, flex: 1}}>
                                    <label style={labelStyles} htmlFor="price">Price (Rs.)*</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        style={inputStyles}
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="Enter service price"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div style={{...formGroupStyles, flex: 1}}>
                                    <label style={labelStyles} htmlFor="duration">Duration*</label>
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        style={inputStyles}
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2 hours, 1 day"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={formGroupStyles}>
                                <label style={labelStyles} htmlFor="serviceArea">Service Area*</label>
                                <input
                                    type="text"
                                    id="serviceArea"
                                    name="serviceArea"
                                    style={inputStyles}
                                    value={formData.serviceArea}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Colombo, Western Province"
                                    required
                                />
                            </div>

                            <div style={formGroupStyles}>
                                <label style={labelStyles}>Service Type* (Select one)</label>
                                <div style={checkboxContainerStyles}>
                                    {availableServiceTypes.map(serviceType => (
                                        <div key={serviceType} style={checkboxGroupStyles}>
                                            <input
                                                type="radio"
                                                id={serviceType}
                                                name="serviceType"
                                                checked={formData.serviceTypes.includes(serviceType)}
                                                onChange={() => handleCheckboxChange(serviceType)}
                                            />
                                            <label style={checkboxLabelStyles} htmlFor={serviceType}>
                                                {serviceType}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={formButtonContainerStyles}>
                                <button type="submit" style={buttonStyles}>
                                    {formData._id ? 'Save Changes' : 'Add Service'}
                                </button>
                                <button 
                                    type="button" 
                                    style={{...buttonStyles, backgroundColor: '#6c757d'}}
                                    onClick={cancelForm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <p>Loading services...</p>
                ) : services.length === 0 && !showForm ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '30px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>No Services Added Yet</h3>
                        <p style={{ marginBottom: '20px', color: '#666' }}>
                            You haven't added any services to your profile. Adding services will help
                            customers find you for job requests that match your skills.
                        </p>
                        <button 
                            style={{
                                ...buttonStyles, 
                                backgroundColor: '#4CAF50',
                                fontSize: '16px',
                                padding: '12px 24px'
                            }}
                            onClick={handleAddService}
                        >
                            Add Your First Service
                        </button>
                    </div>
                ) : (
                    !showForm && (
                        <div style={servicesContainerStyles}>
                            {services.map(service => (
                                <div 
                                    key={service._id} 
                                    style={serviceCardStyles}
                                >
                                    <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{service.title}</h3>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{service.description}</p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                        <strong>Price:</strong> Rs. {service.price}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                        <strong>Duration:</strong> {service.duration}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                        <strong>Service Area:</strong> {service.serviceArea || 'Not specified'}
                                    </p>
                                    <div style={{ marginTop: '10px' }}>
                                        {service.serviceTypes.map((type, index) => (
                                            <span key={index} style={tagStyles}>{type}</span>
                                        ))}
                                    </div>
    <div style={{ display: 'flex', marginTop: '10px' }}>
        <button 
            style={{
                ...buttonStyles,
                backgroundColor: '#4CAF50',
                marginTop: '10px'
            }}
            onClick={() => handleEditService(service._id)}
        >
            Edit Service
        </button>
                                        <button 
                                            style={deleteButtonStyles}
                                            onClick={() => handleDeleteClick(service)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
                
                {showDeleteConfirmation && <DeleteConfirmation />}
                {showSuccessPopup && <SuccessPopup />}
            </div>
        </>
    );
}

export default ServiceManagement;
