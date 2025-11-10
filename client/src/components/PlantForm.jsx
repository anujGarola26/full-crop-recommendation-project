import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { predictionAPI } from '../services/api';
import './PlantForm.css';

// Plant care database with watering info
const plantCareData = {
  'Snake Plant': {
    wateringDays: 14,
    waterAmount: '200-300ml',
    lightNeeds: 'Low to Bright Indirect',
    difficulty: 'Very Easy',
    careTips: [
      '💧 Water only when soil is completely dry',
      '☀️ Can survive in low light conditions',
      '🌡️ Ideal temp: 15-30°C',
      '🚫 Avoid overwatering - causes root rot',
      '🌱 Slow growing but very hardy'
    ]
  },
  'Pothos': {
    wateringDays: 7,
    waterAmount: '300-400ml',
    lightNeeds: 'Low to Bright Indirect',
    difficulty: 'Easy',
    careTips: [
      '💧 Water when top inch of soil is dry',
      '☀️ Grows faster in bright light',
      '✂️ Prune regularly for bushy growth',
      '🌿 Can grow in water indefinitely',
      '🪴 Air purifying properties'
    ]
  },
  'Peace Lily': {
    wateringDays: 6,
    waterAmount: '300-500ml',
    lightNeeds: 'Low to Medium Light',
    difficulty: 'Easy',
    careTips: [
      '💧 Leaves droop when thirsty',
      '🌸 White flowers bloom periodically',
      '☀️ Prefers shade to partial shade',
      '🚰 Use filtered water (sensitive to chlorine)',
      '🪴 NASA approved air purifier'
    ]
  },
  'Aloe Vera': {
    wateringDays: 21,
    waterAmount: '150-250ml',
    lightNeeds: 'Bright Direct Sunlight',
    difficulty: 'Very Easy',
    careTips: [
      '💧 Drought tolerant succulent',
      '☀️ Needs 6+ hours of sunlight',
      '💊 Medicinal gel for burns/cuts',
      '🌵 Well-draining soil essential',
      '🪴 Water deeply but infrequently'
    ]
  },
  'Spider Plant': {
    wateringDays: 7,
    waterAmount: '250-350ml',
    lightNeeds: 'Bright Indirect Light',
    difficulty: 'Very Easy',
    careTips: [
      '💧 Keep soil slightly moist',
      '🕷️ Produces baby plantlets',
      '☀️ Adapts to various light conditions',
      '🌱 Safe for pets',
      '🪴 Excellent air purifier'
    ]
  },
  'ZZ Plant': {
    wateringDays: 14,
    waterAmount: '200-300ml',
    lightNeeds: 'Low to Bright Indirect',
    difficulty: 'Very Easy',
    careTips: [
      '💧 Extremely drought tolerant',
      '☀️ Thrives in low light',
      '🌿 Glossy waxy leaves',
      '🐌 Very slow growing',
      '🪴 Perfect for beginners'
    ]
  }
};

function PlantForm() {
  const [formData, setFormData] = useState({
    space: '',
    light: '',
    humidity: '',
    temperature: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [waterReminders, setWaterReminders] = useState({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Load existing reminders on mount
  useEffect(() => {
    loadReminders();
    checkOverdueReminders();
  }, []);

  // Load reminders from localStorage
  const loadReminders = () => {
    const reminders = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reminder_')) {
        const plantName = key.replace('reminder_', '');
        const data = JSON.parse(localStorage.getItem(key));
        reminders[plantName] = data;
      }
    }
    setWaterReminders(reminders);
  };

  // Check for overdue reminders
  const checkOverdueReminders = () => {
    const overdue = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reminder_')) {
        const data = JSON.parse(localStorage.getItem(key));
        const dueDate = new Date(data.nextWatering);
        const today = new Date();
        
        if (dueDate <= today && data.enabled) {
          overdue.push(data.plantName);
        }
      }
    }
    
    if (overdue.length > 0) {
      toast('💧 ' + overdue.length + ' plant(s) need watering!', {
        icon: '🪴',
        duration: 6000,
        style: {
          background: '#2c5f2d',
          color: 'white'
        }
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading('🔍 Finding perfect plants...');
    
    try {
      const response = await predictionAPI.plantPredict(formData);
      
      setResult({
        plants: response.data.data.plants,
        message: response.data.data.message,
        tips: response.data.data.tips
      });
      
      toast.success('✅ Perfect matches found!', {
        id: loadingToast,
        duration: 3000,
        icon: '🪴'
      });
      
    } catch (err) {
      toast.error('Recommendation failed', {
        id: loadingToast
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      space: '', light: '', humidity: '', temperature: ''
    });
    setResult(null);
    toast.success('🔄 Form reset!');
  };

  // Toggle water reminder for a plant
  const toggleReminder = (plantName) => {
    const key = `reminder_${plantName}`;
    const existing = localStorage.getItem(key);
    
    if (existing) {
      // Remove reminder
      localStorage.removeItem(key);
      const newReminders = { ...waterReminders };
      delete newReminders[plantName];
      setWaterReminders(newReminders);
      toast.success(`🔕 Reminder OFF for ${plantName}`);
    } else {
      // Set reminder
      setSelectedPlant(plantName);
      setShowReminderModal(true);
    }
  };

  // Confirm and save reminder
  const saveReminder = () => {
    const careData = plantCareData[selectedPlant];
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + careData.wateringDays);
    
    const reminderData = {
      plantName: selectedPlant,
      nextWatering: nextDate.toISOString(),
      frequency: `Every ${careData.wateringDays} days`,
      amount: careData.waterAmount,
      enabled: true
    };
    
    localStorage.setItem(`reminder_${selectedPlant}`, JSON.stringify(reminderData));
    setWaterReminders({
      ...waterReminders,
      [selectedPlant]: reminderData
    });
    
    setShowReminderModal(false);
    toast.success(`🔔 Reminder set for ${selectedPlant}!`, {
      icon: '💧',
      duration: 4000
    });
    
    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  // Check if reminder is active for plant
  const isReminderActive = (plantName) => {
    return waterReminders[plantName]?.enabled;
  };

  return (
    <div className="plant-form-container">
      <Toaster position="top-center" />
      
      <div className="form-card">
        <div className="form-header">
          <h2>🪴 Home Plant Recommendation</h2>
          <p>Tell us about your space and environment</p>
        </div>
        
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-grid">
            {/* Space */}
            <div className="form-group">
              <label>
                📏 Available Space
              </label>
              <select
                name="space"
                value={formData.space}
                onChange={handleChange}
                required
              >
                <option value="">Select space</option>
                <option value="small">Small (Desk/Table)</option>
                <option value="medium">Medium (Floor/Corner)</option>
                <option value="large">Large (Multiple plants)</option>
              </select>
            </div>
            
            {/* Light */}
            <div className="form-group">
              <label>
                ☀️ Sunlight Availability
              </label>
              <select
                name="light"
                value={formData.light}
                onChange={handleChange}
                required
              >
                <option value="">Select light</option>
                <option value="low">Low (No direct sun)</option>
                <option value="medium">Medium (Indirect sun)</option>
                <option value="high">High (Direct sun)</option>
              </select>
            </div>
            
            {/* Humidity */}
            <div className="form-group">
              <label>
                💧 Room Humidity <span className="unit">%</span>
              </label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                placeholder="e.g., 60"
                min="30"
                max="90"
                required
              />
            </div>
            
            {/* Temperature */}
            <div className="form-group">
              <label>
                🌡️ Room Temperature <span className="unit">°C</span>
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="e.g., 25"
                min="15"
                max="35"
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Finding...
                </>
              ) : (
                <>🔍 Get Plant Suggestions</>
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
              🔄 Reset
            </button>
          </div>
        </form>
      </div>
      
      {/* PLANT RESULTS WITH WATER REMINDERS */}
      {result && (
        <div className="plant-results">
          <div className="results-header">
            <h3>✅ {result.message}</h3>
            <p>Here are the perfect plants for your space</p>
          </div>
          
          <div className="plants-grid">
            {result.plants.map((plant, idx) => {
              const careData = plantCareData[plant.name] || {};
              const hasReminder = isReminderActive(plant.name);
              
              return (
                <div key={idx} className="plant-card-enhanced">
                  <div className="plant-card-header">
                    <span className="plant-icon">{plant.icon}</span>
                    <div className="plant-title">
                      <h4>{plant.name}</h4>
                      <span className="suitability">{plant.suitability}% Match</span>
                    </div>
                  </div>
                  
                  <div className="plant-care-badge">
                    <span>🌿 {careData.difficulty || 'Easy'}</span>
                  </div>
                  
                  <p className="plant-care">{plant.care}</p>
                  
                  {/* Watering Info */}
                  {careData.wateringDays && (
                    <div className="watering-info">
                      <div className="water-stat">
                        <span className="water-icon">💧</span>
                        <div>
                          <strong>Water Every</strong>
                          <p>{careData.wateringDays} days</p>
                        </div>
                      </div>
                      <div className="water-stat">
                        <span className="water-icon">🚰</span>
                        <div>
                          <strong>Amount</strong>
                          <p>{careData.waterAmount}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Care Tips */}
                  {careData.careTips && (
                    <div className="care-tips-compact">
                      <strong>Quick Tips:</strong>
                      <ul>
                        {careData.careTips.slice(0, 3).map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* WATER REMINDER TOGGLE */}
                  <div className="reminder-toggle-section">
                    <button
                      className={`reminder-toggle-btn ${hasReminder ? 'active' : ''}`}
                      onClick={() => toggleReminder(plant.name)}
                    >
                      {hasReminder ? (
                        <>
                          <span className="bell-icon">🔔</span>
                          <span>Reminder ON</span>
                        </>
                      ) : (
                        <>
                          <span className="bell-icon">🔕</span>
                          <span>Set Water Reminder</span>
                        </>
                      )}
                    </button>
                    
                    {hasReminder && waterReminders[plant.name] && (
                      <div className="next-watering">
                        <small>
                          💧 Next: {new Date(waterReminders[plant.name].nextWatering).toLocaleDateString()}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* General Tips */}
          <div className="general-tips">
            <h4>🌱 General Plant Care Tips:</h4>
            <ul>
              {result.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* REMINDER CONFIRMATION MODAL */}
      {showReminderModal && selectedPlant && (
        <div className="modal-overlay" onClick={() => setShowReminderModal(false)}>
          <div className="modal-content reminder-modal" onClick={(e) => e.stopPropagation()}>
            <h3>💧 Set Water Reminder</h3>
            <div className="modal-plant-info">
              <p><strong>Plant:</strong> {selectedPlant}</p>
              <p><strong>Frequency:</strong> Every {plantCareData[selectedPlant]?.wateringDays} days</p>
              <p><strong>Amount:</strong> {plantCareData[selectedPlant]?.waterAmount}</p>
              <p><strong>Next Watering:</strong> {
                new Date(Date.now() + plantCareData[selectedPlant]?.wateringDays * 24 * 60 * 60 * 1000)
                  .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              }</p>
            </div>
            <div className="modal-note">
              <span className="note-icon">ℹ️</span>
              <p>You'll see reminders in the app. Enable browser notifications for alerts even when app is closed.</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={saveReminder}>
                ✅ Activate Reminder
              </button>
              <button className="btn btn-secondary" onClick={() => setShowReminderModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantForm;
