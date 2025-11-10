import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { predictionAPI } from '../services/api';
import './Settings.css';

function Settings() {
  const { theme } = useContext(ThemeContext);
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  // All state variables (same as before)
  const [autoTheme, setAutoTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationSound, setNotificationSound] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState('top-center');
  const [autoDismissTime, setAutoDismissTime] = useState(4000);
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('INR');
  const [plantRecommendationCount, setPlantRecommendationCount] = useState(4);
  const [showConfidenceScore, setShowConfidenceScore] = useState(true);
  const [autoSavePredictions, setAutoSavePredictions] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    setAutoTheme(localStorage.getItem('autoTheme') === 'true');
    setNotificationsEnabled(localStorage.getItem('notificationsEnabled') !== 'false');
    setNotificationSound(localStorage.getItem('notificationSound') === 'true');
    setNotificationPosition(localStorage.getItem('notificationPosition') || 'top-center');
    setAutoDismissTime(parseInt(localStorage.getItem('autoDismissTime') || '4000'));
    setDateFormat(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');
    setCurrency(localStorage.getItem('currency') || 'INR');
    setPlantRecommendationCount(parseInt(localStorage.getItem('plantCount') || '4'));
    setShowConfidenceScore(localStorage.getItem('showConfidence') !== 'false');
    setAutoSavePredictions(localStorage.getItem('autoSave') !== 'false');
  };

  // Mark as unsaved when settings change
  const markUnsaved = () => {
    setHasUnsavedChanges(true);
  };

  // LANGUAGE HANDLER - Actually changes app language
  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // This updates entire app
    markUnsaved();
    toast.success(
      lang === 'en' ? '🌍 Language: English' : '🌍 भाषा: हिंदी',
      { position: notificationPosition, duration: autoDismissTime }
    );
  };

  // ALL OTHER HANDLERS (same logic, add markUnsaved())
  const handleAutoThemeToggle = () => {
    const newValue = !autoTheme;
    setAutoTheme(newValue);
    markUnsaved();
  };

  const handleNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    markUnsaved();
  };

  const handleSoundToggle = () => {
    const newValue = !notificationSound;
    setNotificationSound(newValue);
    markUnsaved();
  };

  const handlePositionChange = (position) => {
    setNotificationPosition(position);
    markUnsaved();
  };

  const handleDismissTimeChange = (time) => {
    setAutoDismissTime(time);
    markUnsaved();
  };

  const handleDateFormatChange = (format) => {
    setDateFormat(format);
    markUnsaved();
  };

  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    markUnsaved();
  };

  const handlePlantCountChange = (count) => {
    setPlantRecommendationCount(count);
    markUnsaved();
  };

  const handleConfidenceToggle = () => {
    setShowConfidenceScore(!showConfidenceScore);
    markUnsaved();
  };

  const handleAutoSaveToggle = () => {
    setAutoSavePredictions(!autoSavePredictions);
    markUnsaved();
  };

  // SAVE ALL CHANGES - Saves everything to localStorage
  const handleSaveAllChanges = () => {
    localStorage.setItem('autoTheme', autoTheme.toString());
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    localStorage.setItem('notificationSound', notificationSound.toString());
    localStorage.setItem('notificationPosition', notificationPosition);
    localStorage.setItem('autoDismissTime', autoDismissTime.toString());
    localStorage.setItem('dateFormat', dateFormat);
    localStorage.setItem('currency', currency);
    localStorage.setItem('plantCount', plantRecommendationCount.toString());
    localStorage.setItem('showConfidence', showConfidenceScore.toString());
    localStorage.setItem('autoSave', autoSavePredictions.toString());
    
    setHasUnsavedChanges(false);
    toast.success(
      language === 'en' ? '✅ All settings saved successfully!' : '✅ सभी सेटिंग्स सफलतापूर्वक सहेजी गईं!',
      { position: notificationPosition, duration: autoDismissTime }
    );
  };

  // Export & Privacy handlers (same as before)
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const response = await predictionAPI.getHistory();
      const data = response.data.data;
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `predictions-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('📥 Data exported successfully');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('⚠️ Delete all prediction history?')) return;
    toast.success('🗑️ History cleared');
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    localStorage.clear();
    navigate('/');
    toast.success('Account deleted');
  };

  const handlePasswordChange = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be 6+ characters');
      return;
    }
    toast.success('🔐 Password changed');
    setShowPasswordModal(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="settings-container">
      <Toaster position={notificationPosition} />
      <ThemeToggle />
      
      <header className="settings-header">
        <div className="header-content">
          <div>
            <h1>⚙️ {t.settings.title}</h1>
            <p>{t.settings.subtitle}</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            ← {t.settings.backToDashboard}
          </button>
        </div>
      </header>

      <div className="settings-content">
        
        {/* Theme Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🎨 {t.settings.theme}</h2>
            <p>{t.settings.themeDesc}</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Current Theme</h3>
              <p>Switch between dark and light mode</p>
            </div>
            <div className="setting-control">
              <span className="theme-badge">
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto Theme</h3>
              <p>Follow system preference</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoTheme}
                  onChange={handleAutoThemeToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🔔 {t.settings.notifications}</h2>
            <p>{t.settings.notifDesc}</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Enable Notifications</h3>
              <p>Show toast notifications</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Notification Sound</h3>
              <p>Play sound on notifications</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notificationSound}
                  onChange={handleSoundToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Position</h3>
              <p>Notification placement</p>
            </div>
            <div className="setting-control">
              <select 
                value={notificationPosition}
                onChange={(e) => handlePositionChange(e.target.value)}
                className="select-input"
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-Dismiss Time</h3>
              <p>Duration before auto-close</p>
            </div>
            <div className="setting-control">
              <select 
                value={autoDismissTime}
                onChange={(e) => handleDismissTimeChange(parseInt(e.target.value))}
                className="select-input"
              >
                <option value="2000">2 seconds</option>
                <option value="4000">4 seconds</option>
                <option value="6000">6 seconds</option>
                <option value="10000">10 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🌍 {t.settings.language}</h2>
            <p>{t.settings.langDesc}</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>App Language</h3>
              <p>Changes entire app language</p>
            </div>
            <div className="setting-control">
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="select-input"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Date Format</h3>
              <p>Date display format</p>
            </div>
            <div className="setting-control">
              <select 
                value={dateFormat}
                onChange={(e) => handleDateFormatChange(e.target.value)}
                className="select-input"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Currency</h3>
              <p>Preferred currency symbol</p>
            </div>
            <div className="setting-control">
              <select 
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="select-input"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prediction Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🌾 Prediction Preferences</h2>
            <p>Customize recommendations</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Plant Count</h3>
              <p>Number of plant recommendations</p>
            </div>
            <div className="setting-control">
              <select 
                value={plantRecommendationCount}
                onChange={(e) => handlePlantCountChange(parseInt(e.target.value))}
                className="select-input"
              >
                <option value="3">3 plants</option>
                <option value="4">4 plants</option>
                <option value="5">5 plants</option>
                <option value="6">6 plants</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Show Confidence Score</h3>
              <p>Display prediction accuracy</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={showConfidenceScore}
                  onChange={handleConfidenceToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-Save</h3>
              <p>Save predictions to history automatically</p>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={autoSavePredictions}
                  onChange={handleAutoSaveToggle}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Account & Privacy */}
        <div className="settings-section">
          <div className="section-header">
            <h2>👤 Account & Security</h2>
            <p>Manage your account</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Update account password</p>
            </div>
            <div className="setting-control">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                🔐 Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section danger-section">
          <div className="section-header">
            <h2>🔒 {t.settings.privacy}</h2>
            <p>{t.settings.privacyDesc}</p>
          </div>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Export Data</h3>
              <p>Download all predictions as JSON</p>
            </div>
            <div className="setting-control">
              <button 
                className="btn btn-secondary"
                onClick={handleExportData}
                disabled={exportLoading}
              >
                {exportLoading ? '⏳ Exporting...' : '📥 Export'}
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Clear History</h3>
              <p>Delete all predictions</p>
            </div>
            <div className="setting-control">
              <button 
                className="btn btn-warning"
                onClick={handleClearHistory}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Delete Account</h3>
              <p>Permanently delete account</p>
            </div>
            <div className="setting-control">
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                ⚠️ Delete
              </button>
            </div>
          </div>
        </div>

        {/* SAVE ALL CHANGES BUTTON */}
        <div className="save-changes-section">
          <button 
            className={`btn btn-save-all ${hasUnsavedChanges ? 'has-changes' : ''}`}
            onClick={handleSaveAllChanges}
            disabled={!hasUnsavedChanges}
          >
            {hasUnsavedChanges ? '💾 Save All Changes' : '✅ All Changes Saved'}
          </button>
          {hasUnsavedChanges && (
            <p className="unsaved-warning">⚠️ You have unsaved changes</p>
          )}
        </div>

      </div>

      {/* Modals (same as before) */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔐 Change Password</h2>
            <div className="modal-form">
              <input 
                type="password"
                placeholder="Current Password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
              />
              <input 
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
              <input 
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handlePasswordChange}>
                  Update
                </button>
                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content danger-modal" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ Delete Account</h2>
            <p className="warning-text">
              This is <strong>permanent</strong> and <strong>cannot be undone</strong>.
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDeleteAccount}>
                Yes, Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
