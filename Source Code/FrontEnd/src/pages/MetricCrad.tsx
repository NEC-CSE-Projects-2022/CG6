import React from 'react';

type MetricCardProps = {
  title: string;
  icon: React.ReactNode; // pass the icon element
  unit: string;
  value: number;
  min?: number;
  max?: number;
  trend?: number[];
  status?: 'optimal' | 'warning' | 'danger';
};

const MetricCard: React.FC<MetricCardProps> = ({ title, icon, unit, value, min, max, trend, status }) => {
  const statusColor =
    status === 'optimal' ? 'text-success' :
    status === 'warning' ? 'text-warning' :
    status === 'danger' ? 'text-danger' :
    'text-muted-foreground';

  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <p className={`text-lg font-bold ${statusColor}`}>
        {value.toFixed(1)} {unit}
      </p>
      {min !== undefined && max !== undefined && (
        <p className="text-xs text-muted-foreground">
          Range: {min} - {max} {unit}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
