import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyPrediction } from '@/lib/api';

interface PredictionChartProps {
  data: HourlyPrediction[];
  selectedMetrics?: string[];
}

const PredictionChart = ({
  data,
  selectedMetrics = ['temperature', 'humidity', 'co2', 'soil_moisture'],
}: PredictionChartProps) => {
  // Ensure each metric exists for every hour
  const formattedData = data.map((item, idx) => ({
    hour: item.hour != null ? `${item.hour}:00` : `Hour ${idx}`,
    temperature: item.temperature ?? null,
    humidity: item.humidity ?? null,
    co2: item.co2 ?? null,
    soil_moisture: item.soil_moisture ?? null,
  }));

  const metrics = [
    { key: 'temperature', name: 'Temperature (°C)', color: '#ef4444', yAxisId: 'left' },
    { key: 'humidity', name: 'Humidity (%)', color: '#3b82f6', yAxisId: 'left' },
    { key: 'co2', name: 'CO₂ (ppm)', color: '#8b5cf6', yAxisId: 'right' },
    { key: 'soil_moisture', name: 'Soil Moisture (%)', color: '#22c55e', yAxisId: 'left' },
  ];

  const visibleMetrics = metrics.filter((m) => selectedMetrics.includes(m.key));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          {selectedMetrics.includes('co2') && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          />
          <Legend />
          {visibleMetrics.map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              name={metric.name}
              stroke={metric.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              yAxisId={metric.yAxisId}
              isAnimationActive={false}
              connectNulls={true} // ✅ important: prevents broken lines when values are null
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
