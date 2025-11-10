import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";
import predictionAPI from "../services/api";
import "./History.css";

function History() {
  // State variables
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Define fetchHistory **before** useEffect
  const fetchHistory = async () => {
    try {
      const response = await predictionAPI.getHistory();
      setPredictions(response.data.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load history");
      setLoading(false);
      // Unauthorized redirect
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // useEffect for fetching history. Dependency [navigate] only, else warning
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  // ...rest of your component code (filter logic, render etc. remains same)

  const filteredPredictions = predictions.filter(
    (pred) => filter === "all" || pred.type === filter
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-container">
      <Toaster position="top-center" />
      <ThemeToggle />
      <header className="history-header">
        <div className="header-content">
          <h1>Prediction History</h1>
          <p>View all your past recommendations</p>
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </header>
      <div className="history-content">
        <div className="filter-tabs">
          <button
            className={`filter-btn${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({predictions.length})
          </button>
          <button
            className={`filter-btn${filter === "crop" ? " active" : ""}`}
            onClick={() => setFilter("crop")}
          >
            Crops ({predictions.filter((p) => p.type === "crop").length})
          </button>
          <button
            className={`filter-btn${filter === "plant" ? " active" : ""}`}
            onClick={() => setFilter("plant")}
          >
            Plants ({predictions.filter((p) => p.type === "plant").length})
          </button>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading history...</p>
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"></span>
            <h3>No predictions yet</h3>
            <p>Start making predictions to see your history here</p>
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
              Make First Prediction
            </button>
          </div>
        ) : (
          <div className="predictions-grid">
            {filteredPredictions.map((prediction) => (
              <div key={prediction.id} className="prediction-card">
                {/* Card content same as your file */}
                <div className="prediction-header">
                  <span className="prediction-type">
                    {prediction.type === "crop" ? "Crop" : "Plant"}
                  </span>
                  <span className="prediction-date">
                    {formatDate(prediction.createdAt)}
                  </span>
                </div>
                <div className="prediction-body">
                  {prediction.type === "crop" ? (
                    <>
                      <h3>{prediction.result.predictedCrop}</h3>
                      <div className="prediction-details">
                        <span>
                          Confidence: {prediction.result.confidence}
                        </span>
                      </div>
                      <div className="input-summary">
                        <small>
                          Temp: {prediction.inputData.temperature}°C | Humidity:{" "}
                          {prediction.inputData.humidity} | pH: {prediction.inputData.ph}
                        </small>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>
                        {prediction.result.plants?.length || 0} Plants Recommended
                      </h3>
                      <div className="plant-names">
                        {(prediction.result.plants || [])
                          .slice(0, 3)
                          .map((plant, idx) => (
                            <span key={idx} className="plant-tag">
                              {plant.icon} {plant.name}
                            </span>
                          ))}
                      </div>
                      <div className="input-summary">
                        <small>
                          Space: {prediction.inputData.space} | Light:{" "}
                          {prediction.inputData.light}
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
