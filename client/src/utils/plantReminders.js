// Plant watering reminder utilities

// Plant care schedules
const plantCareData = {
  'Snake Plant': {
    wateringFrequency: 'Every 14 days',
    wateringAmount: '200-300ml',
    careTips: [
      '💧 Water when top 2 inches of soil are dry',
      '☀️ Thrives in indirect light',
      '🌡️ Comfortable in 15-30°C',
      '🪴 Drought-tolerant, avoid overwatering'
    ]
  },
  'Pothos': {
    wateringFrequency: 'Every 7 days',
    wateringAmount: '300-400ml',
    careTips: [
      '💧 Water when top inch is dry',
      '☀️ Grows well in low to bright indirect light',
      '🌿 Trim regularly for bushier growth',
      '🪴 Very forgiving plant for beginners'
    ]
  },
  'Peace Lily': {
    wateringFrequency: 'Every 5-7 days',
    wateringAmount: '300-500ml',
    careTips: [
      '💧 Water when leaves start to droop slightly',
      '☀️ Prefers shade to partial shade',
      '🌸 Blooms best with consistent moisture',
      '🪴 Sensitive to chlorine - use filtered water'
    ]
  },
  // Default for unknown plants
  default: {
    wateringFrequency: 'Every 7-10 days',
    wateringAmount: '200-400ml',
    careTips: [
      '💧 Check soil moisture before watering',
      '☀️ Most plants prefer indirect sunlight',
      '🌡️ Keep away from extreme temperatures',
      '🪴 Ensure good drainage in pots'
    ]
  }
};

// Get plant care info
export const getPlantCareInfo = (plantName) => {
  return plantCareData[plantName] || plantCareData.default;
};

// Water reminder notification
export const scheduleWaterReminder = (plantName, enabled = true) => {
  const careData = getPlantCareInfo(plantName);
  
  if (!enabled) {
    // Remove reminder
    localStorage.removeItem(`reminder_${plantName}`);
    return { success: true, message: 'Reminder disabled' };
  }
  
  // Calculate next watering date
  const daysMap = {
    'Every 5-7 days': 6,
    'Every 7 days': 7,
    'Every 7-10 days': 8,
    'Every 14 days': 14
  };
  
  const days = daysMap[careData.wateringFrequency] || 7;
  const nextWatering = new Date();
  nextWatering.setDate(nextWatering.getDate() + days);
  
  // Save to localStorage
  const reminderData = {
    plantName,
    nextWatering: nextWatering.toISOString(),
    frequency: careData.wateringFrequency,
    amount: careData.wateringAmount,
    enabled: true
  };
  
  localStorage.setItem(`reminder_${plantName}`, JSON.stringify(reminderData));
  
  return {
    success: true,
    message: `Reminder set for ${plantName}`,
    nextWatering: nextWatering.toLocaleDateString()
  };
};

// Check if watering is due
export const checkWateringDue = () => {
  const reminders = [];
  
  // Check all reminders in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('reminder_')) {
      const data = JSON.parse(localStorage.getItem(key));
      const dueDate = new Date(data.nextWatering);
      const today = new Date();
      
      if (dueDate <= today) {
        reminders.push({
          plantName: data.plantName,
          overdue: true,
          amount: data.amount
        });
      }
    }
  }
  
  return reminders;
};

// Browser notification (if permitted)
export const sendBrowserNotification = (plantName) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('💧 Plant Watering Reminder', {
      body: `Time to water your ${plantName}!`,
      icon: '🪴',
      badge: '💧'
    });
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};
