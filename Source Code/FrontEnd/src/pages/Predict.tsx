import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import PredictionForm from '@/components/forms/PredictionForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  predictFromInput,
  predictFromCSV,
  type PredictionInput,
} from '@/lib/api';

const tips = [
  'Ensure sensors are calibrated before recording readings',
  'Take measurements during stable conditions for best results',
  'CSV files should include timestamp for trend analysis',
  'Regular predictions help identify patterns over time',
];

interface NormalizedResponse {
  predictions: any[];
  metrics: Record<string, any>;
  error_metrics: {
    mae: number;
    rmse: number;
    mse: number;
    r2: number;
  };
  risk_label: string;
  confidence: number;
  recommendations: string[];
  risk_score: number;
}

const Predict = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const simulateProgress = async (
    steps: { message: string; delay: number }[]
  ) => {
    for (const step of steps) {
      setLoadingMessage(step.message);
      await new Promise((res) => setTimeout(res, step.delay));
    }
  };

  // ✅ Normalize backend response
  const normalizeResponse = (response: any): NormalizedResponse | null => {
    if (!response || response.success !== true) return null;

    return {
      predictions: response.predictions ?? [],
      metrics: response.metrics ?? {},
      error_metrics: response.error_metrics ?? {
        mae: 0,
        rmse: 0,
        mse: 0,
        r2: 0,
      },
      risk_label: response.risk_label ?? 'Low',
      confidence: response.confidence ?? 100,
      recommendations: response.recommendations ?? [],
      risk_score: response.risk_score ?? 0,
    };
  };

  // 🌿 Manual Input
  const handleManualSubmit = async (data: PredictionInput) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingMessage('Analyzing sensor data...');

    try {
      await simulateProgress([
        { message: 'Running AI model...', delay: 800 },
        { message: 'Generating predictions...', delay: 1200 },
      ]);

      const apiResponse = await predictFromInput(data);
      console.log('FULL API RESPONSE:', apiResponse);

      const normalized = normalizeResponse(apiResponse);

      if (!normalized) {
        throw new Error('Server returned invalid data');
      }

      sessionStorage.setItem(
        'predictionResult',
        JSON.stringify(normalized)
      );

      sessionStorage.setItem(
        'inputData',
        JSON.stringify({ type: 'manual', ...data })
      );

      toast({
        title: 'Prediction Complete 🌱',
        description: 'Manual prediction successful',
      });

      navigate('/metrics');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description:
          err instanceof Error ? err.message : 'Unexpected error',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 📊 CSV Upload
  const handleCSVSubmit = async (file: File) => {
    if (isLoading) return;

    setIsLoading(true);
    setLoadingMessage('Reading CSV file...');

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');

      if (lines.length < 2) {
        throw new Error('CSV must contain at least one data row.');
      }

      const apiResponse = await predictFromCSV(file);
      console.log('FULL API RESPONSE:', apiResponse);

      const normalized = normalizeResponse(apiResponse);

      if (!normalized) {
        throw new Error('Server returned invalid data');
      }

      sessionStorage.setItem(
        'predictionResult',
        JSON.stringify(normalized)
      );

      sessionStorage.setItem(
        'inputData',
        JSON.stringify({ type: 'csv', file: file.name })
      );

      toast({
        title: 'CSV Upload Successful 📊',
        description: 'Data processed successfully',
      });

      navigate('/metrics');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'CSV Processing Failed',
        description:
          err instanceof Error ? err.message : 'Invalid CSV',
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-width px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Microclimate <span className="gradient-text">Prediction</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter sensor data or upload a CSV file for greenhouse risk analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="glass-card p-12 flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text={loadingMessage} />
              </div>
            ) : (
              <PredictionForm
                onSubmit={handleManualSubmit}
                onCSVSubmit={handleCSVSubmit}
                isLoading={isLoading}
              />
            )}
            
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-secondary" />
                Input Guidelines
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Temperature: -10°C to 60°C
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Humidity: 0% to 100%
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  CO₂: 250–5000 ppm
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Soil Moisture: 0%–100%
                </li>
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {tips.map((tip, i) => (
                  <li key={i}>
                    {i + 1}. {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
