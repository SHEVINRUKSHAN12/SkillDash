import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Clear any previous errors
        setError('');
        setLoading(true);

        try {
            // For simplicity, we're doing client-side validation
            // In a real app, you'd validate this on the server
            if (username === 'admin123' && password === '12345') {
                // Store admin token (in a real app, this would come from the server)
                localStorage.setItem('adminToken', 'admin-jwt-token');
                
                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>Admin Login</h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    loginBox: {
        width: '400px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '24px',
        color: '#0177cc'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '16px'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        marginTop: '5px'
    },
    button: {
        padding: '12px',
        backgroundColor: '#0177cc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: 'red',
        marginBottom: '16px',
        textAlign: 'center',
        backgroundColor: '#ffeeee',
        padding: '10px',
        borderRadius: '4px'
    }
};

export default AdminLogin;
