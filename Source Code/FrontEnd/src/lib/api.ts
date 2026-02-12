// API Service for AgriCastNet Flask Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PredictionInput {
  temperature: number;
  humidity: number;
  co2: number;
  soil_moisture: number;
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

export interface PredictionResult {
  success: boolean;
  predicted_temperature: number;
  predicted_humidity: number;
  predicted_co2: number;
  predicted_radiation: number;
  predicted_wind: number;
  predicted_soil: number;
  risk_score: number;
  risk_label: 'Low' | 'Moderate' | 'High';
  confidence: number;
  auto_action: string;
  anomaly: boolean;
  recommendations: string[];
  greenhouse_suitable: boolean;
  metrics?: MetricData;
  predictions?: HourlyPrediction[];
}

// -------------------------
// Input Validation
// -------------------------
export const VALIDATION_RULES = {
  temperature: { min: -10, max: 60, unit: '°C' },
  humidity: { min: 0, max: 100, unit: '%' },
  co2: { min: 250, max: 5000, unit: 'ppm' },
  soil_moisture: { min: 0, max: 100, unit: '%' },
};

export const validateInput = (input: PredictionInput): string[] => {
  const errors: string[] = [];

  if (input.temperature < VALIDATION_RULES.temperature.min || input.temperature > VALIDATION_RULES.temperature.max)
    errors.push(`Temperature must be between ${VALIDATION_RULES.temperature.min}°C and ${VALIDATION_RULES.temperature.max}°C`);

  if (input.humidity < VALIDATION_RULES.humidity.min || input.humidity > VALIDATION_RULES.humidity.max)
    errors.push(`Humidity must be between ${VALIDATION_RULES.humidity.min}% and ${VALIDATION_RULES.humidity.max}%`);

  if (input.co2 < VALIDATION_RULES.co2.min || input.co2 > VALIDATION_RULES.co2.max)
    errors.push(`CO₂ must be between ${VALIDATION_RULES.co2.min} ppm and ${VALIDATION_RULES.co2.max} ppm`);

  if (input.soil_moisture < VALIDATION_RULES.soil_moisture.min || input.soil_moisture > VALIDATION_RULES.soil_moisture.max)
    errors.push(`Soil moisture must be between ${VALIDATION_RULES.soil_moisture.min}% and ${VALIDATION_RULES.soil_moisture.max}%`);

  return errors;
};

// -------------------------
// Manual Input Prediction
// -------------------------
export const predictFromInput = async (input: PredictionInput): Promise<PredictionResult> => {
  const errors = validateInput(input);
  if (errors.length) throw new Error(errors.join('. '));

  const res = await fetch(`${API_BASE_URL}/api/predict`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    temperature: input.temperature,
    humidity: input.humidity,
    co2: input.co2,
    soil_moisture: input.soil_moisture,
  }),
});

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Prediction failed');

  // Map Flask response → PredictionResult
  return {
    success: true,
    predicted_temperature: data.predicted_temperature,
    predicted_humidity: data.predicted_humidity,
    predicted_co2: data.predicted_co2,
    predicted_radiation: data.predicted_radiation,
    predicted_wind: data.predicted_wind,
    predicted_soil: data.predicted_soil,
    risk_score: data.risk_score,
    risk_label: data.risk_label,
    confidence: data.confidence,
    auto_action: data.auto_action,
    anomaly: data.anomaly,
    recommendations: data.recommendations,
    greenhouse_suitable: data.greenhouse_suitable,
  };
};

// -------------------------
// CSV Prediction
// -------------------------
// -------------------------
// CSV Prediction
// -------------------------
export const predictFromCSV = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/predict_csv`, { 
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  // ⚡ No extra validation here, trust backend
  if (!res.ok || !data.success) throw new Error(data.error || 'CSV prediction failed');

  return {
    success: true,
    predicted_temperature: data.predicted_temperature,
    predicted_humidity: data.predicted_humidity,  // backend sets this
    predicted_co2: data.predicted_co2,
    predicted_radiation: data.predicted_radiation,
    predicted_wind: data.predicted_wind,
    predicted_soil: data.predicted_soil,
    risk_score: data.risk_score,
    risk_label: data.risk_label,
    confidence: data.confidence,
    auto_action: data.auto_action,
    anomaly: data.anomaly,
    recommendations: data.recommendations,
    greenhouse_suitable: data.greenhouse_suitable,
  };
};


// -------------------------
// Report Download
// -------------------------
export const downloadReport = (reportId: string) => {
  window.open(`${API_BASE_URL}/api/report/${reportId}`, '_blank');
};
