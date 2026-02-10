import { cn } from '@/lib/utils';

interface MetricRangeChartProps {
  title: string;
  value: number;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  unit: string;
  warningMin?: number;
  warningMax?: number;
}

const MetricRangeChart = ({
  title,
  value,
  min,
  max,
  optimalMin,
  optimalMax,
  unit,
  warningMin,
  warningMax,
}: MetricRangeChartProps) => {
  const range = max - min;
  const valuePercent = ((value - min) / range) * 100;
  const optimalStartPercent = ((optimalMin - min) / range) * 100;
  const optimalEndPercent = ((optimalMax - min) / range) * 100;
  const warningStartPercent = warningMin ? ((warningMin - min) / range) * 100 : 0;
  const warningEndPercent = warningMax ? ((warningMax - min) / range) * 100 : 100;

  const getStatus = () => {
    if (value >= optimalMin && value <= optimalMax) return 'optimal';
    if (warningMin && warningMax && (value < warningMin || value > warningMax)) return 'danger';
    return 'warning';
  };

  const status = getStatus();
  const statusColors = {
    optimal: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold">{title}</h3>
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium capitalize',
          status === 'optimal' && 'bg-success/10 text-success',
          status === 'warning' && 'bg-warning/10 text-warning',
          status === 'danger' && 'bg-danger/10 text-danger',
        )}>
          {status}
        </span>
      </div>

      {/* Value display */}
      <div className="text-center mb-6">
        <span className="text-4xl font-display font-bold">{value.toFixed(1)}</span>
        <span className="text-xl text-muted-foreground ml-2">{unit}</span>
      </div>

      {/* Range bar */}
      <div className="relative h-6 rounded-full bg-muted overflow-hidden">
        {/* Danger zones (left and right) */}
        <div
          className="absolute inset-y-0 left-0 bg-danger/30"
          style={{ width: `${warningStartPercent}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-danger/30"
          style={{ width: `${100 - warningEndPercent}%` }}
        />

        {/* Warning zones */}
        <div
          className="absolute inset-y-0 bg-warning/30"
          style={{ left: `${warningStartPercent}%`, width: `${optimalStartPercent - warningStartPercent}%` }}
        />
        <div
          className="absolute inset-y-0 bg-warning/30"
          style={{ left: `${optimalEndPercent}%`, width: `${warningEndPercent - optimalEndPercent}%` }}
        />

        {/* Optimal zone */}
        <div
          className="absolute inset-y-0 bg-success/40"
          style={{ left: `${optimalStartPercent}%`, width: `${optimalEndPercent - optimalStartPercent}%` }}
        />

        {/* Current value marker */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background shadow-lg transition-all duration-500',
            statusColors[status]
          )}
          style={{ left: `calc(${Math.max(0, Math.min(100, valuePercent))}% - 8px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>{min} {unit}</span>
        <span className="text-success">Optimal: {optimalMin}-{optimalMax}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};

export default MetricRangeChart;
