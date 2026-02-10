import { cn } from '@/lib/utils';
import { Mail, Linkedin, Github } from 'lucide-react';

interface TeamCardProps {
  name: string;
  role: string;
  
  imageUrl: string;
  isGuide?: boolean;
  socials?: {
    email?: string;
    linkedin?: string;
    github?: string;
  };
}

const TeamCard = ({ name, role, imageUrl, isGuide, socials }: TeamCardProps) => {
  return (
    <div
      className={cn(
        'glass-card-hover overflow-hidden mt-2',
        isGuide && 'border-2 border-primary/30'
      )}
    >
      {/* Image */}
      <div className="relative h-68 overflow-hidden flex items-center justify-center bg-muted ">
        <img
          src={imageUrl}
          alt={name}
          className="w-auto h-auto object-contain  transition-transform duration-500 hover:scale-110"
        />
        {isGuide && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            Project Guide
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-xl mb-1">{name}</h3>
        <p className="text-primary font-medium text-sm mb-3">{role}</p>

        {/* Social links */}
        {socials && (
          <div className="flex gap-3">
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
