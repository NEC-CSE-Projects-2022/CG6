import { useState } from 'react';
import { Thermometer, Droplets, Wind, Leaf, Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { VALIDATION_RULES, validateInput, type PredictionInput } from '@/lib/api';

interface PredictionFormProps {
  onSubmit: (data: PredictionInput) => void;
  onCSVSubmit: (file: File) => void;
  isLoading: boolean;
}

const PredictionForm = ({ onSubmit, onCSVSubmit, isLoading }: PredictionFormProps) => {
  const [formData, setFormData] = useState<PredictionInput>({
    temperature: 25,
    humidity: 60,
    co2: 800,
    soil_moisture: 50,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');

  const handleInputChange = (field: keyof PredictionInput, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    setErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateInput(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setErrors(['Please upload a valid CSV file']);
        return;
      }
      setCsvFile(file);
      setErrors([]);
    }
  };

  const handleCSVSubmit = () => {
    if (csvFile) {
      onCSVSubmit(csvFile);
    }
  };

  const inputFields = [
    {
      key: 'temperature' as const,
      label: 'Temperature',
      icon: Thermometer,
      ...VALIDATION_RULES.temperature,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      key: 'humidity' as const,
      label: 'Humidity',
      icon: Droplets,
      ...VALIDATION_RULES.humidity,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      key: 'co2' as const,
      label: 'CO₂ Level',
      icon: Wind,
      ...VALIDATION_RULES.co2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      key: 'soil_moisture' as const,
      label: 'Soil Moisture',
      icon: Leaf,
      ...VALIDATION_RULES.soil_moisture,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="glass-card p-6 md:p-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200',
            activeTab === 'manual'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          Manual Input
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={cn(
            'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200',
            activeTab === 'csv'
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          CSV Upload
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20">
          <div className="flex items-center gap-2 text-danger mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Validation Error</span>
          </div>
          <ul className="text-sm text-danger/80 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'manual' ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {inputFields.map(({ key, label, icon: Icon, min, max, unit, color, bgColor }) => (
              <div key={key} className="space-y-2">
                <Label
                  htmlFor={key}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <span className={cn('p-1.5 rounded-lg', bgColor)}>
                    <Icon className={cn('w-4 h-4', color)} />
                  </span>
                  {label}
                </Label>
                <div className="relative">
                  <Input
                    id={key}
                    type="number"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    min={min}
                    max={max}
                    step="0.1"
                    className="pr-12"
                    disabled={isLoading}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {unit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Range: {min} - {max} {unit}
                </p>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-gradient text-lg h-14"
          >
            {isLoading ? 'Processing...' : 'Generate Prediction'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              csvFile
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            {csvFile ? (
              <div className="flex items-center justify-center gap-4">
                <FileSpreadsheet className="w-12 h-12 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{csvFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(csvFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setCsvFile(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium mb-2">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <span className="text-xs text-muted-foreground">
                  Required columns: temperature, humidity, co2, soil_moisture
                </span>
              </label>
            )}
          </div>

          <Button
            onClick={handleCSVSubmit}
            disabled={!csvFile || isLoading}
            className="w-full btn-gradient text-lg h-14"
          >
            {isLoading ? 'Processing CSV...' : 'Analyze CSV Data'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
