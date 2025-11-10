// Crop-specific data: seeds, tips, season, yield info

const cropDatabase = {
  rice: {
    seeds: ['IR64', 'Swarna', 'Basmati 370', 'Pusa Basmati'],
    bestSeason: 'Kharif (June-November)',
    soilType: 'Clay loam, silt loam',
    waterNeeds: 'High (1500-2000mm)',
    growthDuration: '120-150 days',
    farmingTips: [
      '🌾 Transplant 20-25 day old seedlings for best results',
      '💧 Maintain 5-7cm standing water in field during growing period',
      '🌱 Apply nitrogen in 3 splits: basal, tillering, and panicle stage',
      '🐛 Monitor for pests like stem borer and leaf folder',
      '🌡️ Ideal temperature: 20-35°C during growing season',
      '📅 Harvest when 80-85% grains turn golden yellow'
    ],
    expectedYield: '40-50 quintals per hectare',
    marketPrice: '₹1800-2200 per quintal'
  },
  
  wheat: {
    seeds: ['HD 2967', 'PBW 343', 'DBW 17', 'WH 1105'],
    bestSeason: 'Rabi (October-March)',
    soilType: 'Loamy soil with good drainage',
    waterNeeds: 'Moderate (450-650mm)',
    growthDuration: '120-130 days',
    farmingTips: [
      '🌾 Sow seeds at 5-6cm depth with 20cm row spacing',
      '💧 First irrigation 20-25 days after sowing (Crown Root stage)',
      '🌱 Apply 120kg N, 60kg P2O5, 40kg K2O per hectare',
      '🦠 Prevent rust diseases with proper fungicide spray',
      '🌡️ Ideal temperature: 10-25°C during grain filling',
      '📅 Harvest when moisture content drops to 20-25%'
    ],
    expectedYield: '45-55 quintals per hectare',
    marketPrice: '₹2000-2400 per quintal'
  },

  cotton: {
    seeds: ['Bt Cotton (BG-II)', 'Suraj', 'Bunny Bt', 'RCH-2'],
    bestSeason: 'Kharif (May-October)',
    soilType: 'Black cotton soil, well-drained',
    waterNeeds: 'Moderate (700-1300mm)',
    growthDuration: '180-210 days',
    farmingTips: [
      '🌱 Plant seeds 5cm deep with 60x30cm spacing',
      '💧 Critical irrigation stages: flowering and boll formation',
      '🌿 Apply 100kg N, 50kg P2O5, 50kg K2O per hectare',
      '🐛 Regular monitoring for bollworm and whitefly',
      '🌡️ Optimal temperature: 21-27°C during boll development',
      '📅 Harvest when 60-70% bolls are open'
    ],
    expectedYield: '25-30 quintals per hectare',
    marketPrice: '₹5500-7000 per quintal'
  },

  maize: {
    seeds: ['NK 6240', 'DHM 117', 'Pioneer 3522', 'Kaveri 50'],
    bestSeason: 'Kharif & Rabi (Both seasons)',
    soilType: 'Well-drained loamy soil',
    waterNeeds: 'Moderate (500-800mm)',
    growthDuration: '90-120 days',
    farmingTips: [
      '🌽 Sow 2-3 seeds per hill at 60x20cm spacing',
      '💧 Critical watering: tasseling and silking stages',
      '🌱 Apply 120kg N, 60kg P2O5, 40kg K2O per hectare',
      '🦋 Protect from stem borer and fall armyworm',
      '🌡️ Ideal temperature: 18-27°C',
      '📅 Harvest when kernels reach dough stage (20-25% moisture)'
    ],
    expectedYield: '50-70 quintals per hectare',
    marketPrice: '₹1500-1900 per quintal'
  },

  // Add more crops as needed
  default: {
    seeds: ['Local varieties', 'Hybrid seeds'],
    bestSeason: 'Consult local agriculture office',
    soilType: 'Well-drained fertile soil',
    waterNeeds: 'Moderate',
    growthDuration: '90-150 days',
    farmingTips: [
      '🌱 Use certified seeds from trusted sources',
      '💧 Ensure proper irrigation based on crop needs',
      '🌿 Apply organic manure for better soil health',
      '🐛 Regular pest and disease monitoring',
      '🌡️ Monitor weather conditions regularly',
      '📅 Harvest at optimal maturity for best quality'
    ],
    expectedYield: 'Varies by crop',
    marketPrice: 'Check local mandi rates'
  }
};

// Get crop information
const getCropInfo = (cropName) => {
  const crop = cropName.toLowerCase().trim();
  return cropDatabase[crop] || cropDatabase.default;
};

module.exports = { cropDatabase, getCropInfo };
