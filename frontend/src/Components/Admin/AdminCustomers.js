import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../Nav/AdminNav';

const AdminCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    
    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Fetch customers data
    useEffect(() => {
        // This would be replaced with an actual API call
        setLoading(true);
        setError(null);
        
        setTimeout(() => {
            try {
                // Mock data
                const mockCustomers = [
                    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'active', registeredOn: '2023-01-15' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', status: 'active', registeredOn: '2023-02-20' },
                    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '345-678-9012', status: 'blocked', registeredOn: '2023-03-10' },
                    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '456-789-0123', status: 'active', registeredOn: '2023-04-05' },
                    { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '567-890-1234', status: 'inactive', registeredOn: '2023-05-12' },
                ];
                setCustomers(mockCustomers);
                setLoading(false);
            } catch (err) {
                setError("Failed to load customer data. Please try again later.");
                setLoading(false);
                console.error("Error loading customers:", err);
            }
        }, 1000);
    }, []);
    
    // Filter customers based on search and status filter
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        
        const matchesStatus = 
            selectedStatus === 'all' || 
            customer.status === selectedStatus;
            
        return matchesSearch && matchesStatus;
    });
    
    // Handle blocking/unblocking a user
    const handleToggleBlock = (customerId, currentStatus) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        
        // This would be an API call in a real application
        setCustomers(customers.map(customer => 
            customer.id === customerId 
                ? {...customer, status: newStatus} 
                : customer
        ));
    };
    
    // Handle deleting a user
    const handleDelete = (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            // This would be an API call in a real application
            setCustomers(customers.filter(customer => customer.id !== customerId));
        }
    };

    return (
        <div>
            <AdminNav />
            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.header}>
                        <h2>Customer Management</h2>
                        <div style={styles.controls}>
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                style={styles.statusFilter}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div style={styles.loading}>Loading customers...</div>
                    ) : error ? (
                        <div style={styles.error}>{error}</div>
                    ) : (
                        <>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Registered On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map(customer => (
                                            <tr key={customer.id}>
                                                <td>{customer.id}</td>
                                                <td>{customer.name}</td>
                                                <td>{customer.email}</td>
                                                <td>{customer.phone}</td>
                                                <td>
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: 
                                                            customer.status === 'active' ? '#4CAF50' :
                                                            customer.status === 'blocked' ? '#F44336' : '#FF9800'
                                                    }}>
                                                        {customer.status}
                                                    </span>
                                                </td>
                                                <td>{customer.registeredOn}</td>
                                                <td style={styles.actions}>
                                                    <button
                                                        onClick={() => handleToggleBlock(customer.id, customer.status)}
                                                        style={{
                                                            ...styles.actionButton,
                                                            backgroundColor: customer.status === 'blocked' ? '#4CAF50' : '#FF9800'
                                                        }}
                                                    >
                                                        {customer.status === 'blocked' ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(customer.id)}
                                                        style={{...styles.actionButton, backgroundColor: '#F44336'}}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={styles.noResults}>No customers found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            
                            <div style={styles.summary}>
                                Showing {filteredCustomers.length} out of {customers.length} customers
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
    },
    controls: {
        display: 'flex',
        gap: '10px',
    },
    searchInput: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '250px',
    },
    statusFilter: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '0.8rem',
        display: 'inline-block',
    },
    actions: {
        display: 'flex',
        gap: '5px',
    },
    actionButton: {
        padding: '4px 8px',
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
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

export default AdminCustomers;
