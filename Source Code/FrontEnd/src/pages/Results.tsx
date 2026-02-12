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
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Prediction <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted-foreground">
              24-hour greenhouse microclimate intelligence
            </p>
          </div>

          <div className="flex gap-3">
            <Link to="/predict">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Prediction
              </Button>
            </Link>
            <Button className="btn-gradient gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </motion.div>

        {/* Risk + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="glass-card p-8 flex flex-col items-center justify-center"
          >
            <RiskGauge value={risk_score} label={risk_label} size="lg" />
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="lg:col-span-2 glass-card p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 blur-3xl rounded-full" />

            <h3 className="font-display font-semibold text-xl mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              AI Climate Intelligence
            </h3>

            <p className="text-sm text-muted-foreground mb-6">
              Your greenhouse survival blueprint for the next 24 hours 🌱
            </p>

            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                const lower = rec.toLowerCase();
                const isOptimal =
                  lower.includes('optimal') ||
                  lower.includes('stable') ||
                  lower.includes('good');
                const isCritical =
                  lower.includes('high') ||
                  lower.includes('low') ||
                  lower.includes('risk') ||
                  lower.includes('critical');

                const type = isOptimal
                  ? 'optimal'
                  : isCritical
                  ? 'critical'
                  : 'advisory';

                const styles = {
                  optimal:
                    'border-emerald-400 bg-emerald-50 shadow-emerald-200/40',
                  critical:
                    'border-red-400 bg-red-50 shadow-red-200/40',
                  advisory:
                    'border-blue-400 bg-blue-50 shadow-blue-200/40',
                };

                const Icon =
                  type === 'optimal'
                    ? CheckCircle
                    : type === 'critical'
                    ? XCircle
                    : Lightbulb;

                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={idx + 3}
                    className={`p-5 rounded-2xl border shadow-lg backdrop-blur transition-all hover:scale-[1.02] ${styles[type]}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-white shadow">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm leading-relaxed font-medium">
                        {rec}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Metric Cards */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10"
        >
          {metricCards.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </motion.div>

        {/* Chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="glass-card p-6"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {['temperature', 'humidity', 'co2', 'soil_moisture'].map((key) => (
              <button
                key={key}
                onClick={() => toggleMetric(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedMetrics.includes(key)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {key.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {predictions.length > 0 ? (
            <PredictionChart
              data={predictions}
              selectedMetrics={selectedMetrics}
            />
          ) : (
            <p className="text-muted-foreground">
              No prediction data available.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
