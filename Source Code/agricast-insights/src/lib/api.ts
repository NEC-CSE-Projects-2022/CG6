// API Service for AgriCastNet Flask Backend
// Configure your Flask backend URL here

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PredictionInput {
  temperature: number;
  humidity: number;
  co2: number;
  soil_moisture: number;
}

export interface PredictionResult {
  status: string;
  risk_score: number;
  risk_label: 'Low' | 'Moderate' | 'High';
  predictions: HourlyPrediction[];
  recommendations: string[];
  report_url?: string;
  metrics?: MetricData;
}

export interface HourlyPrediction {
  hour: number;
  temperature: number;
  humidity: number;
  co2: number;
  soil_moisture: number;
}

export interface MetricData {
  temperature: { min: number; max: number; avg: number; trend: 'up' | 'down' | 'stable' };
  humidity: { min: number; max: number; avg: number; trend: 'up' | 'down' | 'stable' };
  co2: { min: number; max: number; avg: number; trend: 'up' | 'down' | 'stable' };
  soil_moisture: { min: number; max: number; avg: number; trend: 'up' | 'down' | 'stable' };
}

// Validation rules based on requirements
export const VALIDATION_RULES = {
  temperature: { min: -10, max: 60, unit: '°C' },
  humidity: { min: 0, max: 100, unit: '%' },
  co2: { min: 250, max: 5000, unit: 'ppm' },
  soil_moisture: { min: 0, max: 100, unit: '%' },
};

export const validateInput = (input: PredictionInput): string[] => {
  const errors: string[] = [];

  if (input.temperature < VALIDATION_RULES.temperature.min || input.temperature > VALIDATION_RULES.temperature.max) {
    errors.push(`Temperature must be between ${VALIDATION_RULES.temperature.min}°C and ${VALIDATION_RULES.temperature.max}°C`);
  }
  if (input.humidity < VALIDATION_RULES.humidity.min || input.humidity > VALIDATION_RULES.humidity.max) {
    errors.push(`Humidity must be between ${VALIDATION_RULES.humidity.min}% and ${VALIDATION_RULES.humidity.max}%`);
  }
  if (input.co2 < VALIDATION_RULES.co2.min || input.co2 > VALIDATION_RULES.co2.max) {
    errors.push(`CO₂ must be between ${VALIDATION_RULES.co2.min} ppm and ${VALIDATION_RULES.co2.max} ppm`);
  }
  if (input.soil_moisture < VALIDATION_RULES.soil_moisture.min || input.soil_moisture > VALIDATION_RULES.soil_moisture.max) {
    errors.push(`Soil moisture must be between ${VALIDATION_RULES.soil_moisture.min}% and ${VALIDATION_RULES.soil_moisture.max}%`);
  }

  return errors;
};

// Mock prediction function for demo purposes
// Replace with actual API call when Flask backend is ready
export const predictFromInput = async (input: PredictionInput): Promise<PredictionResult> => {
  // Validate input
  const errors = validateInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join('. '));
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock predictions based on input
  const riskScore = calculateMockRiskScore(input);
  const predictions = generateMockPredictions(input);
  
  return {
    status: 'ok',
    risk_score: riskScore,
    risk_label: riskScore < 33 ? 'Low' : riskScore < 66 ? 'Moderate' : 'High',
    predictions,
    recommendations: generateRecommendations(input, riskScore),
    report_url: `/api/report/${Date.now()}`,
    metrics: {
      temperature: { min: input.temperature - 3, max: input.temperature + 5, avg: input.temperature + 1, trend: 'stable' },
      humidity: { min: input.humidity - 5, max: input.humidity + 8, avg: input.humidity + 2, trend: 'up' },
      co2: { min: input.co2 - 50, max: input.co2 + 100, avg: input.co2 + 25, trend: 'up' },
      soil_moisture: { min: input.soil_moisture - 10, max: input.soil_moisture + 5, avg: input.soil_moisture - 2, trend: 'down' },
    },
  };
};

export const predictFromCSV = async (file: File): Promise<PredictionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Mock CSV processing result
  return {
    status: 'ok',
    risk_score: 42,
    risk_label: 'Moderate',
    predictions: generateMockPredictions({ temperature: 25, humidity: 65, co2: 800, soil_moisture: 45 }),
    recommendations: [
      'Batch analysis complete: 24 data points processed',
      'Average conditions are within acceptable range',
      'Consider increasing ventilation during peak CO₂ hours',
      'Soil moisture shows declining trend - schedule irrigation',
    ],
    report_url: `/api/report/${Date.now()}`,
    metrics: {
      temperature: { min: 18, max: 32, avg: 25, trend: 'stable' },
      humidity: { min: 55, max: 78, avg: 65, trend: 'up' },
      co2: { min: 600, max: 1200, avg: 850, trend: 'up' },
      soil_moisture: { min: 35, max: 55, avg: 45, trend: 'down' },
    },
  };
};

// Helper functions
const calculateMockRiskScore = (input: PredictionInput): number => {
  let score = 0;
  
  // Temperature scoring
  if (input.temperature < 15 || input.temperature > 35) score += 25;
  else if (input.temperature < 20 || input.temperature > 30) score += 10;
  
  // Humidity scoring
  if (input.humidity < 40 || input.humidity > 80) score += 25;
  else if (input.humidity < 50 || input.humidity > 70) score += 10;
  
  // CO2 scoring
  if (input.co2 > 2000) score += 25;
  else if (input.co2 > 1200) score += 15;
  else if (input.co2 < 400) score += 10;
  
  // Soil moisture scoring
  if (input.soil_moisture < 20 || input.soil_moisture > 80) score += 25;
  else if (input.soil_moisture < 30 || input.soil_moisture > 70) score += 10;

  return Math.min(100, Math.max(0, score));
};

const generateMockPredictions = (input: PredictionInput): HourlyPrediction[] => {
  const predictions: HourlyPrediction[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const timeVariation = Math.sin((hour / 24) * Math.PI * 2);
    predictions.push({
      hour,
      temperature: input.temperature + timeVariation * 4 + (Math.random() - 0.5) * 2,
      humidity: input.humidity + timeVariation * 8 + (Math.random() - 0.5) * 5,
      co2: input.co2 + (hour > 8 && hour < 18 ? 100 : -50) + (Math.random() - 0.5) * 50,
      soil_moisture: input.soil_moisture - hour * 0.3 + (Math.random() - 0.5) * 2,
    });
  }
  
  return predictions;
};

const generateRecommendations = (input: PredictionInput, riskScore: number): string[] => {
  const recommendations: string[] = [];

  if (input.temperature > 30) {
    recommendations.push('🌡️ Temperature is high - activate cooling systems or increase ventilation');
  } else if (input.temperature < 18) {
    recommendations.push('🌡️ Temperature is low - consider heating to optimize plant growth');
  }

  if (input.humidity > 75) {
    recommendations.push('💧 High humidity detected - improve air circulation to prevent fungal growth');
  } else if (input.humidity < 45) {
    recommendations.push('💧 Low humidity - activate misting system or humidifier');
  }

  if (input.co2 > 1500) {
    recommendations.push('🌬️ CO₂ levels elevated - increase ventilation for fresh air exchange');
  } else if (input.co2 < 400) {
    recommendations.push('🌬️ CO₂ levels low - consider CO₂ enrichment for enhanced photosynthesis');
  }

  if (input.soil_moisture < 30) {
    recommendations.push('🌱 Soil moisture critical - schedule immediate irrigation');
  } else if (input.soil_moisture > 70) {
    recommendations.push('🌱 Soil moisture high - reduce watering to prevent root rot');
  }

  if (riskScore < 20) {
    recommendations.push('✅ Overall conditions are optimal - maintain current settings');
  } else if (riskScore >= 66) {
    recommendations.push('⚠️ High risk detected - immediate attention required');
  }

  return recommendations.length > 0 ? recommendations : ['✅ All parameters within optimal range'];
};

// Actual API call function (use when Flask backend is ready)
export const apiPredict = async (input: PredictionInput): Promise<PredictionResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Prediction failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const apiPredictCSV = async (file: File): Promise<PredictionResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'CSV prediction failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const downloadReport = async (reportId: string): Promise<void> => {
  const url = `${API_BASE_URL}/api/report/${reportId}`;
  window.open(url, '_blank');
};
