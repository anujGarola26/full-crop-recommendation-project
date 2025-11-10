import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';
import CropForm from '../components/CropForm';
import PlantForm from '../components/PlantForm';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('crop');
  const [userName, setUserName] = useState('User');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="dashboard-container">
      <ThemeToggle />
      
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>{t.dashboard.welcome}, {userName}! 👋</h1>
            <p>{t.dashboard.subtitle}</p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="header-actions desktop-nav">
            <button 
              className="action-btn profile-btn" 
              onClick={() => navigate('/profile')}
            >
              👤 {t.dashboard.profile}
            </button>
            <button 
              className="action-btn history-btn" 
              onClick={() => navigate('/history')}
            >
              📊 {t.dashboard.history}
            </button>
            <button 
              className="action-btn settings-btn" 
              onClick={() => navigate('/settings')}
            >
              ⚙️ {t.dashboard.settings}
            </button>
            <button 
              className="action-btn logout-btn" 
              onClick={handleLogout}
            >
              🚪 {t.dashboard.logout}
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="mobile-menu-container">
            <button 
              className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            {mobileMenuOpen && (
              <div className="mobile-dropdown">
                <button 
                  className="mobile-nav-item"
                  onClick={() => handleNavigation('/profile')}
                >
                  <span className="nav-icon">👤</span>
                  <span>{t.dashboard.profile}</span>
                </button>
                <button 
                  className="mobile-nav-item"
                  onClick={() => handleNavigation('/history')}
                >
                  <span className="nav-icon">📊</span>
                  <span>{t.dashboard.history}</span>
                </button>
                <button 
                  className="mobile-nav-item"
                  onClick={() => handleNavigation('/settings')}
                >
                  <span className="nav-icon">⚙️</span>
                  <span>{t.dashboard.settings}</span>
                </button>
                <button 
                  className="mobile-nav-item logout"
                  onClick={handleLogout}
                >
                  <span className="nav-icon">🚪</span>
                  <span>{t.dashboard.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'crop' ? 'active' : ''}`}
          onClick={() => setActiveTab('crop')}
        >
          <span className="tab-icon">🌾</span>
          <span className="tab-text">{t.dashboard.cropTab}</span>
        </button>
        <button 
          className={`tab ${activeTab === 'plant' ? 'active' : ''}`}
          onClick={() => setActiveTab('plant')}
        >
          <span className="tab-icon">🪴</span>
          <span className="tab-text">{t.dashboard.plantTab}</span>
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'crop' ? <CropForm /> : <PlantForm />}
      </div>
    </div>
  );
}

export default Dashboard;
