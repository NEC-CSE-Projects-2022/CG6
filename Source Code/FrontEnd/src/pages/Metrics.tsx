import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Droplets, Wind, Leaf, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetricRangeChart from '@/components/charts/MetricRangeChart';
import PredictionChart from '@/components/charts/PredictionChart';
import type { PredictionResult, HourlyPrediction } from '@/lib/api';

// Metric configuration
const metricRanges = [
  {
    key: 'temperature',
    title: 'Temperature',
    icon: Thermometer,
    unit: '°C',
    min: -10,
    max: 60,
    optimalMin: 20,
    optimalMax: 28,
    warningMin: 10,
    warningMax: 35,
    description:
      'Optimal temperature range for most greenhouse crops. Higher temperatures can cause heat stress, while lower temperatures slow growth.',
    zones: [
      { range: '-10°C to 10°C', label: 'Danger', color: 'bg-danger/20 text-danger' },
      { range: '10°C to 20°C', label: 'Warning', color: 'bg-warning/20 text-warning' },
      { range: '20°C to 28°C', label: 'Optimal', color: 'bg-success/20 text-success' },
      { range: '28°C to 35°C', label: 'Warning', color: 'bg-warning/20 text-warning' },
      { range: '35°C to 60°C', label: 'Danger', color: 'bg-danger/20 text-danger' },
    ],
  },
  {
    key: 'humidity',
    title: 'Humidity',
    icon: Droplets,
    unit: '%',
    min: 0,
    max: 100,
    optimalMin: 50,
    optimalMax: 70,
    warningMin: 35,
    warningMax: 85,
    description:
      'Relative humidity affects transpiration and disease pressure. High humidity promotes fungal growth, while low humidity causes plant stress.',
    zones: [
      { range: '0% to 35%', label: 'Danger', color: 'bg-danger/20 text-danger' },
      { range: '35% to 50%', label: 'Warning', color: 'bg-warning/20 text-warning' },
      { range: '50% to 70%', label: 'Optimal', color: 'bg-success/20 text-success' },
      { range: '70% to 85%', label: 'Warning', color: 'bg-warning/20 text-warning' },
      { range: '85% to 100%', label: 'Danger', color: 'bg-danger/20 text-danger' },
    ],
  },
  {
    key: 'co2',
    title: 'CO₂ Level',
    icon: Wind,
    unit: 'ppm',
    min: 250,
    max: 3000,
    optimalMin: 600,
    optimalMax: 1200,
    warningMin: 400,
    warningMax: 2000,
    description:
      'CO₂ enrichment enhances photosynthesis and growth. Levels above 2000 ppm may indicate poor ventilation.',
    zones: [
      { range: '250 to 400 ppm', label: 'Low', color: 'bg-warning/20 text-warning' },
      { range: '400 to 600 ppm', label: 'Ambient', color: 'bg-muted text-muted-foreground' },
      { range: '600 to 1200 ppm', label: 'Optimal', color: 'bg-success/20 text-success' },
      { range: '1200 to 2000 ppm', label: 'Enriched', color: 'bg-warning/20 text-warning' },
      { range: '2000+ ppm', label: 'Excessive', color: 'bg-danger/20 text-danger' },
    ],
  },
  {
    key: 'soil_moisture',
    title: 'Soil Moisture',
    icon: Leaf,
    unit: '%',
    min: 0,
    max: 100,
    optimalMin: 40,
    optimalMax: 60,
    warningMin: 25,
    warningMax: 75,
    description:
      'Soil moisture directly affects water uptake and nutrient availability. Waterlogged conditions cause root rot, while dry soil leads to wilting.',
    zones: [
      { range: '0% to 25%', label: 'Dry', color: 'bg-danger/20 text-danger' },
      { range: '25% to 40%', label: 'Low', color: 'bg-warning/20 text-warning' },
      { range: '40% to 60%', label: 'Optimal', color: 'bg-success/20 text-success' },
      { range: '60% to 75%', label: 'High', color: 'bg-warning/20 text-warning' },
      { range: '75% to 100%', label: 'Saturated', color: 'bg-danger/20 text-danger' },
    ],
  },
];

const Metrics = () => {
  const [predictions, setPredictions] = useState<HourlyPrediction[]>([]);
  const [currentValues, setCurrentValues] = useState({
    temperature: 0,
    humidity: 0,
    co2: 0,
    soil_moisture: 0,
  });

  // Load latest prediction and calculate averages
  useEffect(() => {
    const storedResult = sessionStorage.getItem('predictionResult');
    if (storedResult) {
      const result: PredictionResult = JSON.parse(storedResult);

      if (result.predictions && result.predictions.length > 0) {
        setPredictions(result.predictions);

        const avg = (key: keyof HourlyPrediction) =>
          result.predictions.reduce((sum, p) => sum + (p[key] as number), 0) /
          result.predictions.length;

        setCurrentValues({
          temperature: avg('temperature'),
          humidity: avg('humidity'),
          co2: avg('co2'),
          soil_moisture: avg('soil_moisture'),
        });
      }
    } else {
      // fallback default data
      const defaultData: HourlyPrediction[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        temperature: 22 + Math.random() * 5,
        humidity: 60 + Math.random() * 10,
        co2: 700 + Math.random() * 200,
        soil_moisture: 50 + Math.random() * 5,
      }));
      setPredictions(defaultData);

      const avg = (key: keyof HourlyPrediction) =>
        defaultData.reduce((sum, p) => sum + (p[key] as number), 0) / defaultData.length;

      setCurrentValues({
        temperature: avg('temperature'),
        humidity: avg('humidity'),
        co2: avg('co2'),
        soil_moisture: avg('soil_moisture'),
      });
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/results">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Detailed <span className="gradient-text">Metrics</span>
            </h1>
            <p className="text-muted-foreground">
              Comprehensive breakdown of greenhouse parameters with optimal ranges
            </p>
          </div>
        </div>

        {/* Current Readings */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-secondary" />
            <h2 className="font-display font-semibold text-lg">Current Readings</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricRanges.map(({ key, title, icon: Icon, unit }) => (
              <div key={key} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{title}</p>
                  <p className="font-display font-semibold">
                    {currentValues[key as keyof typeof currentValues].toFixed(1)} {unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Range Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {metricRanges.map(({ key, title, unit, min, max, optimalMin, optimalMax, warningMin, warningMax }) => (
            <MetricRangeChart
              key={key}
              title={title}
              value={currentValues[key as keyof typeof currentValues]}
              unit={unit}
              min={min}
              max={max}
              optimalMin={optimalMin}
              optimalMax={optimalMax}
              warningMin={warningMin}
              warningMax={warningMax}
            />
          ))}
        </div>

        {/* 24-Hour Trend */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-display font-semibold text-xl mb-6">24-Hour Trend Analysis</h2>
          <PredictionChart data={predictions} />
        </div>

        {/* Metric Details */}
        <div className="space-y-6">
          {metricRanges.map(({ key, title, icon: Icon, description, zones }) => (
            <div key={key} className="glass-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {zones.map(({ range, label, color }) => (
                  <div key={range} className={`px-4 py-3 rounded-xl ${color} text-center`}>
                    <p className="text-xs mb-1">{range}</p>
                    <p className="font-semibold text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
