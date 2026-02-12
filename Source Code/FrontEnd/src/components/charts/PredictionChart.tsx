import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Thermometer, Droplets, Wind, Leaf } from 'lucide-react';
import type { HourlyPrediction } from '@/lib/api';
import greenhouseImg from '@/assets/hero-greenhouse.jpg';

interface PredictionChartProps {
  data: HourlyPrediction[];
  selectedMetrics?: string[];
}

const PredictionChart = ({
  data,
  selectedMetrics = ['temperature', 'humidity', 'co2', 'soil_moisture'],
}: PredictionChartProps) => {
  const formattedData = data.map((item, idx) => ({
    hour: item.hour != null ? `${item.hour}:00` : `Hour ${idx + 1}`,
    temperature: item.temperature ?? null,
    humidity: item.humidity ?? null,
    co2: item.co2 ?? null,
    soil_moisture: item.soil_moisture ?? null,
  }));

  const metrics = [
    { key: 'temperature', name: 'Temperature (°C)', color: '#ef4444', icon: <Thermometer />, yAxisId: 'left' },
    { key: 'humidity', name: 'Humidity (%)', color: '#3b82f6', icon: <Droplets />, yAxisId: 'left' },
    { key: 'co2', name: 'CO₂ (ppm)', color: '#8b5cf6', icon: <Wind />, yAxisId: 'right' },
    { key: 'soil_moisture', name: 'Soil Moisture (%)', color: '#22c55e', icon: <Leaf />, yAxisId: 'left' },
  ];

  const visibleMetrics = metrics.filter((m) => selectedMetrics.includes(m.key));

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg border bg-card">
      {/* 🌄 Greenhouse background image */}
      <img
        src={greenhouseImg}
        alt="Greenhouse background"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />

      <div className="relative p-4 h-full">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          🌿 24-Hour Greenhouse Prediction
        </h3>

        {/* 🌱 Icon Legend */}
        <div className="flex flex-wrap gap-4 text-sm mb-3">
          {visibleMetrics.map((m) => (
            <div key={m.key} className="flex items-center gap-1">
              <span style={{ color: m.color }}>{m.icon}</span>
              <span>{m.name}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            {selectedMetrics.includes('co2') && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: '10px',
                border: '1px solid #d1fae5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            />

            {visibleMetrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={3}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
                yAxisId={metric.yAxisId}
                isAnimationActive
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
