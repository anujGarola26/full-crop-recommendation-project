import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <ThemeToggle />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🌾 AI-Powered Agriculture</div>
          <h1 className="hero-title">
            <span className="gradient-text">Smart Crop & Plant</span>
            <br />
            Recommendation System
          </h1>
          <p className="hero-subtitle">
            Harness the power of Machine Learning to get accurate crop recommendations 
            based on soil conditions and find perfect plants for your home garden
          </p>
          
          <div className="hero-buttons">
            <Link to="/register">
              <button className="btn btn-primary">
                Get Started Free
                <span className="btn-icon">→</span>
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary">
                Login to Dashboard
              </button>
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">22+</span>
              <span className="stat-label">Crop Types</span>
            </div>
            <div className="stat">
              <span className="stat-number">60+</span>
              <span className="stat-label">Plant Species</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="decorations">
          <div className="decoration decoration-1">🌾</div>
          <div className="decoration decoration-2">🌱</div>
          <div className="decoration decoration-3">🌿</div>
          <div className="decoration decoration-4">🪴</div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Platform?</h2>
        <p className="section-subtitle">Advanced technology meets agricultural wisdom</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌾</div>
            <h3>Crop Recommendations</h3>
            <p>Get AI-powered crop suggestions based on 7 soil & climate parameters with 95%+ accuracy</p>
            <div className="feature-list">
              <span>✓ NPK Analysis</span>
              <span>✓ Climate Data</span>
              <span>✓ pH Levels</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🪴</div>
            <h3>Home Plant Guide</h3>
            <p>Discover perfect indoor plants matching your space conditions and lifestyle preferences</p>
            <div className="feature-list">
              <span>✓ Light Requirements</span>
              <span>✓ Space Optimization</span>
              <span>✓ Care Instructions</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>ML Algorithm</h3>
            <p>Powered by Random Forest classifier trained on 2200+ data samples for precise predictions</p>
            <div className="feature-list">
              <span>✓ Real-time Analysis</span>
              <span>✓ Data-driven</span>
              <span>✓ Constantly Learning</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Register Account</h4>
            <p>Create your free account in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Input Data</h4>
            <p>Enter soil parameters or room conditions</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Get Results</h4>
            <p>Receive instant AI-powered recommendations</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Track History</h4>
            <p>Save and review past predictions anytime</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Optimize Your Agriculture?</h2>
        <p>Join thousands of farmers and plant enthusiasts making smarter decisions</p>
        <Link to="/register">
          <button className="btn btn-primary btn-large">
            Start Your Journey Now 🚀
          </button>
        </Link>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Smart Crop Recommendation. Built with ❤️ for farmers & gardeners.</p>
      </footer>
    </div>
  );
}

export default Home;
