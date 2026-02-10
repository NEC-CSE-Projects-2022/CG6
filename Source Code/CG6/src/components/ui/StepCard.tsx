import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  isLast?: boolean;
}

const StepCard = ({ step, title, description, icon: Icon, isLast }: StepCardProps) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connector line */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
      )}

      {/* Step number with icon */}
      <div className="relative mb-4">
        <div className="icon-circle animate-pulse-slow">
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-bold shadow-lg">
          {step}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    </div>
  );
};

export default StepCard;
