import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminNav = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };
    
    return (
        <header style={styles.header}>
            <div style={styles.logoContainer}>
                <h1 style={styles.logo}>SkillDash Admin</h1>
            </div>
            <nav style={styles.nav}>
                <Link to="/admin/dashboard" style={styles.navLink}>Dashboard</Link>
                <Link to="/admin/customers" style={styles.navLink}>Customers</Link>
                <Link to="/admin/providers" style={styles.navLink}>Service Providers</Link>
                <Link to="/admin/analytics" style={styles.navLink}>Analytics</Link>
                <Link to="/admin/metrics" style={styles.navLink}>Metrics</Link>
                <Link to="/admin/services" style={styles.navLink}>Services</Link>
            </nav>
            <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
            </button>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#0177cc',
        color: 'white',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        boxSizing: 'border-box', // Ensures padding is included in width calculation
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    nav: {
        display: 'flex',
        gap: '20px',
        flex: 1, // Take available space
        justifyContent: 'center', // Center the navigation links
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: '500',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: 'white',
        color: '#0177cc',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        marginRight: '15px', // Add margin to prevent it from sticking to the edge
    },
};

export default AdminNav;
