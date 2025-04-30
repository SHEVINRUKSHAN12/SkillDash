import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { chatFetch } from '../../utils/chatUtils';

// Basic styling for the chat window
const chatWindowStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Fill the container height
    width: '100%', // Fill the container width
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    borderRadius: '8px 8px 0 0', // Rounded top corners
    overflow: 'hidden',
    border: '1px solid #ccc',
};

const chatHeaderStyle = {
    backgroundColor: '#0177cc', // Header background color
    color: 'white',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
};

const chatHeaderTitleStyle = {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
};

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0 5px',
};

const messageListStyle = {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '15px',
    backgroundColor: '#f9f9f9', // Light background for message area
    display: 'flex',
    flexDirection: 'column',
};

const messageInputAreaStyle = {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: 'white',
};

const inputStyle = {
    flexGrow: 1,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    marginRight: '10px',
    fontSize: '0.9rem',
};

const sendButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#0177cc',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
};

// Basic message styling (example)
const messageStyle = (isSender) => ({
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: '15px',
    marginBottom: '10px',
    fontSize: '0.9rem',
    wordWrap: 'break-word',
    alignSelf: isSender ? 'flex-end' : 'flex-start',
    backgroundColor: isSender ? '#dcf8c6' : '#fff', // Different colors for sender/receiver
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    border: isSender ? '1px solid #c5e1a5' : '1px solid #eee',
});

function ChatWindow({ userType, receiverId, receiverType, serviceId, receiverName, onClose }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Use effect to scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Verify login status without triggering redirects
    const verifyLoginStatus = useCallback(() => {
        const token = localStorage.getItem(
            userType === 'Customer' ? 'customerToken' : 'providerToken'
        );
        return token != null;
    }, [userType]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!verifyLoginStatus()) {
                navigate(userType === 'Customer' ? '/customerLogin' : '/serviceProviderLogin');
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                const response = await chatFetch(`/api/messages/${userType.toLowerCase()}/${receiverId}`, {
                    method: 'GET',
                    serviceId: serviceId
                });
                
                if (response.success) {
                    setMessages(response.messages || []);
                } else {
                    setError(response.message || 'Failed to load messages');
                }
            } catch (err) {
                setError('Error loading messages. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
        // Set up message polling (every 5 seconds)
        const intervalId = setInterval(fetchMessages, 5000);
        
        return () => clearInterval(intervalId);
    }, [userType, receiverId, receiverType, serviceId, navigate, verifyLoginStatus]);

    // Handle sending messages
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!messageInput.trim()) return;
        if (!verifyLoginStatus()) {
            navigate(userType === 'Customer' ? '/customerLogin' : '/serviceProviderLogin');
            return;
        }

        setIsSending(true);
        
        try {
            const response = await chatFetch(`/api/messages/send`, {
                method: 'POST',
                body: JSON.stringify({
                    receiverId,
                    receiverType,
                    content: messageInput,
                    serviceId
                })
            });
            
            if (response.success) {
                setMessages(prevMessages => [...prevMessages, response.message]);
                setMessageInput('');
            } else {
                setError(response.message || 'Failed to send message');
            }
        } catch (err) {
            setError('Error sending message. Please try again.');
            console.error(err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={chatWindowStyle}>
            {/* Header */}
            <div style={chatHeaderStyle}>
                <h3 style={chatHeaderTitleStyle}>Chat with {receiverName}</h3>
                <button style={closeButtonStyle} onClick={onClose}>×</button>
            </div>
            
            {/* Message List */}
            <div style={messageListStyle}>
                {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px' }}>{error}</div>}
                {isLoading && messages.length === 0 && <div style={{ textAlign: 'center', margin: '10px' }}>Loading messages...</div>}
                
                {messages.map((message, index) => {
                    const isSender = message.senderType.toLowerCase() === userType.toLowerCase();
                    return (
                        <div key={message._id || index} style={messageStyle(isSender)}>
                            {message.content}
                            <div style={{ fontSize: '0.7rem', color: '#888', textAlign: 'right', marginTop: '3px' }}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
                
                <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <form style={messageInputAreaStyle} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    style={inputStyle}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                />
                <button 
                    type="submit" 
                    style={sendButtonStyle} 
                    disabled={isSending || !messageInput.trim()}
                >
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default ChatWindow;

