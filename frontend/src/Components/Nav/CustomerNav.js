import React, { useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CustomerNav() {
  const navigate = useNavigate();
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false); // State for dropdown
  const [unreadCount, setUnreadCount] = useState(1); // Placeholder unread count
  const messagesRef = useRef(null); // Ref for dropdown closing logic

  const handleLogout = () => {
    localStorage.removeItem('customerData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navStyle = {
    backgroundColor: '#333',
    padding: '1rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const linkContainerStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginRight: '2rem'
  };

  const logoContainerStyle = {
    marginLeft: '2rem'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem'
  };

  const logoStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0 0.5rem',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    position: 'relative', // Needed for badge positioning
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
    display: unreadCount > 0 ? 'block' : 'none', // Show only if count > 0
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%', // Position below the button
    right: 0,
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1100,
    width: '300px',
    border: '1px solid #eee',
    marginTop: '5px', // Small gap
    display: showMessagesDropdown ? 'block' : 'none', // Control visibility
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

  const dropdownItemHoverStyle = { // Define hover style separately
    backgroundColor: '#f0f0f0',
  };

  // Close dropdown if clicked outside
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

  // Placeholder function to handle clicking a notification
  const handleNotificationClick = (notificationData) => {
    console.log("Notification clicked:", notificationData);
    setShowMessagesDropdown(false); // Close dropdown after click
    navigate('/messages');
  };

  // Placeholder notifications
  const notifications = [
    { id: 1, senderName: 'Provider X', message: 'Okay, I can do the job...', senderId: 'provX', serviceId: 'servA' },
  ];

  return (
    <nav style={navStyle}>
      <div style={logoContainerStyle}>
        <Link to="/customer-dashboard" style={logoStyle}>SkillDash</Link>
      </div>
      <div style={linkContainerStyle}>
        <Link to="/customer-dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/post-job" style={linkStyle}>Post a Job</Link>
        <Link to="/find-service-providers" style={linkStyle}>Find Service Providers</Link>
        <Link to="/customer-profile" style={linkStyle}>My Profile</Link>

        {/* Messages Icon Button with Dropdown */}
        <div ref={messagesRef} style={{ position: 'relative' }}> {/* Wrapper for dropdown positioning */}
          <button
            style={iconButtonStyle}
            onClick={() => setShowMessagesDropdown(!showMessagesDropdown)} // Toggle dropdown
            title="Messages"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span style={badgeStyle}>{unreadCount}</span>
          </button>

          {/* Dropdown Menu */}
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
              onClick={() => { navigate('/customer/all-messages'); setShowMessagesDropdown(false); }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dropdownItemHoverStyle.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
              View All Messages
            </div>
          </div>
        </div>

        <button onClick={handleLogout} style={buttonStyle}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default CustomerNav;
