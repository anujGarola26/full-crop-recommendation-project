import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import { predictionAPI } from "../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    cropPredictions: 0,
    plantPredictions: 0,
    memberSince: "",
  });
  const navigate = useNavigate();
  const loadUserData = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setStats((prev) => ({
        ...prev,
        memberSince: new Date(
          userData.createdAt || Date.now()
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
      }));
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadUserData();
    loadStats();
  }, [loadUserData ]);


  const loadStats = async () => {
    try {
      const response = await predictionAPI.getHistory();
      const predictions = response.data.data;

      setStats((prev) => ({
        ...prev,
        totalPredictions: predictions.length,
        cropPredictions: predictions.filter((p) => p.type === "crop").length,
        plantPredictions: predictions.filter((p) => p.type === "plant").length,
      }));
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  return (
    <div className="profile-container">
      <Toaster position="top-center" />
      <ThemeToggle />

      <header className="profile-header">
        <div className="header-content">
          <h1>👤 My Profile</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="profile-content">
        {user && (
          <>
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-avatar">{getInitials(user.name)}</div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                <span className="member-badge">
                  📅 Member since {stats.memberSince}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{stats.totalPredictions}</div>
                <div className="stat-label">Total Predictions</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🌾</div>
                <div className="stat-value">{stats.cropPredictions}</div>
                <div className="stat-label">Crop Recommendations</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🪴</div>
                <div className="stat-value">{stats.plantPredictions}</div>
                <div className="stat-label">Plant Recommendations</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">
                  {stats.totalPredictions > 0 ? "95%" : "0%"}
                </div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="action-icon">🌾</span>
                  <span>New Crop Prediction</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/history")}
                >
                  <span className="action-icon">📊</span>
                  <span>View History</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/settings")}
                >
                  <span className="action-icon">⚙️</span>
                  <span>Settings</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                    toast.success("Logged out successfully");
                  }}
                >
                  <span className="action-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
