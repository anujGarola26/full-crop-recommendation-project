import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import { predictionAPI } from '../services/api';
import './History.css';

function History() {
  // State variables
  const [predictions, setPredictions] = useState([]);  // All predictions from backend
  const [loading, setLoading] = useState(true);        // Loading state
  const [filter, setFilter] = useState('all');         // Filter: 'all', 'crop', 'plant'
  const navigate = useNavigate();

  // Component mount hote hi history fetch karo
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Backend se predictions fetch karo
  const fetchHistory = async () => {
    try {
      const response = await predictionAPI.getHistory();
      setPredictions(response.data.data);  // Set predictions in state
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load history');
      setLoading(false);
      // Agar unauthorized error to login page redirect
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Filter logic - selected filter ke basis par predictions filter karo
  const filteredPredictions = predictions.filter(pred => 
    filter === 'all' || pred.type === filter
  );

  // Date ko readable format mein convert karo
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-container">
      {/* Toast notifications */}
      <Toaster position="top-center" />
      
      {/* Theme toggle button (top-right) */}
      <ThemeToggle />
      
      {/* Header with title and back button */}
      <header className="history-header">
        <div className="header-content">
          <div>
            <h1>📊 Prediction History</h1>
            <p>View all your past recommendations</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="history-content">
        {/* Filter tabs - All, Crops, Plants */}
        <div className="filter-tabs">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({predictions.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'crop' ? 'active' : ''}`}
            onClick={() => setFilter('crop')}
          >
            🌾 Crops ({predictions.filter(p => p.type === 'crop').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'plant' ? 'active' : ''}`}
            onClick={() => setFilter('plant')}
          >
            🪴 Plants ({predictions.filter(p => p.type === 'plant').length})
          </button>
        </div>

        {/* Conditional rendering - Loading / Empty / Data */}
        {loading ? (
          // Loading state
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading history...</p>
          </div>
        ) : filteredPredictions.length === 0 ? (
          // Empty state - no predictions
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No predictions yet</h3>
            <p>Start making predictions to see your history here</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard')}
            >
              Make First Prediction
            </button>
          </div>
        ) : (
          // Data state - show predictions grid
          <div className="predictions-grid">
            {filteredPredictions.map((prediction) => (
              <div key={prediction._id} className="prediction-card">
                {/* Card header - type badge and date */}
                <div className="prediction-header">
                  <span className="prediction-type">
                    {prediction.type === 'crop' ? '🌾 Crop' : '🪴 Plant'}
                  </span>
                  <span className="prediction-date">
                    {formatDate(prediction.createdAt)}
                  </span>
                </div>
                
                {/* Card body - different content for crop vs plant */}
                <div className="prediction-body">
                  {prediction.type === 'crop' ? (
                    // Crop prediction display
                    <>
                      <h3>{prediction.result.predictedCrop}</h3>
                      <div className="prediction-details">
                        <span>Confidence: {prediction.result.confidence}%</span>
                      </div>
                      <div className="input-summary">
                        <small>
                          Temp: {prediction.inputData.temperature}°C | 
                          Humidity: {prediction.inputData.humidity}% | 
                          pH: {prediction.inputData.ph}
                        </small>
                      </div>
                    </>
                  ) : (
                    // Plant prediction display
                    <>
                      <h3>{prediction.result.plants?.length || 0} Plants Recommended</h3>
                      <div className="plant-names">
                        {prediction.result.plants?.slice(0, 3).map((plant, idx) => (
                          <span key={idx} className="plant-tag">
                            {plant.icon} {plant.name}
                          </span>
                        ))}
                      </div>
                      <div className="input-summary">
                        <small>
                          Space: {prediction.inputData.space} | 
                          Light: {prediction.inputData.light}
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
