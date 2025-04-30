import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AllMessages({ userType }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            const token = localStorage.getItem(userType === 'Customer' ? 'customerToken' : 'serviceProviderToken');
            if (!token) {
                toast.error('Authentication error. Please log in again.');
                navigate(userType === 'Customer' ? '/customer-login' : '/service-provider/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/messages/conversations', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    setConversations(data.conversations || []);
                } else {
                    toast.error(data.message || 'Failed to fetch conversations.');
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
                toast.error('Error fetching conversations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userType, navigate]);

    const handleOpenChat = (participantId, participantName) => {
        navigate('/chat', { state: { receiverId: participantId, receiverName: participantName } });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>All Messages</h2>
            {loading ? (
                <p>Loading conversations...</p>
            ) : conversations.length === 0 ? (
                <p>No conversations found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {conversations.map((conversation) => (
                        <li
                            key={conversation.participantId}
                            style={{
                                padding: '10px',
                                borderBottom: '1px solid #ccc',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleOpenChat(conversation.participantId, conversation.participantInfo?.fullname || 'Unknown')}
                        >
                            <strong>{conversation.participantInfo?.fullname || 'Unknown'}</strong>
                            <p>{conversation.latestMessage.content}</p>
                            <small>{new Date(conversation.latestMessage.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllMessages;
