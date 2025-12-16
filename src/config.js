// Automatically detect API base URL
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // In production (Render), API is on same server
  if (hostname.includes('onrender.com')) {
    return window.location.origin;
  }
  
  // If accessing via localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3008';
  }
  
  // Otherwise use the IP address (for network access)
  return `http://${hostname}:3008`;
};

export const API_BASE_URL = getApiBaseUrl();
