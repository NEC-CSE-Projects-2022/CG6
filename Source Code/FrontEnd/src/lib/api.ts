// =====================================================
// AgriCastNet API Service
// Clean Multivariate Forecasting (24h / 7d Ready)
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// INPUT TYPES
// =====================================================

export interface PredictionInput {
  temperature: number;
  humidity: number;
  co2: number;
  soil_moisture: number;
}

// =====================================================
// FORECAST TYPES
// =====================================================

export interface HourlyPrediction {
  hour: number;
  temperature: number;
  humidity: number;
  co2: number;
  soil_moisture: number;
}

export interface MetricSummary {
  min: number;
  max: number;
  avg: number;
  trend: "up" | "down" | "stable";
}

export interface MetricData {
  temperature: MetricSummary;
  humidity: MetricSummary;
  co2: MetricSummary;
  soil_moisture: MetricSummary;
}

export interface ErrorMetrics {
  mae: number;
  rmse: number;
  mse: number;
  r2: number;
}

export interface PredictionResult {
  success: boolean;

  // Forecast
  predictions: HourlyPrediction[];

  // Analytics
  metrics: MetricData;
  error_metrics: ErrorMetrics;

  // Risk intelligence
  risk_score: number;
  risk_label: "Low" | "Moderate" | "High";
  confidence: number;

  // Decision support
  recommendations: string[];
  greenhouse_suitable: boolean;
}

// =====================================================
// INPUT VALIDATION
// =====================================================

export const VALIDATION_RULES = {
  temperature: { min: -10, max: 60, unit: "°C" },
  humidity: { min: 0, max: 100, unit: "%" },
  co2: { min: 250, max: 5000, unit: "ppm" },
  soil_moisture: { min: 0, max: 100, unit: "%" },
};

export const validateInput = (input: PredictionInput): string[] => {
  const errors: string[] = [];

  if (
    input.temperature < VALIDATION_RULES.temperature.min ||
    input.temperature > VALIDATION_RULES.temperature.max
  )
    errors.push(
      `Temperature must be between ${VALIDATION_RULES.temperature.min}°C and ${VALIDATION_RULES.temperature.max}°C`
    );

  if (
    input.humidity < VALIDATION_RULES.humidity.min ||
    input.humidity > VALIDATION_RULES.humidity.max
  )
    errors.push(
      `Humidity must be between ${VALIDATION_RULES.humidity.min}% and ${VALIDATION_RULES.humidity.max}%`
    );

  if (
    input.co2 < VALIDATION_RULES.co2.min ||
    input.co2 > VALIDATION_RULES.co2.max
  )
    errors.push(
      `CO₂ must be between ${VALIDATION_RULES.co2.min} ppm and ${VALIDATION_RULES.co2.max} ppm`
    );

  if (
    input.soil_moisture < VALIDATION_RULES.soil_moisture.min ||
    input.soil_moisture > VALIDATION_RULES.soil_moisture.max
  )
    errors.push(
      `Soil moisture must be between ${VALIDATION_RULES.soil_moisture.min}% and ${VALIDATION_RULES.soil_moisture.max}%`
    );

  return errors;
};

// =====================================================
// CORE REQUEST HELPER
// =====================================================

const handleResponse = async (
  res: Response
): Promise<PredictionResult> => {
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Prediction failed");
  }

  return data as PredictionResult;
};

// =====================================================
// MANUAL INPUT PREDICTION
// =====================================================

export const predictFromInput = async (
  input: PredictionInput
): Promise<PredictionResult> => {
  const errors = validateInput(input);
  if (errors.length) throw new Error(errors.join(". "));

  const res = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return handleResponse(res);
};

// =====================================================
// CSV PREDICTION (Batch Forecast)
// =====================================================

export const predictFromCSV = async (
  file: File
): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/predict_csv`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res);
};

// =====================================================
// REPORT DOWNLOAD
// =====================================================

export const downloadReport = (reportId: string) => {
  window.open(`${API_BASE_URL}/api/report/${reportId}`, "_blank");
};
