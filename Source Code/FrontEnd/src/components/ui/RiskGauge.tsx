import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  value: number;
  label: 'Low' | 'Moderate' | 'High';
  size?: 'sm' | 'md' | 'lg';
}

const RiskGauge = ({ value, label, size = 'md' }: RiskGaugeProps) => {
  const sizes = {
    sm: { width: 120, stroke: 8, fontSize: 'text-xl' },
    md: { width: 180, stroke: 12, fontSize: 'text-3xl' },
    lg: { width: 240, stroke: 16, fontSize: 'text-4xl' },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * Math.PI;
  const progress = (value / 100) * circumference;

  const getColor = () => {
    if (value < 33) return 'stroke-success';
    if (value < 66) return 'stroke-warning';
    return 'stroke-danger';
  };

  const getLabelColor = () => {
    if (label === 'Low') return 'text-success';
    if (label === 'Moderate') return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height: width / 2 + 20 }}>
        <svg
          width={width}
          height={width / 2 + 20}
          className="transform -rotate-180"
        >
          {/* Background arc */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={cn(getColor(), 'transition-all duration-1000 ease-out')}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={cn('font-display font-bold', fontSize)}>{Math.round(value)}</span>
          <span className="text-muted-foreground text-sm">Risk Score</span>
        </div>
      </div>
      <span className={cn('font-semibold text-lg', getLabelColor())}>
        {label} Risk
      </span>
    </div>
  );
};

export default RiskGauge;
