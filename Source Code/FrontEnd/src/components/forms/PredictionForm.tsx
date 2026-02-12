// 🔥 Same imports (unchanged)
import { useEffect, useState } from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  VALIDATION_RULES,
  validateInput,
  type PredictionInput,
} from '@/lib/api';

// 🔁 Props
interface PredictionFormProps {
  onSubmit: (data: PredictionInput) => void;
  onCSVSubmit: (file: File) => void;
  isLoading: boolean;
}

const PredictionForm = ({ onSubmit, onCSVSubmit, isLoading }: PredictionFormProps) => {
  const [formData, setFormData] = useState<Record<keyof PredictionInput, string>>({
    temperature: '',
    humidity: '',
    co2: '',
    soil_moisture: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [lastPrediction, setLastPrediction] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('predictionResult');
    if (stored) setLastPrediction(JSON.parse(stored));
  }, []);

  const validateRealtime = (nextData: Record<string, string>) => {

    // If all fields are empty → no validation
    const allEmpty = Object.values(nextData).every(v => v === '');
    if (allEmpty) {
      setErrors([]);
      setFieldErrors({});
      return;
    }

    // Only validate fields that have values
    const parsed: Partial<PredictionInput> = {};

    if (nextData.temperature !== '')
      parsed.temperature = Number(nextData.temperature);

    if (nextData.humidity !== '')
      parsed.humidity = Number(nextData.humidity);

    if (nextData.co2 !== '')
      parsed.co2 = Number(nextData.co2);

    if (nextData.soil_moisture !== '')
      parsed.soil_moisture = Number(nextData.soil_moisture);

    const validationErrors = validateInput(parsed as PredictionInput);

    setErrors(validationErrors);

    const map: Record<string, boolean> = {};
    validationErrors.forEach((err) => {
      if (err.toLowerCase().includes('temperature')) map.temperature = true;
      if (err.toLowerCase().includes('humidity')) map.humidity = true;
      if (err.toLowerCase().includes('co2')) map.co2 = true;
      if (err.toLowerCase().includes('soil')) map.soil_moisture = true;
    });

    setFieldErrors(map);
  };

const handleInputChange = (field: keyof PredictionInput, value: string) => {
  const next = { ...formData, [field]: value };
  setFormData(next);
  validateRealtime(next);
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const parsed: PredictionInput = {
    temperature: Number(formData.temperature),
    humidity: Number(formData.humidity),
    co2: Number(formData.co2),
    soil_moisture: Number(formData.soil_moisture),
  };

  const errs = validateInput(parsed);
  if (errs.length > 0) return setErrors(errs);
  onSubmit(parsed);
};

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !file.name.endsWith('.csv')) return setErrors(['Upload a valid CSV file']);
  const rows = (await file.text()).split('\n').slice(0, 6).map(r => r.split(','));
  setCsvPreview(rows);
  setCsvFile(file);
  setErrors([]);
};

const inputFields = [
  { key: 'temperature', label: 'Temperature', icon: Thermometer, ...VALIDATION_RULES.temperature },
  { key: 'humidity', label: 'Humidity', icon: Droplets, ...VALIDATION_RULES.humidity },
  { key: 'co2', label: 'CO₂ Level', icon: Wind, ...VALIDATION_RULES.co2 },
  { key: 'soil_moisture', label: 'Soil Moisture', icon: Leaf, ...VALIDATION_RULES.soil_moisture },
] as const;

return (
  <div
    className="relative rounded-3xl overflow-hidden shadow-2xl border border-green-200"
    style={{
      backgroundImage: "url('/src/assets/hero-greenhouse.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay for glass effect */}
    <div className="absolute inset-0 bg-green-900/60 backdrop-blur-sm"></div>

    <div className="relative z-10 p-8 md:p-12 text-white">

      {/* 🌿 Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-200 to-lime-300 bg-clip-text text-transparent">
          🌱 Smart Greenhouse Predictor
        </h2>
        <p className="text-green-100 mt-3 text-sm md:text-base">
          AI-powered crop environment analysis for sustainable farming
        </p>
      </div>

      {/* 🌿 Tabs */}
      <div className="flex gap-4 mb-8">
        {['manual', 'csv'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'flex-1 py-3 rounded-2xl font-semibold transition-all duration-300',
              activeTab === tab
                ? 'bg-gradient-to-r from-green-500 to-lime-500 text-white shadow-lg scale-105'
                : 'bg-white/20 hover:bg-white/30 text-green-100'
            )}
          >
            {tab === 'manual' ? '🌿 Manual Input' : '📊 CSV Upload'}
          </button>
        ))}
      </div>

      {/* 🌿 Error Panel */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-red-200/20 border border-red-300 backdrop-blur">
          <div className="flex items-center gap-2 text-red-200 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Validation Error</span>
          </div>
          <ul className="text-sm space-y-1">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🌿 Manual Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8 mb-8">

            {inputFields.map(({ key, label, icon: Icon, min, max, unit }) => (
              <div
                key={key}
                className="bg-white/10 p-6 rounded-2xl border border-green-200/30 backdrop-blur-lg shadow-lg hover:shadow-green-400/40 transition"
              >
                <Label className="flex items-center gap-2 text-green-200 font-semibold">
                  <Icon className="w-5 h-5 text-lime-300" />
                  {label}
                </Label>

                <Input
                  type="number"
                  value={formData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  min={min}
                  max={max}
                  step="0.1"
                  disabled={isLoading}
                  className={cn(
                    'mt-3 bg-white/20 text-white border-green-300 focus:ring-lime-400 rounded-xl',
                    fieldErrors[key] && 'border-red-400'
                  )}
                />

                <p className="text-xs text-green-200 mt-2">
                  Range: {min} - {max} {unit}
                </p>
              </div>
            ))}

          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 shadow-xl transition-transform hover:scale-105"
          >
            {isLoading ? '🌿 Processing...' : '🚀 Generate Greenhouse Prediction'}
          </Button>
        </form>
      )}

      {/* 🌿 CSV Section */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          <label className="block border-2 border-dashed border-green-300 rounded-2xl p-10 text-center cursor-pointer bg-white/10 hover:bg-white/20 transition backdrop-blur">
            <Upload className="w-10 h-10 mx-auto mb-4 text-lime-300" />
            <p className="text-green-100">Upload Greenhouse CSV Data</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>

          {csvPreview.length > 0 && (
            <div className="overflow-auto rounded-xl bg-white/20 backdrop-blur border border-green-200">
              <table className="w-full text-sm text-white">
                <tbody>
                  {csvPreview.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-green-200/30 px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Button
            onClick={() => csvFile && onCSVSubmit(csvFile)}
            disabled={!csvFile || isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition hover:scale-105"
          >
            📊 Analyze Greenhouse Data
          </Button>
        </div>
      )}

    </div>
  </div>
);
};

export default PredictionForm;