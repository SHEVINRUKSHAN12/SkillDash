import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

function ServiceProviderNav() {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); // Start with 0
    const [notifications, setNotifications] = useState([]); // Store fetched notifications
    const navigate = useNavigate();
    const messagesRef = useRef(null);

    const navStyle = {
        backgroundColor: '#333',
        padding: '1rem 2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box'
    };

    const logoStyle = {
        color: 'white',
        fontSize: '1.5rem',
        textDecoration: 'none',
        cursor: 'pointer',
        marginLeft: '20px'
    };

    const buttonContainerStyle = {
        display: 'flex',
        gap: '1rem',
        marginRight: '20px'
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s'
    };

    const iconButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: '1.2rem',
        padding: '0.3rem 0.5rem',
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    };

    const badgeStyle = {
        position: 'absolute',
        top: '-5px',
        right: '-8px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        minWidth: '18px',
        textAlign: 'center',
        lineHeight: '1',
        display: unreadCount > 0 ? 'block' : 'none',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1100,
        width: '300px',
        border: '1px solid #eee',
        marginTop: '5px',
        display: showMessagesDropdown ? 'block' : 'none',
    };

    const dropdownHeaderStyle = {
        padding: '10px 15px',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        color: '#333',
    };

    const dropdownItemStyle = {
        padding: '10px 15px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
        color: '#555',
        fontSize: '0.9rem',
    };

    const dropdownItemHoverStyle = {
        backgroundColor: '#f0f0f0',
    };

    const popupStyles = {
        overlay: {
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
        },
        popup: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            color: '#333',
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '1.5rem'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '20px'
        },
        button: {
            padding: '8px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s'
        },
        cancelButton: {
            backgroundColor: '#6c757d',
            color: 'white'
        },
        confirmButton: {
            backgroundColor: '#dc3545',
            color: 'white'
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (messagesRef.current && !messagesRef.current.contains(event.target)) {
                setShowMessagesDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [messagesRef]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('serviceProviderToken');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5000/api/messages/notifications', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    setNotifications(data.notifications);
                    setUnreadCount(data.notifications.filter(n => !n.read).length);
                } else {
                    toast.error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                toast.error('Error fetching notifications');
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('serviceProviderToken');
        localStorage.removeItem('providerData');
        navigate('/service-provider/login');
    };

    const LogoutConfirmationPopup = () => (
        <div style={popupStyles.overlay}>
            <div style={popupStyles.popup}>
                <h3 style={popupStyles.title}>Confirm Logout</h3>
                <p>Are you sure you want to logout?</p>
                <div style={popupStyles.buttonContainer}>
                    <button
                        style={{ ...popupStyles.button, ...popupStyles.cancelButton }}
                        onClick={() => setShowLogoutPopup(false)}
                        onMouseOver={e => e.target.style.backgroundColor = '#5a6268'}
                        onMouseOut={e => e.target.style.backgroundColor = '#6c757d'}
                    >
                        Cancel
                    </button>
                    <button
                        style={{ ...popupStyles.button, ...popupStyles.confirmButton }}
                        onClick={handleLogout}
                        onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
                        onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    const handleNotificationClick = (notificationData) => {
        console.log("Notification clicked:", notificationData);
        setShowMessagesDropdown(false);
        navigate('/messages');
    };

    return (
        <>
            <nav style={navStyle}>
                <div 
                    style={logoStyle}
                    onClick={() => navigate('/service-provider/dashboard')}
                >
                    SkillDash
                </div>
                <div style={buttonContainerStyle}>
                    <button 
                        style={{
                            ...buttonStyle, 
                            backgroundColor: '#007BFF', 
                            color: 'white'
                        }}
                        onClick={() => navigate('/service-provider/services')}
                    >
                        My Services
                    </button>
                    <button 
                        style={{
                            ...buttonStyle, 
                            backgroundColor: '#4CAF50', 
                            color: 'white'
                        }}
                        onClick={() => navigate('/service-provider/profile')}
                    >
                        My Profile
                    </button>

                    <div ref={messagesRef} style={{ position: 'relative' }}>
                        <button
                            style={iconButtonStyle}
                            onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
                            title="Messages"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span style={badgeStyle}>{unreadCount}</span>
                        </button>

                        <div style={dropdownStyle}>
                            <div style={dropdownHeaderStyle}>Notifications</div>
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        style={dropdownItemStyle}
                                        onClick={() => handleNotificationClick(notif)}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                    >
                                        <strong>{notif.senderName}:</strong> {notif.message}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '15px', color: '#888', fontSize: '0.9rem' }}>No new messages</div>
                            )}
                            <div
                                style={{ ...dropdownItemStyle, borderBottom: 'none', textAlign: 'center', color: '#007BFF', fontWeight: '500' }}
                                onClick={() => { navigate('/service-provider/all-messages'); setShowMessagesDropdown(false); }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                                View All Messages
                            </div>
                        </div>
                    </div>

                    <button 
                        style={{
                            ...buttonStyle, 
                            backgroundColor: '#f44336', 
                            color: 'white'
                        }}
                        onClick={() => setShowLogoutPopup(true)}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            {showLogoutPopup && <LogoutConfirmationPopup />}
        </>
    );
}

export default ServiceProviderNav;
