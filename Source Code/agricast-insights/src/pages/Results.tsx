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
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RiskGauge from '@/components/ui/RiskGauge';
import MetricCard from '@/components/ui/MetricCard';
import PredictionChart from '@/components/charts/PredictionChart';
import { useToast } from '@/hooks/use-toast';
import type { PredictionResult } from '@/lib/api';

const Results = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState(['temperature', 'humidity', 'co2', 'soil_moisture']);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('predictionResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      navigate('/predict');
    }
  }, [navigate]);

  const handleDownloadReport = () => {
    toast({
      title: 'Report Download',
      description: 'PDF report generation requires Flask backend connection.',
    });
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  if (!result) {
    return null;
  }

  const { risk_score, risk_label, predictions, recommendations, metrics } = result;

  const getStatus = (value: number, lowThreshold: number, highThreshold: number): 'optimal' | 'warning' | 'danger' => {
    if (value < lowThreshold || value > highThreshold) return 'warning';
    return 'optimal';
  };

  const metricCards = metrics ? [
    { 
      title: 'Temperature', 
      icon: Thermometer, 
      unit: '°C',
      value: metrics.temperature.avg,
      min: metrics.temperature.min,
      max: metrics.temperature.max,
      trend: metrics.temperature.trend,
      status: getStatus(metrics.temperature.avg, 18, 30),
    },
    { 
      title: 'Humidity', 
      icon: Droplets, 
      unit: '%',
      value: metrics.humidity.avg,
      min: metrics.humidity.min,
      max: metrics.humidity.max,
      trend: metrics.humidity.trend,
      status: getStatus(metrics.humidity.avg, 45, 75),
    },
    { 
      title: 'CO₂ Level', 
      icon: Wind, 
      unit: 'ppm',
      value: metrics.co2.avg,
      min: metrics.co2.min,
      max: metrics.co2.max,
      trend: metrics.co2.trend,
      status: metrics.co2.avg > 1500 ? 'warning' as const : 'optimal' as const,
    },
    { 
      title: 'Soil Moisture', 
      icon: Leaf, 
      unit: '%',
      value: metrics.soil_moisture.avg,
      min: metrics.soil_moisture.min,
      max: metrics.soil_moisture.max,
      trend: metrics.soil_moisture.trend,
      status: getStatus(metrics.soil_moisture.avg, 30, 70),
    },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Prediction <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted-foreground">
              24-hour microclimate forecast and risk assessment
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/predict">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                New Prediction
              </Button>
            </Link>
            <Button onClick={handleDownloadReport} className="btn-gradient gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Risk Score Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <RiskGauge value={risk_score} label={risk_label} size="lg" />
          </div>

          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const isPositive = rec.includes('✅') || rec.includes('optimal');
                const isWarning = rec.includes('⚠️') || rec.includes('High risk');
                const Icon = isPositive ? CheckCircle : isWarning ? XCircle : AlertTriangle;
                const iconColor = isPositive ? 'text-success' : isWarning ? 'text-danger' : 'text-warning';

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border"
                  >
                    <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <p className="text-sm">{rec}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricCards.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
        )}

        {/* Prediction Chart */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="font-display font-semibold text-xl">
              24-Hour Forecast
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'temperature', label: 'Temperature', color: 'bg-danger' },
                { key: 'humidity', label: 'Humidity', color: 'bg-secondary' },
                { key: 'co2', label: 'CO₂', color: 'bg-purple-500' },
                { key: 'soil_moisture', label: 'Soil Moisture', color: 'bg-primary' },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => toggleMetric(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedMetrics.includes(key)
                      ? `${color} text-primary-foreground`
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <PredictionChart data={predictions} selectedMetrics={selectedMetrics} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/metrics" className="glass-card-hover p-6 text-center">
            <div className="icon-circle mx-auto mb-4">
              <Thermometer className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold mb-2">Detailed Metrics</h3>
            <p className="text-sm text-muted-foreground">
              View detailed breakdown and optimal ranges
            </p>
          </Link>

          <Link to="/predict" className="glass-card-hover p-6 text-center">
            <div className="icon-circle-blue mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-display font-semibold mb-2">Run Again</h3>
            <p className="text-sm text-muted-foreground">
              Make a new prediction with different data
            </p>
          </Link>

          <Link to="/about" className="glass-card-hover p-6 text-center">
            <div className="icon-circle mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold mb-2">Learn More</h3>
            <p className="text-sm text-muted-foreground">
              Understand our prediction methodology
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
