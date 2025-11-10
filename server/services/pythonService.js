// services/pythonService.js
// Service to communicate with Flask ML API

const axios = require('axios');

// Flask API URL
const FLASK_API_URL = 'http://localhost:5001';

/**
 * Call Flask API for crop prediction
 * @param {Object} data - Input parameters (N, P, K, temp, humidity, ph, rainfall)
 * @returns {Promise<Object>} - Prediction result
 */
const getCropPrediction = async (data) => {
  try {
    console.log('📡 Calling Flask API for crop prediction...');
    console.log('   Input:', data);
    
    // Make POST request to Flask
    const response = await axios.post(`${FLASK_API_URL}/predict`, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Flask API response received');
    console.log('   Prediction:', response.data.prediction);
    console.log('   Confidence:', response.data.confidence + '%');
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    console.error('❌ Flask API call failed:', error.message);
    
    // Check if Flask is not running
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'ML service not available. Please ensure Flask API is running on port 5001.',
        fallback: true
      };
    }
    
    // Other errors
    return {
      success: false,
      error: error.response?.data?.error || 'Prediction service error',
      fallback: true
    };
  }
};

/**
 * Get list of all crops from Flask API
 * @returns {Promise<Object>} - List of crops
 */
const getAllCrops = async () => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/crops`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching crops:', error.message);
    return {
      success: false,
      error: 'Could not fetch crops list'
    };
  }
};

/**
 * Check Flask API health
 * @returns {Promise<Object>} - Health status
 */
const checkFlaskHealth = async () => {
  try {
    const response = await axios.get(`${FLASK_API_URL}/health`, {
      timeout: 5000
    });
    return {
      success: true,
      status: 'Flask API is healthy',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: 'Flask API is not responding',
      error: error.message
    };
  }
};

module.exports = {
  getCropPrediction,
  getAllCrops,
  checkFlaskHealth
};
