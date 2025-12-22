// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     (import.meta.env.MODE === 'production' 
                       ? '/api' 
                       : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  PROJECTS: `${API_BASE_URL}/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE_URL}/projects/${id}`,
};

export default API_BASE_URL;
