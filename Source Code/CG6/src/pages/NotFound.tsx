import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Leaf className="w-16 h-16 text-primary opacity-50" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-6xl font-display font-bold text-primary">
            404
          </span>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Oops! The page you're looking for seems to have wandered off into the greenhouse. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="btn-gradient gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
