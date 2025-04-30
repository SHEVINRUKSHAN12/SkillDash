/**
 * Authentication utilities to handle tokens and session management
 */

// Function to check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get payload from token (second part between dots)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if token is expired
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    console.error("Error checking token expiration:", e);
    return true; // Assume expired on error
  }
};

// Get the user token based on user type - export was missing
export const getAuthToken = (userType) => {
  return localStorage.getItem(
    userType === 'Customer' ? 'customerToken' : 'serviceProviderToken'
  );
};

// Clear tokens and user data for logout - export was missing
export const clearAuth = (userType) => {
  if (userType === 'Customer' || !userType) {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
  }
  
  if (userType === 'ServiceProvider' || !userType) {
    localStorage.removeItem('serviceProviderToken');
    localStorage.removeItem('providerData');
  }
};

// Handle unauthorized errors by logging out and redirecting - export was missing
export const handleAuthError = (userType, navigate) => {
  console.warn('Authentication error - logging out user');
  
  clearAuth(userType);
  
  // Redirect to appropriate login page
  if (navigate) {
    const loginPath = userType === 'Customer' 
      ? '/customer/login'
      : '/service-provider/login';
    
    navigate(loginPath);
  } else {
    // Fallback if navigate function not available
    const loginPath = userType === 'Customer' 
      ? '/customer/login'
      : '/service-provider/login';
    window.location.href = loginPath;
  }
  
  return false;
};

/**
 * Handle chat-specific authorization errors without logging out
 * @param {string} userType - 'Customer' or 'ServiceProvider'
 * @param {Object} navigate - React Router navigate function
 * @param {Function} errorCallback - Optional callback to handle the error UI
 * @returns {boolean}
 */
export const handleChatError = (userType, navigate, errorCallback) => {
  console.warn('Chat permission denied - not logging out user');
  
  if (errorCallback) {
    errorCallback("You don't have permission for this chat operation");
  }
  
  return false;
};

// Function for making authenticated API calls
export const authenticatedFetch = async (url, options = {}, userType, navigate, isChatRequest = false) => {
  const token = getAuthToken(userType);
  
  if (!token || isTokenExpired(token)) {
    console.warn('Token missing or expired');
    
    // If this is a chat request, don't log out the user
    if (isChatRequest) {
      return { 
        ok: false, 
        status: 401, 
        json: async () => ({ success: false, message: "Authentication required" })
      };
    }
    
    return handleAuthError(userType, navigate);
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': options.headers?.['Content-Type'] || 'application/json'
      }
    });
    
    if (response.status === 401 || response.status === 403) {
      console.warn(`Auth error ${response.status} from ${url}`);
      
      // Don't log out for chat-related auth errors
      if (isChatRequest || url.includes('/messages') || url.includes('/conversation')) {
        console.warn('Chat permission denied - not logging out user');
        return response;
      }
      
      handleAuthError(userType, navigate);
      return null;
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
};

// Fix ESLint warning by assigning to a variable
const authUtils = {
  isTokenExpired,
  getAuthToken,
  clearAuth,
  handleAuthError,
  handleChatError,
  authenticatedFetch
};

export default authUtils;
