import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceProviderNav from '../Nav/ServiceProviderNav';

function ServiceProviderProfile() {
    const [providerData, setProviderData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const styles = {
        container: {
            padding: '20px',
            marginTop: '80px',
            maxWidth: '800px',
            margin: '80px auto 20px'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
        },
        fieldContainer: {
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        fieldRow: {
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            paddingBottom: '15px'
        },
        label: {
            width: '180px',
            fontWeight: 'bold',
            color: '#333',
            fontSize: '16px',
            textAlign: 'right',
            paddingRight: '20px'
        },
        value: {
            flex: 1,
            color: '#666',
            fontSize: '16px'
        },
        input: {
            flex: 1,
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
            maxWidth: '400px'
        },
        buttonContainer: {
            display: 'flex',
            gap: '10px',
            marginTop: '20px'
        },
        button: {
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease'
        },
        editButton: {
            backgroundColor: '#4CAF50',
            color: 'white'
        },
        deleteButton: {
            backgroundColor: '#f44336',
            color: 'white'
        },
        saveButton: {
            backgroundColor: '#2196F3',
            color: 'white'
        },
        cancelButton: {
            backgroundColor: '#757575',
            color: 'white'
        },
        profilePicContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            position: 'relative'
        },
        profilePic: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #4CAF50',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        },
        profilePlaceholder: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: '#757575',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        fileInput: {
            display: 'none'
        },
        editPhotoButton: {
            position: 'absolute',
            bottom: '10px',
            right: 'calc(50% - 75px)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#2196F3',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }
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
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            color: '#dc3545',
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '1.5rem'
        },
        message: {
            marginBottom: '25px',
            lineHeight: '1.5',
            color: '#333'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        },
        cancelButton: {
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s'
        },
        deleteButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s'
        }
    };

    const errorPopupStyles = {
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
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            color: '#f44336',
            marginTop: 0,
            marginBottom: '15px'
        },
        message: {
            marginBottom: '20px',
            color: '#333'
        },
        button: {
            padding: '8px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
        }
    };

    const successPopupStyles = {
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
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            color: '#4CAF50',
            marginTop: 0,
            marginBottom: '15px'
        },
        message: {
            marginBottom: '20px',
            color: '#333'
        },
        button: {
            padding: '8px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
        },
        checkmark: {
            fontSize: '48px',
            color: '#4CAF50',
            marginBottom: '10px'
        }
    };

    const disabledInputStyle = {
        flex: 1,
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        color: '#888',
        fontSize: '16px',
        maxWidth: '400px',
        cursor: 'not-allowed'
    };

    useEffect(() => {
        const token = localStorage.getItem('serviceProviderToken');
        const provider = localStorage.getItem('providerData');
        
        if (!token) {
            navigate('/service-provider/login');
            return;
        }

        if (provider) {
            const parsedData = JSON.parse(provider);
            setProviderData(parsedData);
            setEditedData(parsedData);
            
            if (parsedData.profilePicture) {
                setPreviewUrl(`http://localhost:5000${parsedData.profilePicture}`);
            }
        }
    }, [navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            console.log('Current provider data:', providerData);
            console.log('Using ID for update:', providerData._id);
            
            const formData = new FormData();
            let hasTextChanges = false;
            let hasImageChange = false;
            
            // Check if text fields have changed and add them if so
            if (editedData.fullname !== providerData.fullname) {
                formData.append('fullname', String(editedData.fullname || ''));
                hasTextChanges = true;
            }
            
            if (editedData.phonenumber !== providerData.phonenumber) {
                formData.append('phonenumber', String(editedData.phonenumber || ''));
                hasTextChanges = true;
            }
            
            if (editedData.address !== providerData.address) {
                formData.append('address', String(editedData.address || ''));
                hasTextChanges = true;
            }
            
            // Only include email if it's being set for the first time
            if (!providerData.gmail && editedData.gmail) {
                formData.append('gmail', String(editedData.gmail || ''));
                hasTextChanges = true;
            }
            
            // Handle profile picture update
            if (newProfilePicture) {
                formData.append('profilePicture', newProfilePicture);
                hasImageChange = true;
            }
            
            // If no changes, just exit edit mode
            if (!hasTextChanges && !hasImageChange) {
                console.log('No changes detected, exiting edit mode');
                setIsEditing(false);
                return;
            }
            
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${key === 'profilePicture' ? '[File]' : value}`);
            }
            
            // Special log for image-only updates to help with debugging
            if (hasImageChange && !hasTextChanges) {
                console.log('This is an image-only update');
            }

            const response = await fetch(`http://localhost:5000/api/sprovider/profile/${providerData._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('serviceProviderToken')}`
                    // Don't set Content-Type, let the browser set it with the boundary
                },
                body: formData
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                setProviderData(data.provider);
                localStorage.setItem('providerData', JSON.stringify(data.provider));
                setIsEditing(false);
                setNewProfilePicture(null);
                
                // Show success message
                setSuccessMessage('Profile updated successfully!');
                setShowSuccessPopup(true);
                
                // Auto-dismiss success popup after 3 seconds
                setTimeout(() => {
                    setShowSuccessPopup(false);
                }, 3000);
            } else if (response.status === 400 && data.message && data.message.includes('Email already exists')) {
                setErrorMessage('This email address is already registered. Please use a different email.');
                setShowErrorPopup(true);
            } else {
                setErrorMessage(data.message || 'Failed to update profile. Please try again.');
                setShowErrorPopup(true);
            }
        } catch (error) {
            console.error('Update failed:', error);
            setErrorMessage('Connection error. Please try again.');
            setShowErrorPopup(true);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
            try {
                const response = await fetch(`http://localhost:5000/api/sprovider/profile/${providerData._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('serviceProviderToken')}`
                    }
                });

                if (response.ok) {
                    localStorage.clear();
                    navigate('/');
                }
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleChange = (e) => {
        setEditedData({
            ...editedData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePicture(file);
            
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmDelete = () => {
        setShowDeletePopup(true);
    };

    const DeleteConfirmationPopup = () => (
        <div style={popupStyles.overlay}>
            <div style={popupStyles.popup}>
                <h3 style={popupStyles.title}>Delete Profile</h3>
                <p style={popupStyles.message}>
                    Are you sure you want to delete your profile? This action cannot be undone 
                    and you will lose all your data and service history.
                </p>
                <div style={popupStyles.buttonContainer}>
                    <button
                        style={popupStyles.cancelButton}
                        onClick={() => setShowDeletePopup(false)}
                        onMouseOver={e => e.target.style.backgroundColor = '#5a6268'}
                        onMouseOut={e => e.target.style.backgroundColor = '#6c757d'}
                    >
                        Cancel
                    </button>
                    <button
                        style={popupStyles.deleteButton}
                        onClick={() => {
                            setShowDeletePopup(false);
                            handleDelete();
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
                        onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                    >
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
    );

    const ErrorPopup = () => (
        <div style={errorPopupStyles.overlay}>
            <div style={errorPopupStyles.popup}>
                <h3 style={errorPopupStyles.title}>Email Already Exists</h3>
                <p style={errorPopupStyles.message}>{errorMessage}</p>
                <button 
                    style={errorPopupStyles.button}
                    onClick={() => setShowErrorPopup(false)}
                >
                    OK
                </button>
            </div>
        </div>
    );

    const SuccessPopup = () => (
        <div style={successPopupStyles.overlay}>
            <div style={successPopupStyles.popup}>
                <div style={successPopupStyles.checkmark}>✓</div>
                <h3 style={successPopupStyles.title}>Success!</h3>
                <p style={successPopupStyles.message}>{successMessage}</p>
                <button 
                    style={successPopupStyles.button}
                    onClick={() => setShowSuccessPopup(false)}
                >
                    OK
                </button>
            </div>
        </div>
    );

    if (!providerData) return <div>Loading...</div>;

    return (
        <>
            <ServiceProviderNav />
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h2>My Profile</h2>
                        <div style={styles.buttonContainer}>
                            {!isEditing ? (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        style={{...styles.button, ...styles.editButton}}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        style={{...styles.button, ...styles.deleteButton}}
                                    >
                                        Delete Profile
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        style={{...styles.button, ...styles.saveButton}}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedData(providerData);
                                            if (providerData.profilePicture) {
                                                setPreviewUrl(`http://localhost:5000${providerData.profilePicture}`);
                                            } else {
                                                setPreviewUrl(null);
                                            }
                                            setNewProfilePicture(null);
                                        }}
                                        style={{...styles.button, ...styles.cancelButton}}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={styles.profilePicContainer}>
                        {previewUrl ? (
                            <img 
                                src={previewUrl} 
                                alt="Profile" 
                                style={styles.profilePic} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                            />
                        ) : (
                            <div style={styles.profilePlaceholder}>
                                {providerData.fullname ? providerData.fullname.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                        
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={styles.fileInput}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    style={styles.editPhotoButton}
                                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                    title="Change profile picture"
                                >
                                    <i>📷</i>
                                </button>
                            </>
                        )}
                    </div>

                    <div style={styles.fieldContainer}>
                        <div style={styles.fieldRow}>
                            <span style={styles.label}>Name:</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="fullname"
                                    value={editedData.fullname || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span style={styles.value}>{providerData.fullname}</span>
                            )}
                        </div>

                        <div style={styles.fieldRow}>
                            <span style={styles.label}>Email:</span>
                            {isEditing ? (
                                providerData.gmail ? (
                                    <input
                                        style={disabledInputStyle}
                                        type="email"
                                        name="gmail"
                                        value={providerData.gmail}
                                        disabled
                                        title="Email cannot be changed once set"
                                    />
                                ) : (
                                    <input
                                        style={styles.input}
                                        type="email"
                                        name="gmail"
                                        value={editedData.gmail || ''}
                                        onChange={handleChange}
                                        placeholder="Add your email"
                                    />
                                )
                            ) : (
                                <span style={styles.value}>
                                    {providerData.gmail || (
                                        <span style={{ color: '#999', fontStyle: 'italic' }}>
                                            No email provided - Edit profile to add
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>

                        <div style={styles.fieldRow}>
                            <span style={styles.label}>Username:</span>
                            <span style={styles.value}>{providerData.username}</span>
                        </div>

                        <div style={styles.fieldRow}>
                            <span style={styles.label}>Phone Number:</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="phonenumber"
                                    value={editedData.phonenumber || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span style={styles.value}>{providerData.phonenumber}</span>
                            )}
                        </div>

                        <div style={styles.fieldRow}>
                            <span style={styles.label}>Address:</span>
                            {isEditing ? (
                                <input
                                    style={styles.input}
                                    type="text"
                                    name="address"
                                    value={editedData.address || ''}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span style={styles.value}>{providerData.address}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showDeletePopup && <DeleteConfirmationPopup />}
            {showErrorPopup && <ErrorPopup />}
            {showSuccessPopup && <SuccessPopup />}
        </>
    );
}

export default ServiceProviderProfile;
