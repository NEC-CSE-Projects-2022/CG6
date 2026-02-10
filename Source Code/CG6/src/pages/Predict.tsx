import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import PredictionForm from '@/components/forms/PredictionForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { predictFromInput, predictFromCSV, type PredictionInput, type PredictionResult } from '@/lib/api';

const tips = [
  'Ensure sensors are calibrated before recording readings',
  'Take measurements during stable conditions for best results',
  'CSV files should include timestamp for trend analysis',
  'Regular predictions help identify patterns over time',
];

const Predict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleManualSubmit = async (data: PredictionInput) => {
    setIsLoading(true);
    setLoadingMessage('Analyzing sensor data...');

    try {
      // Simulate progress messages
      setTimeout(() => setLoadingMessage('Running deep learning model...'), 500);
      setTimeout(() => setLoadingMessage('Generating predictions...'), 1000);

      const result = await predictFromInput(data);

      toast({
        title: 'Prediction Complete',
        description: `Risk Level: ${result.risk_label} (${result.risk_score}%)`,
      });

      // Store result and navigate
      sessionStorage.setItem('predictionResult', JSON.stringify(result));
      sessionStorage.setItem('inputData', JSON.stringify(data));
      navigate('/results');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCSVSubmit = async (file: File) => {
    setIsLoading(true);
    setLoadingMessage('Reading CSV file...');

    try {
      setTimeout(() => setLoadingMessage('Validating data columns...'), 500);
      setTimeout(() => setLoadingMessage('Processing batch predictions...'), 1200);
      setTimeout(() => setLoadingMessage('Aggregating results...'), 2000);

      const result = await predictFromCSV(file);

      toast({
        title: 'CSV Analysis Complete',
        description: `Processed ${file.name} - Risk Level: ${result.risk_label}`,
      });

      // Store result and navigate
      sessionStorage.setItem('predictionResult', JSON.stringify(result));
      sessionStorage.setItem('inputData', JSON.stringify({ csvFile: file.name }));
      navigate('/results');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'CSV Processing Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Microclimate <span className="gradient-text">Prediction</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your greenhouse sensor readings or upload a CSV file to get AI-powered predictions 
            and risk assessment for the next 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text={loadingMessage} />
                <div className="mt-8 w-full max-w-xs">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[shimmer_1.5s_infinite] w-3/4" 
                         style={{ backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--primary-foreground) / 0.3), transparent)', backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <PredictionForm
                onSubmit={handleManualSubmit}
                onCSVSubmit={handleCSVSubmit}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Validation Info */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-secondary" />
                Input Guidelines
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Temperature: -10°C to 60°C</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Humidity: 0% to 100%</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>CO₂: 250 to 5000 ppm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Soil Moisture: 0% to 100%</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CSV Format */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4">
                CSV Format
              </h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <p className="text-primary">temperature,humidity,co2,soil_moisture</p>
                <p className="text-muted-foreground">25.5,65,800,45</p>
                <p className="text-muted-foreground">26.2,63,820,43</p>
                <p className="text-muted-foreground">...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
