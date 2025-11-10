# 🌾 Smart Crop & Plant Recommendation System

An AI-powered MERN stack application with Python Machine Learning integration for intelligent crop recommendations and home plant suggestions with automated watering reminders.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.15.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![Flask](https://img.shields.io/badge/Flask-3.0.0-black)
![License](https://img.shields.io/badge/License-MIT-orange)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Machine Learning Model](#-machine-learning-model)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🌾 Crop Recommendation System
- **AI-Powered Predictions** - Random Forest ML model with 95-99% accuracy
- **Smart Analysis** - Based on 7 parameters (NPK, Temperature, Humidity, pH, Rainfall)
- **Seed Varieties** - 4 recommended seed types for each crop
- **Expert Farming Tips** - 6 detailed cultivation guidelines per crop
- **Comprehensive Info** - Best season, growth duration, water needs, expected yield, market price
- **22+ Crops Database** - Rice, Wheat, Cotton, Maize, Chickpea, and more

### 🪴 Home Plant Recommendation
- **Personalized Suggestions** - Based on space, light, humidity, and temperature
- **6 Popular Plants** - Snake Plant, Pothos, Peace Lily, Aloe Vera, Spider Plant, ZZ Plant
- **Care Instructions** - Detailed care tips for each plant
- **Watering Schedule** - Frequency and amount recommendations
- **💧 Smart Water Reminders**:
  - Set custom reminders for each plant
  - Auto-calculation of next watering date
  - Persistent storage (localStorage)
  - Overdue notifications
  - On/Off toggle per plant

### 🎨 User Experience
- **Dark/Light Theme** - Auto-detect system preference + manual toggle
- **Multi-Language** - English & Hindi (हिंदी) support
- **Responsive Design** - Mobile-first with hamburger menu
- **Beautiful Animations** - Smooth transitions and micro-interactions
- **Toast Notifications** - Real-time feedback with customization

### 🔐 User Management
- **JWT Authentication** - Secure token-based auth
- **User Dashboard** - Personalized welcome with statistics
- **Prediction History** - Save and view all past recommendations
- **User Profile** - Stats display (total predictions, accuracy rate)
- **Settings Panel** - 6 categories with 20+ customizable options

### ⚙️ Advanced Settings
- **Theme Preferences** - Dark/Light/Auto mode
- **Notification Control** - Position, duration, sound, enable/disable
- **Language & Region** - Language, date format, currency
- **Prediction Options** - Plant count, confidence display, auto-save
- **Privacy** - Export data, clear history, delete account
- **Account Security** - Change password with validation

---

## 🛠 Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.x - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** 22.15.0 - Runtime
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** 8.0.0 - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

### Machine Learning
- **Python** 3.11 - ML runtime
- **Flask** 3.0.0 - API framework
- **scikit-learn** 1.4.0 - ML library
- **pandas** 2.1.4 - Data processing
- **numpy** 1.26.4 - Numerical computing
- **Random Forest** - Classification algorithm

### DevOps
- **Git** - Version control
- **npm** - Package management
- **conda** - Python environment
- **nodemon** - Auto-reload
- **CORS** - Cross-origin support

---

## 🏗 Project Architecture

┌─────────────────┐
│ React App │ Port 3000
│ (Frontend) │
└────────┬────────┘
│ HTTP/Axios
↓
┌─────────────────┐
│ Node.js + │ Port 5000
│ Express │
│ (Backend) │
└────────┬────────┘
│
├─────────────→ MongoDB Atlas (Database)
│
└─────────────→ ┌─────────────────┐
│ Flask API │ Port 5001
│ (ML Service) │
└────────┬────────┘
│
↓
┌─────────────────┐
│ Random Forest │
│ ML Model (.pkl)│
└─────────────────┘