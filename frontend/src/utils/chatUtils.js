/**
 * Utilities for chat functionality that never trigger logout
 */

/**
 * Safe method to get user token without risking auth redirects
 */
export const getChatToken = (userType) => {
  try {
    // Direct localStorage access with no auth checks or redirects
    return localStorage.getItem(
      userType === 'Customer' ? 'customerToken' : 'serviceProviderToken'
    );
  } catch (e) {
    console.error("Error accessing token:", e);
    return null;
  }
};

/**
 * Check if user can initiate chat based on authentication status
 * @param {string} userType - 'Customer' or 'ServiceProvider' 
 * @returns {boolean} - Whether user has valid token
 */
export const canInitiateChat = (userType) => {
  // IMPORTANT: Don't do any token validation that might trigger redirects
  // Just check if token exists (present/not present)
  const token = getChatToken(userType);
  return !!token;
};

/**
 * Initialize chat session - Completely safe version that never triggers auth redirects
 * @param {Function} setChatData - State setter function for chat data
 * @param {Function} setShowChat - State setter function to display chat
 * @param {string} receiverId - ID of the receiver
 * @param {string} receiverName - Name of the receiver
 * @param {string} userType - Current user type ('Customer' or 'ServiceProvider')
 * @param {string} serviceId - Optional service ID for context
 * @returns {boolean} - Success indicator
 */
export const initializeChat = (setChatData, setShowChat, receiverId, receiverName, userType, serviceId = null) => {
  try {
    // IMPORTANT: Never check token validity or expiration - just check existence
    const token = getChatToken(userType);
    
    if (!token) {
      console.error(`Cannot initialize chat - no ${userType} token found`);
      return false;
    }

    // Set chat data directly
    setChatData({
      receiverId,
      receiverType: userType === 'Customer' ? 'ServiceProvider' : 'Customer',
      receiverName,
      serviceId,
      providerName: receiverName // For backward compatibility
    });

    // Show chat window
    setShowChat(true);
    
    return true;
  } catch (error) {
    console.error("Error in chat initialization:", error);
    return false;
  }
};

/**
 * Safe fetch for chat operations - never triggers auth redirects
 */
export const chatFetch = async (url, options = {}) => {
  // Determine which token to use based on the URL or a parameter in options
  const userType = options.userType || (url.includes('customer') ? 'Customer' : 'Provider');
  
  // Get the appropriate token from localStorage
  const token = getChatToken(userType);
  
  // Prepare headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  // Merge headers with any provided options
  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  };
  
  // Execute the fetch call
  try {
    const response = await fetch(url, fetchOptions);
    return response;
  } catch (error) {
    console.error("Error during chat fetch operation:", error);
    throw error;
  }
};
