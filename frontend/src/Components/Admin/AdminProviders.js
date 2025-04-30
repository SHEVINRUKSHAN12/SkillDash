import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../Nav/AdminNav';

const AdminProviders = () => {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState('all');
    
    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Fetch service providers data
    useEffect(() => {
        // This would be replaced with an actual API call
        setLoading(true);
        setError(null);
        
        setTimeout(() => {
            try {
                // Mock data
                const mockProviders = [
                    { id: 1, name: 'Robert Smith', email: 'robert@example.com', phone: '123-456-7890', status: 'active', verified: true, registeredOn: '2023-01-10', serviceType: 'Plumbing' },
                    { id: 2, name: 'Lisa Johnson', email: 'lisa@example.com', phone: '234-567-8901', status: 'active', verified: false, registeredOn: '2023-02-15', serviceType: 'Electrical' },
                    { id: 3, name: 'David Williams', email: 'david@example.com', phone: '345-678-9012', status: 'blocked', verified: true, registeredOn: '2023-03-20', serviceType: 'Carpentry' },
                    { id: 4, name: 'Emma Brown', email: 'emma@example.com', phone: '456-789-0123', status: 'active', verified: false, registeredOn: '2023-04-25', serviceType: 'Painting' },
                    { id: 5, name: 'James Davis', email: 'james@example.com', phone: '567-890-1234', status: 'inactive', verified: true, registeredOn: '2023-05-30', serviceType: 'Cleaning' },
                ];
                setProviders(mockProviders);
                setLoading(false);
            } catch (err) {
                setError("Failed to load service provider data. Please try again later.");
                setLoading(false);
                console.error("Error loading providers:", err);
            }
        }, 1000);
    }, []);
    
    // Filter providers based on search and filters
    const filteredProviders = providers.filter(provider => {
        const matchesSearch = 
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.phone.includes(searchTerm) ||
            provider.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            selectedStatus === 'all' || 
            provider.status === selectedStatus;
            
        const matchesVerification = 
            selectedVerification === 'all' || 
            (selectedVerification === 'verified' && provider.verified) ||
            (selectedVerification === 'unverified' && !provider.verified);
            
        return matchesSearch && matchesStatus && matchesVerification;
    });
    
    // Handle blocking/unblocking a provider
    const handleToggleBlock = (providerId, currentStatus) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        
        // This would be an API call in a real application
        setProviders(providers.map(provider => 
            provider.id === providerId 
                ? {...provider, status: newStatus} 
                : provider
        ));
    };
    
    // Handle verifying a provider
    const handleToggleVerify = (providerId, currentVerified) => {
        // This would be an API call in a real application
        setProviders(providers.map(provider => 
            provider.id === providerId 
                ? {...provider, verified: !currentVerified} 
                : provider
        ));
    };
    
    // Handle deleting a provider
    const handleDelete = (providerId) => {
        if (window.confirm('Are you sure you want to delete this service provider? This action cannot be undone.')) {
            // This would be an API call in a real application
            setProviders(providers.filter(provider => provider.id !== providerId));
        }
    };

    return (
        <div>
            <AdminNav />
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h2>Service Provider Management</h2>
                        <div style={styles.controls}>
                            <input
                                type="text"
                                placeholder="Search providers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                style={styles.filter}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select 
                                value={selectedVerification} 
                                onChange={(e) => setSelectedVerification(e.target.value)}
                                style={styles.filter}
                            >
                                <option value="all">All Verification</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Unverified</option>
                            </select>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div style={styles.loading}>Loading service providers...</div>
                    ) : error ? (
                        <div style={styles.error}>{error}</div>
                    ) : (
                        <>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Service Type</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Verification</th>
                                        <th>Registered On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProviders.length > 0 ? (
                                        filteredProviders.map(provider => (
                                            <tr key={provider.id}>
                                                <td>{provider.id}</td>
                                                <td>{provider.name}</td>
                                                <td>{provider.serviceType}</td>
                                                <td>{provider.email}</td>
                                                <td>
                                                    <span style={{
                                                        ...styles.badge,
                                                        backgroundColor: 
                                                            provider.status === 'active' ? '#4CAF50' :
                                                            provider.status === 'blocked' ? '#F44336' : '#FF9800'
                                                    }}>
                                                        {provider.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{
                                                        ...styles.badge,
                                                        backgroundColor: provider.verified ? '#2196F3' : '#9E9E9E'
                                                    }}>
                                                        {provider.verified ? 'Verified' : 'Unverified'}
                                                    </span>
                                                </td>
                                                <td>{provider.registeredOn}</td>
                                                <td style={styles.actions}>
                                                    <button
                                                        onClick={() => handleToggleVerify(provider.id, provider.verified)}
                                                        style={{
                                                            ...styles.actionButton,
                                                            backgroundColor: provider.verified ? '#9E9E9E' : '#2196F3'
                                                        }}
                                                    >
                                                        {provider.verified ? 'Unverify' : 'Verify'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlock(provider.id, provider.status)}
                                                        style={{
                                                            ...styles.actionButton,
                                                            backgroundColor: provider.status === 'blocked' ? '#4CAF50' : '#FF9800'
                                                        }}
                                                    >
                                                        {provider.status === 'blocked' ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(provider.id)}
                                                        style={{...styles.actionButton, backgroundColor: '#F44336'}}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={styles.noResults}>No service providers found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            <div style={styles.summary}>
                                Showing {filteredProviders.length} out of {providers.length} service providers
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        paddingTop: '80px',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    controls: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '250px',
    },
    filter: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    badge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '0.8rem',
        display: 'inline-block',
    },
    actions: {
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap',
    },
    actionButton: {
        padding: '4px 8px',
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        margin: '2px',
    },
    summary: {
        textAlign: 'right',
        color: '#666',
        fontSize: '0.9rem',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '20px',
    },
    noResults: {
        textAlign: 'center',
        padding: '20px',
    },
};

export default AdminProviders;
