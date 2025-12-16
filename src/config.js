// Automatically detect if accessing via localhost or IP
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // If accessing via localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3008';
  }
  
  // Otherwise use the IP address (for network access)
  return `http://${hostname.replace('3007', '3008')}:3008`;
};

export const API_BASE_URL = getApiBaseUrl();
