import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <div
          className={cn(
            sizes[size],
            'rounded-full border-4 border-muted animate-spin'
          )}
          style={{ borderTopColor: 'hsl(var(--primary))' }}
        />
        <div
          className={cn(
            sizes[size],
            'absolute inset-0 rounded-full border-4 border-transparent animate-pulse'
          )}
          style={{ borderRightColor: 'hsl(var(--secondary) / 0.5)' }}
        />
      </div>
      {text && (
        <p className="text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
