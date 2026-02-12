import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import RiskGauge from '@/components/ui/RiskGauge';
import MetricCard from '@/components/ui/MetricCard';
import PredictionChart from '@/components/charts/PredictionChart';
import { useToast } from '@/hooks/use-toast';
import type { PredictionResult } from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const Results = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'temperature',
    'humidity',
    'co2',
    'soil_moisture',
  ]);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = sessionStorage.getItem('predictionResult');
    if (!stored) {
      navigate('/predict');
      return;
    }

    try {
      const parsed: PredictionResult = JSON.parse(stored);
      parsed.predictions = parsed.predictions ?? [];
      parsed.recommendations = parsed.recommendations ?? [];
      setResult(parsed);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Invalid result data',
        description: 'Stored prediction result is corrupted.',
      });
      navigate('/predict');
    }
  }, [navigate, toast]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  if (!result) return null;

  const { risk_score, risk_label, predictions, recommendations, metrics } =
    result;

  const metricCards = metrics
    ? [
      {
        title: 'Temperature',
        icon: Thermometer,
        unit: '°C',
        value: metrics.temperature.avg,
        min: metrics.temperature.min,
        max: metrics.temperature.max,
        trend: metrics.temperature.trend,
      },
      {
        title: 'Humidity',
        icon: Droplets,
        unit: '%',
        value: metrics.humidity.avg,
        min: metrics.humidity.min,
        max: metrics.humidity.max,
        trend: metrics.humidity.trend,
      },
      {
        title: 'CO₂ Level',
        icon: Wind,
        unit: 'ppm',
        value: metrics.co2.avg,
        min: metrics.co2.min,
        max: metrics.co2.max,
        trend: metrics.co2.trend,
      },
      {
        title: 'Soil Moisture',
        icon: Leaf,
        unit: '%',
        value: metrics.soil_moisture.avg,
        min: metrics.soil_moisture.min,
        max: metrics.soil_moisture.max,
        trend: metrics.soil_moisture.trend,
      },
    ]
    : [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-white to-emerald-50 print:bg-white print:pt-6">
      <div className="container-width px-4 md:px-8 print:px-0">

        {/* Executive Header */}
        <div className="flex justify-between items-start mb-10 border-b pb-6 print:border-none">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              AgriCastNet Executive Snapshot
            </h1>
            <p className="text-muted-foreground">
              AI Greenhouse Risk Assessment Report (24-Hour Forecast)
            </p>
            <p className="text-sm mt-2 text-muted-foreground">
              Generated on: {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3 print:hidden">
            <Link to="/metrics">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
            <Button onClick={() => window.print()} className="btn-gradient">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-white shadow-xl rounded-3xl p-8 mb-10 border">
          <h2 className="text-2xl font-semibold mb-6">
            Executive Risk Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-3xl font-bold">{risk_score}/100</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className="text-3xl font-bold">{risk_label}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-3xl font-bold">{result.confidence}%</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Greenhouse Status
              </p>
              <p className="text-3xl font-bold">
                {risk_label === 'Low'
                  ? 'Optimal'
                  : risk_label === 'Moderate'
                    ? 'Caution'
                    : 'Critical'}
              </p>
            </div>
          </div>
        </div>

        {/* Current Conditions Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {metricCards.map((m) => (
            <div
              key={m.title}
              className="bg-white border rounded-2xl p-6 shadow"
            >
              <p className="text-sm text-muted-foreground mb-2">
                {m.title}
              </p>
              <p className="text-3xl font-bold">
                {m.value} {m.unit}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Min: {m.min} | Max: {m.max}
              </p>
              <p className="text-xs mt-1">
                Trend: {m.trend}
              </p>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border">
          <h2 className="text-xl font-semibold mb-6">
            AI Strategic Recommendations
          </h2>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border bg-emerald-50"
              >
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border">
          <h2 className="text-xl font-semibold mb-6">
            24-Hour Forecast Overview
          </h2>

          {predictions.length > 0 ? (
            <PredictionChart data={predictions} selectedMetrics={selectedMetrics} />
          ) : (
            <p className="text-muted-foreground">
              No forecast data available.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
export default Results;