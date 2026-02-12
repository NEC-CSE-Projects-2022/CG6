import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetricRangeChart from '@/components/charts/MetricRangeChart';
import PredictionChart from '@/components/charts/PredictionChart';
import type { PredictionResult, HourlyPrediction } from '@/lib/api';

type MetricStats = {
  min: number;
  max: number;
  avg: number;
  trend: string;
};

const metricConfig = {
  temperature: {
    title: 'Temperature',
    icon: Thermometer,
    unit: '°C',
    optimalMin: 20,
    optimalMax: 28,
    warningMin: 10,
    warningMax: 35,
    min: 0,
    max: 50,
  },
  humidity: {
    title: 'Humidity',
    icon: Droplets,
    unit: '%',
    optimalMin: 50,
    optimalMax: 70,
    warningMin: 35,
    warningMax: 85,
    min: 0,
    max: 100,
  },
  co2: {
    title: 'CO₂ Level',
    icon: Wind,
    unit: 'ppm',
    optimalMin: 600,
    optimalMax: 1200,
    warningMin: 400,
    warningMax: 2000,
    min: 300,
    max: 2500,
  },
  soil_moisture: {
    title: 'Soil Moisture',
    icon: Leaf,
    unit: '%',
    optimalMin: 40,
    optimalMax: 60,
    warningMin: 25,
    warningMax: 75,
    min: 0,
    max: 100,
  },
} as const;

const Metrics = () => {
  const [predictions, setPredictions] = useState<HourlyPrediction[]>([]);
  const [metrics, setMetrics] = useState<Record<string, MetricStats>>({});
  const [riskLabel, setRiskLabel] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [confidence, setConfidence] = useState(100);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('predictionResult');

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const result: PredictionResult = JSON.parse(stored);

      if (Array.isArray(result?.predictions)) {
        setPredictions(result.predictions);
      }

      if (result?.metrics) {
        setMetrics(result.metrics as unknown as Record<string, MetricStats>);
      }

      setRiskLabel(result.risk_label || 'Low');
      setConfidence(result.confidence || 100);
      setRecommendations(result.recommendations || []);
    } catch (err) {
      console.error('Error parsing prediction result:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const riskStyles = {
    Low: 'bg-green-100 text-green-700 border-green-300',
    Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    High: 'bg-red-100 text-red-700 border-red-300',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container-width px-4 md:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/predict">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              AgriCastNet <span className="text-green-600">Forecast Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              24-Hour Deep Learning Microclimate Forecast
            </p>
          </div>
        </div>

        {/* Risk Banner */}
        <div className={`p-5 rounded-2xl border mb-8 ${riskStyles[riskLabel]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {riskLabel === 'Low' ? <ShieldCheck /> : <AlertTriangle />}
              <div>
                <p className="font-semibold text-lg">Risk Level: {riskLabel}</p>
                <p className="text-sm">Model Confidence: {confidence}%</p>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 opacity-40" />
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">
              AI Recommendations 🌱
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {recommendations.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {Object.entries(metricConfig).map(([key, config]) => {
            const stat = metrics[key];
            if (!stat) return null;

            return (
              <MetricRangeChart
                key={key}
                title={`${config.title} (${stat.trend})`}
                value={stat.avg}
                unit={config.unit}
                optimalMin={config.optimalMin}
                optimalMax={config.optimalMax}
                warningMin={config.warningMin}
                warningMax={config.warningMax}
                min={config.min}
                max={config.max}
              />
            );
          })}
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-xl mb-6">
            24-Hour Forecast Trend
          </h2>
          <PredictionChart data={predictions} />
        </div>

      </div>
    </div>
  );
};

export default Metrics;
