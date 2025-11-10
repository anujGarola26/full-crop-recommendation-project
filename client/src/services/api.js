// API Service - All backend API calls
import axios from 'axios';

// Backend API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION APIs ==========

/**
 * User Registration
 * @param {Object} data - { name, email, password }
 * @returns {Promise} - Response with token and user data
 */
export const authAPI = {
  register: (data) => {
    return apiClient.post('/auth/register', data);
  },
  
  /**
   * User Login
   * @param {Object} data - { email, password }
   * @returns {Promise} - Response with token and user data
   */
  login: (data) => {
    return apiClient.post('/auth/login', data);
  },
  
  /**
   * Get Current User Profile
   * @returns {Promise} - User profile data
   */
  getProfile: () => {
    return apiClient.get('/auth/profile');
  },
  
  /**
   * Update User Profile
   * @param {Object} data - Profile update data
   * @returns {Promise} - Updated user data
   */
  updateProfile: (data) => {
    return apiClient.put('/auth/profile', data);
  },
  
  /**
   * Change Password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise} - Success message
   */
  changePassword: (data) => {
    return apiClient.post('/auth/change-password', data);
  }
};

// ========== PREDICTION APIs ==========

/**
 * Crop Prediction API
 * @param {Object} data - { N, P, K, temperature, humidity, ph, rainfall }
 * @returns {Promise} - Crop recommendation with tips
 */
export const predictionAPI = {
  cropPredict: (data) => {
    console.log('🌾 Calling Crop Prediction API...');
    return apiClient.post('/prediction/crop', data);
  },
  
  /**
   * Plant Recommendation API
   * @param {Object} data - { space, light, humidity, temperature }
   * @returns {Promise} - Plant recommendations
   */
  plantPredict: (data) => {
    console.log('🪴 Calling Plant Recommendation API...');
    return apiClient.post('/prediction/plant', data);
  },
  
  /**
   * Get User's Prediction History
   * @returns {Promise} - Array of past predictions
   */
  getHistory: () => {
    return apiClient.get('/prediction/history');
  },
  
  /**
   * Get Specific Prediction by ID
   * @param {String} id - Prediction ID
   * @returns {Promise} - Prediction details
   */
  getPredictionById: (id) => {
    return apiClient.get(`/prediction/${id}`);
  },
  
  /**
   * Delete Prediction
   * @param {String} id - Prediction ID
   * @returns {Promise} - Success message
   */
  deletePrediction: (id) => {
    return apiClient.delete(`/prediction/${id}`);
  },
  
  /**
   * Check Flask ML API Status
   * @returns {Promise} - ML service health status
   */
  checkMLStatus: () => {
    return apiClient.get('/prediction/ml-status');
  }
};

// ========== UTILITY APIs ==========

/**
 * Test Backend Connection
 * @returns {Promise} - Server status
 */
export const utilAPI = {
  testConnection: () => {
    return apiClient.get('/');
  },
  
  /**
   * Get Server Health
   * @returns {Promise} - Health check data
   */
  healthCheck: () => {
    return apiClient.get('/health');
  }
};

// ========== EXPORT DEFAULT ==========

/**
 * Default export - axios instance
 * Can be used for custom API calls
 */
export default apiClient;

/**
 * Usage Examples:
 * 
 * // Authentication
 * import { authAPI } from './services/api';
 * const response = await authAPI.login({ email, password });
 * 
 * // Predictions
 * import { predictionAPI } from './services/api';
 * const result = await predictionAPI.cropPredict(formData);
 * 
 * // Custom call
 * import apiClient from './services/api';
 * const data = await apiClient.get('/custom-endpoint');
 */
