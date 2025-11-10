import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

// Translation data
const translations = {
  en: {
    // Home Page
    home: {
      title: "Smart Crop & Plant",
      subtitle: "Recommendation System",
      description: "Get AI-powered recommendations for your farm and home garden based on environmental conditions",
      getStarted: "Get Started",
      login: "Login",
      whyChoose: "Why Choose Us?",
      cropRec: "Crop Recommendations",
      cropDesc: "Get accurate crop suggestions based on soil & climate data",
      plantRec: "Home Plants",
      plantDesc: "Find perfect indoor plants for your space & environment",
      aiPowered: "AI-Powered",
      aiDesc: "Advanced machine learning for precise predictions"
    },
    // Dashboard
    dashboard: {
      welcome: "Welcome back",
      subtitle: "Get personalized recommendations for your farm and garden",
      profile: "Profile",
      history: "History",
      settings: "Settings",
      logout: "Logout",
      cropTab: "Crop Recommendation",
      plantTab: "Home Plant Recommendation"
    },
    // Forms
    form: {
      temperature: "Temperature",
      humidity: "Humidity",
      soilPh: "Soil pH",
      rainfall: "Rainfall",
      getRecommendation: "Get Recommendation",
      reset: "Reset",
      analyzing: "Analyzing",
      recommendedCrop: "Recommended Crop",
      confidence: "Confidence"
    },
    // Settings
    settings: {
      title: "Settings & Preferences",
      subtitle: "Customize your experience",
      backToDashboard: "Back to Dashboard",
      theme: "Theme & Appearance",
      themeDesc: "Customize how the app looks",
      notifications: "Notifications",
      notifDesc: "Control how you receive notifications",
      language: "Language & Region",
      langDesc: "Localization preferences",
      privacy: "Privacy & Data",
      privacyDesc: "Manage your data and privacy",
      saveChanges: "Save All Changes",
      changesSaved: "Settings saved successfully!"
    }
  },
  hi: {
    // Home Page
    home: {
      title: "स्मार्ट फसल और पौधे",
      subtitle: "सिफारिश प्रणाली",
      description: "पर्यावरणीय परिस्थितियों के आधार पर अपने खेत और घर के बगीचे के लिए एआई-संचालित सिफारिशें प्राप्त करें",
      getStarted: "शुरू करें",
      login: "लॉगिन",
      whyChoose: "हमें क्यों चुनें?",
      cropRec: "फसल सिफारिशें",
      cropDesc: "मिट्टी और जलवायु डेटा के आधार पर सटीक फसल सुझाव प्राप्त करें",
      plantRec: "घरेलू पौधे",
      plantDesc: "अपने स्थान और वातावरण के लिए सही इनडोर पौधे खोजें",
      aiPowered: "एआई-संचालित",
      aiDesc: "सटीक भविष्यवाणियों के लिए उन्नत मशीन लर्निंग"
    },
    // Dashboard
    dashboard: {
      welcome: "वापसी पर स्वागत है",
      subtitle: "अपने खेत और बगीचे के लिए व्यक्तिगत सिफारिशें प्राप्त करें",
      profile: "प्रोफ़ाइल",
      history: "इतिहास",
      settings: "सेटिंग्स",
      logout: "लॉग आउट",
      cropTab: "फसल सिफारिश",
      plantTab: "घरेलू पौधा सिफारिश"
    },
    // Forms
    form: {
      temperature: "तापमान",
      humidity: "आर्द्रता",
      soilPh: "मिट्टी का pH",
      rainfall: "वर्षा",
      getRecommendation: "सिफारिश प्राप्त करें",
      reset: "रीसेट",
      analyzing: "विश्लेषण कर रहे हैं",
      recommendedCrop: "अनुशंसित फसल",
      confidence: "विश्वास"
    },
    // Settings
    settings: {
      title: "सेटिंग्स और प्राथमिकताएं",
      subtitle: "अपने अनुभव को अनुकूलित करें",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      theme: "थीम और उपस्थिति",
      themeDesc: "ऐप का रूप अनुकूलित करें",
      notifications: "सूचनाएं",
      notifDesc: "सूचनाएं कैसे प्राप्त करें नियंत्रित करें",
      language: "भाषा और क्षेत्र",
      langDesc: "स्थानीयकरण प्राथमिकताएं",
      privacy: "गोपनीयता और डेटा",
      privacyDesc: "अपना डेटा और गोपनीयता प्रबंधित करें",
      saveChanges: "सभी परिवर्तन सहेजें",
      changesSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
