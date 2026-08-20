// API Configuration
const isProduction = import.meta.env.MODE === 'production' || 
                     import.meta.env.PROD || 
                     (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (isProduction ? '/api' : 'http://localhost:5000/api');

// Debug logging (will be removed in production build by Vite)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('  Mode:', import.meta.env.MODE);
  console.log('  Is Production:', isProduction);
  console.log('  API Base URL:', API_BASE_URL);
}

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  PROJECTS: `${API_BASE_URL}/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE_URL}/projects/${id}`,
  ANALYTICS_CLICK: `${API_BASE_URL}/analytics/click`,
  ANALYTICS_CLICKS: `${API_BASE_URL}/analytics/clicks`,
  ANALYTICS_OVERVIEW: (range = '30d') => `${API_BASE_URL}/analytics/overview?range=${range}`,
  ANALYTICS_TRAFFIC: (range = '30d') => `${API_BASE_URL}/analytics/traffic?range=${range}`,
  ANALYTICS_SOURCES: (range = '30d') => `${API_BASE_URL}/analytics/sources?range=${range}`,
  ANALYTICS_DEVICES: (range = '30d') => `${API_BASE_URL}/analytics/devices?range=${range}`,
  ANALYTICS_EVENTS: `${API_BASE_URL}/analytics/events`,
  ANALYTICS_EVENTS_EXPORT: (range = '30d') => `${API_BASE_URL}/analytics/events/export?format=csv&range=${range}`,
  INTERNAL_PROJECTS: `${API_BASE_URL}/internal-projects`,
  INTERNAL_PROJECT_BY_ID: (id) => `${API_BASE_URL}/internal-projects/${id}`,
  LEAD_CONTACTS: `${API_BASE_URL}/leads/contacts`,
  LEAD_CONTACT_BY_ID: (id) => `${API_BASE_URL}/leads/contacts/${id}`,
  CHATBOT_SESSIONS: `${API_BASE_URL}/leads/chatbot-sessions`,
};

export default API_BASE_URL;
