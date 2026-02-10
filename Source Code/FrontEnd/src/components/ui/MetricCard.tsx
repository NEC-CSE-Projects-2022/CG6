import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  min?: number;
  max?: number;
  status?: 'optimal' | 'warning' | 'danger';
  className?: string;
}

const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  min,
  max,
  status = 'optimal',
  className,
}: MetricCardProps) => {
  const statusColors = {
    optimal: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    danger: 'border-danger/20 bg-danger/5',
  };

  const iconBgColors = {
    optimal: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-muted-foreground';

  return (
    <div
      className={cn(
        'glass-card-hover p-6 border-2',
        statusColors[status],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', iconBgColors[status])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
            <TrendIcon className="w-4 h-4" />
            <span className="capitalize">{trend}</span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-display font-bold text-foreground">
        {value.toFixed(1)}
        <span className="text-lg text-muted-foreground ml-1">{unit}</span>
      </p>

      {(min !== undefined || max !== undefined) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            {min !== undefined && (
              <span className="text-muted-foreground">
                Min: <span className="text-foreground font-medium">{min.toFixed(1)}</span>
              </span>
            )}
            {max !== undefined && (
              <span className="text-muted-foreground">
                Max: <span className="text-foreground font-medium">{max.toFixed(1)}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
