import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { predictionAPI } from '../services/api';
import './CropForm.css';

function CropForm() {
  const [formData, setFormData] = useState({
    N: '90',
    P: '42',
    K: '43',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading('🔍 Analyzing your data with AI...');
    
    try {
      const response = await predictionAPI.cropPredict(formData);
      
      setResult({
        crop: response.data.data.predictedCrop,
        confidence: response.data.data.confidence,
        source: response.data.data.source,
        
        // Enhanced data
        seedVarieties: response.data.data.seedVarieties,
        bestSeason: response.data.data.bestSeason,
        soilType: response.data.data.soilType,
        waterNeeds: response.data.data.waterNeeds,
        growthDuration: response.data.data.growthDuration,
        farmingTips: response.data.data.farmingTips,
        expectedYield: response.data.data.expectedYield,
        marketPrice: response.data.data.marketPrice,
        
        message: 'Based on AI analysis of your conditions'
      });
      
      toast.success(`✅ Recommended: ${response.data.data.predictedCrop.toUpperCase()}!`, {
        id: loadingToast,
        duration: 4000,
        icon: '🌾'
      });
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Prediction failed';
      toast.error(errorMsg, {
        id: loadingToast,
        duration: 4000
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      N: '90', P: '42', K: '43',
      temperature: '', humidity: '', ph: '', rainfall: ''
    });
    setResult(null);
    toast.success('🔄 Form reset!', { duration: 2000 });
  };

  return (
    <div className="crop-form-container">
      <Toaster position="top-center" />
      
      <div className="form-card">
        <div className="form-header">
          <h2>🌾 Crop Recommendation</h2>
          <p>Enter your climate and soil parameters</p>
        </div>
        
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-grid-simple">
            {/* Temperature */}
            <div className="form-group">
              <label>
                🌡️ Temperature <span className="unit">°C</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="e.g., 25.5"
                min="8"
                max="43"
                required
              />
              <span className="input-hint">Average temperature</span>
            </div>
            
            {/* Humidity */}
            <div className="form-group">
              <label>
                💧 Humidity <span className="unit">%</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                placeholder="e.g., 80"
                min="14"
                max="99"
                required
              />
              <span className="input-hint">Relative humidity</span>
            </div>
            
            {/* pH */}
            <div className="form-group">
              <label>
                🧪 Soil pH <span className="unit">level</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                placeholder="e.g., 6.5"
                min="3.5"
                max="9.9"
                required
              />
              <span className="input-hint">Soil acidity</span>
            </div>
            
            {/* Rainfall */}
            <div className="form-group">
              <label>
                🌧️ Rainfall <span className="unit">mm</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                placeholder="e.g., 202.5"
                min="20"
                max="300"
                required
              />
              <span className="input-hint">Annual rainfall</span>
            </div>
          </div>
          
          <div className="form-info-box">
            <span className="info-icon">ℹ️</span>
            <p>NPK values auto-optimized • AI-powered predictions</p>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>🚀 Get AI Recommendation</>
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
              🔄 Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* ENHANCED RESULT CARD */}
      {result && (
        <div className="result-card-enhanced">
          {/* Header */}
          <div className="result-header">
            <h3>✅ AI Recommendation Ready!</h3>
            <p>{result.message}</p>
            {result.source === 'ml_model' && (
              <span className="ml-badge">🤖 Powered by ML</span>
            )}
          </div>
          
          {/* Main Result */}
          <div className="result-main">
            <div className="result-crop-large">
              <span className="label">Recommended Crop</span>
              <span className="crop-name">{result.crop.toUpperCase()}</span>
              <div className="confidence-inline">
                <span className="confidence-value">{result.confidence}%</span>
                <span className="confidence-label">Confidence</span>
              </div>
            </div>
          </div>

          {/* Seed Varieties */}
          {result.seedVarieties && (
            <div className="seeds-section">
              <h4>🌱 Best Seed Varieties:</h4>
              <div className="seeds-grid">
                {result.seedVarieties.map((seed, idx) => (
                  <div key={idx} className="seed-card">
                    <span className="seed-icon">🌾</span>
                    <span className="seed-name">{seed}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crop Information Grid */}
          {result.bestSeason && (
            <div className="crop-info-section">
              <h4>📊 Crop Information:</h4>
              <div className="crop-info-grid">
                <div className="info-card">
                  <span className="info-icon">📅</span>
                  <strong>Best Season</strong>
                  <p>{result.bestSeason}</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">⏱️</span>
                  <strong>Duration</strong>
                  <p>{result.growthDuration}</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">💧</span>
                  <strong>Water Needs</strong>
                  <p>{result.waterNeeds}</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">🌾</span>
                  <strong>Expected Yield</strong>
                  <p>{result.expectedYield}</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">💰</span>
                  <strong>Market Price</strong>
                  <p>{result.marketPrice}</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">🌍</span>
                  <strong>Soil Type</strong>
                  <p>{result.soilType}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Expert Farming Tips */}
          <div className="farming-tips-section">
            <h4>💡 Expert Farming Tips for {result.crop}:</h4>
            <ul className="tips-list">
              {result.farmingTips ? (
                result.farmingTips.map((tip, idx) => (
                  <li key={idx} className="tip-item">{tip}</li>
                ))
              ) : (
                <>
                  <li className="tip-item">🌱 Use quality seeds</li>
                  <li className="tip-item">💧 Maintain proper irrigation</li>
                  <li className="tip-item">🌿 Apply balanced fertilizers</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropForm;
