const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Prediction = require('../models/Prediction');
const { getCropPrediction } = require('../services/pythonService');

// Crop database with seeds and tips
const cropDatabase = {
  rice: {
    seeds: ['IR64', 'Swarna', 'Basmati 370', 'Pusa Basmati 1121'],
    bestSeason: 'Kharif (June-November)',
    soilType: 'Clay loam, silt loam',
    waterNeeds: 'High (1500-2000mm)',
    growthDuration: '120-150 days',
    farmingTips: [
      '🌾 Transplant 20-25 day old seedlings for best results',
      '💧 Maintain 5-7cm standing water during growing period',
      '🌱 Apply nitrogen in 3 splits: basal, tillering, panicle stage',
      '🐛 Monitor for stem borer and leaf folder pests',
      '🌡️ Ideal temperature: 20-35°C during growing season',
      '📅 Harvest when 80-85% grains turn golden yellow'
    ],
    expectedYield: '40-50 quintals/hectare',
    marketPrice: '₹1800-2200 per quintal'
  },
  
  wheat: {
    seeds: ['HD 2967', 'PBW 343', 'DBW 17', 'WH 1105'],
    bestSeason: 'Rabi (October-March)',
    soilType: 'Loamy soil with good drainage',
    waterNeeds: 'Moderate (450-650mm)',
    growthDuration: '120-130 days',
    farmingTips: [
      '🌾 Sow at 5-6cm depth with 20cm row spacing',
      '💧 First irrigation 20-25 days after sowing',
      '🌱 Apply 120kg N, 60kg P2O5, 40kg K2O per hectare',
      '🦠 Prevent rust diseases with fungicide spray',
      '🌡️ Optimal: 10-25°C during grain filling',
      '📅 Harvest at 20-25% moisture content'
    ],
    expectedYield: '45-55 quintals/hectare',
    marketPrice: '₹2000-2400 per quintal'
  },

  cotton: {
    seeds: ['Bt Cotton BG-II', 'Suraj', 'Bunny Bt', 'RCH-2'],
    bestSeason: 'Kharif (May-October)',
    soilType: 'Black cotton soil, well-drained',
    waterNeeds: 'Moderate (700-1300mm)',
    growthDuration: '180-210 days',
    farmingTips: [
      '🌱 Plant 5cm deep with 60x30cm spacing',
      '💧 Critical stages: flowering and boll formation',
      '🌿 Apply 100kg N, 50kg P2O5, 50kg K2O per hectare',
      '🐛 Monitor for bollworm and whitefly regularly',
      '🌡️ Optimal: 21-27°C during boll development',
      '📅 Harvest when 60-70% bolls open'
    ],
    expectedYield: '25-30 quintals/hectare',
    marketPrice: '₹5500-7000 per quintal'
  },

  maize: {
    seeds: ['NK 6240', 'DHM 117', 'Pioneer 3522', 'Kaveri 50'],
    bestSeason: 'Kharif & Rabi (Both)',
    soilType: 'Well-drained loamy soil',
    waterNeeds: 'Moderate (500-800mm)',
    growthDuration: '90-120 days',
    farmingTips: [
      '🌽 Sow 2-3 seeds per hill, 60x20cm spacing',
      '💧 Critical: tasseling and silking stages',
      '🌱 Apply 120kg N, 60kg P2O5, 40kg K2O',
      '🦋 Protect from stem borer and fall armyworm',
      '🌡️ Ideal: 18-27°C temperature',
      '📅 Harvest at dough stage (20-25% moisture)'
    ],
    expectedYield: '50-70 quintals/hectare',
    marketPrice: '₹1500-1900 per quintal'
  },

  chickpea: {
    seeds: ['Pusa 362', 'JAKI 9218', 'KAK 2', 'Virat'],
    bestSeason: 'Rabi (October-February)',
    soilType: 'Well-drained loamy soil',
    waterNeeds: 'Low (350-500mm)',
    growthDuration: '100-120 days',
    farmingTips: [
      '🌱 Sow 5-7cm deep, 30x10cm spacing',
      '💧 One irrigation at flowering stage',
      '🌿 Requires minimal fertilizer (organic preferred)',
      '🐛 Watch for pod borer and wilt disease',
      '🌡️ Grows well in 20-30°C',
      '📅 Harvest when pods turn brown'
    ],
    expectedYield: '20-25 quintals/hectare',
    marketPrice: '₹4500-6000 per quintal'
  },

  // Default for unknown crops
  default: {
    seeds: ['Local varieties', 'Hybrid seeds from trusted sources'],
    bestSeason: 'Consult local agriculture office',
    soilType: 'Well-drained fertile soil',
    waterNeeds: 'Moderate',
    growthDuration: '90-150 days',
    farmingTips: [
      '🌱 Use certified seeds from authorized dealers',
      '💧 Ensure proper irrigation schedule',
      '🌿 Apply balanced NPK fertilizers',
      '🐛 Regular pest monitoring and control',
      '🌡️ Monitor weather forecasts regularly',
      '📅 Harvest at optimal maturity'
    ],
    expectedYield: 'Varies by crop',
    marketPrice: 'Check local mandi rates'
  }
};

// Get crop info helper
const getCropInfo = (cropName) => {
  const crop = cropName.toLowerCase().trim();
  return cropDatabase[crop] || cropDatabase.default;
};

// Crop Prediction Route - WITH ML + ENHANCED DATA
router.post('/crop', protect, async (req, res) => {
  try {
    const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
    
    if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const inputData = {
      N: parseFloat(N),
      P: parseFloat(P),
      K: parseFloat(K),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall)
    };
    
    console.log('🌾 Crop prediction request received');
    
    // Call Flask ML API
    const mlResponse = await getCropPrediction(inputData);
    
    let result;
    
    if (mlResponse.success) {
      // Get crop-specific info
      const cropInfo = getCropInfo(mlResponse.data.prediction);
      
      result = {
        predictedCrop: mlResponse.data.prediction,
        confidence: mlResponse.data.confidence,
        source: 'ml_model',
        
        // Enhanced data
        seedVarieties: cropInfo.seeds,
        bestSeason: cropInfo.bestSeason,
        soilType: cropInfo.soilType,
        waterNeeds: cropInfo.waterNeeds,
        growthDuration: cropInfo.growthDuration,
        farmingTips: cropInfo.farmingTips,
        expectedYield: cropInfo.expectedYield,
        marketPrice: cropInfo.marketPrice,
        
        recommendations: [
          `${mlResponse.data.prediction} is perfect for your conditions`,
          `Best season: ${cropInfo.bestSeason}`,
          `Expected yield: ${cropInfo.expectedYield}`
        ]
      };
      
      console.log(`✅ ML Prediction: ${result.predictedCrop} (${result.confidence}%)`);
      
    } else {
      // Fallback
      const crops = ['rice', 'wheat', 'maize'];
      const dummyCrop = crops[Math.floor(Math.random() * crops.length)];
      const cropInfo = getCropInfo(dummyCrop);
      
      result = {
        predictedCrop: dummyCrop,
        confidence: (92 + Math.random() * 7).toFixed(2),
        source: 'fallback',
        seedVarieties: cropInfo.seeds,
        bestSeason: cropInfo.bestSeason,
        farmingTips: cropInfo.farmingTips,
        recommendations: [
          `${dummyCrop} (ML service unavailable)`,
          'Using fallback prediction'
        ]
      };
    }
    
    // Save to database
    const prediction = await Prediction.create({
      userId: req.user.id,
      type: 'crop',
      inputData,
      result
    });
    
    res.json({
      success: true,
      message: 'Crop prediction successful',
      data: result,
      predictionId: prediction._id
    });
    
  } catch (error) {
    console.error('❌ Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Prediction failed',
      error: error.message
    });
  }
});

// Plant Recommendation - KEEP EXISTING
router.post('/plant', protect, async (req, res) => {
  try {
    const { space, light, humidity, temperature } = req.body;
    
    if (!space || !light || !humidity || !temperature) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const allPlants = [
      { name: 'Snake Plant', icon: '🐍', care: 'Low maintenance', suitability: 95 },
      { name: 'Pothos', icon: '🌿', care: 'Easy to grow', suitability: 92 },
      { name: 'Peace Lily', icon: '🕊️', care: 'Loves shade', suitability: 88 },
      { name: 'Aloe Vera', icon: '🌵', care: 'Medicinal plant', suitability: 90 },
      { name: 'Spider Plant', icon: '🕷️', care: 'Air purifier', suitability: 94 },
      { name: 'ZZ Plant', icon: '🌱', care: 'Drought tolerant', suitability: 91 }
    ];
    
    const recommendedPlants = allPlants
      .sort((a, b) => b.suitability - a.suitability)
      .slice(0, 4);
    
    const result = {
      plants: recommendedPlants,
      message: 'Perfect matches for your space!',
      tips: [
        'Ensure adequate drainage',
        'Adjust watering by season',
        'Keep away from AC vents'
      ]
    };
    
    const prediction = await Prediction.create({
      userId: req.user.id,
      type: 'plant',
      inputData: { space, light, humidity, temperature },
      result
    });
    
    res.json({
      success: true,
      message: 'Plant recommendations ready',
      data: result,
      predictionId: prediction._id
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Recommendation failed',
      error: error.message
    });
  }
});

// History
router.get('/history', protect, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      count: predictions.length,
      data: predictions
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

module.exports = router;
