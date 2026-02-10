import { 
  Leaf, 
  Brain, 
  Database, 
  Cpu, 
  BarChart3, 
  Shield, 
  Zap, 
  Globe,
  Thermometer,
  Droplets,
  Wind,
  Clock
} from 'lucide-react';
import aboutBg from '@/assets/about-bg.jpg';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={aboutBg}
            alt="Agricultural technology"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="relative z-10 container-width px-4 md:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">AgriCastNet</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A Unified Deep Forecasting Framework for Smart Greenhouse Microclimates
          </p>
        </div>
      </section>

      {/* What is AgriCastNet */}
      <section className="section-padding bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-6">
                What is AgriCastNet?
              </h2>
              <p className="text-muted-foreground mb-4">
                AgriCastNet is an advanced deep learning framework designed to predict and analyze 
                microclimate conditions within smart greenhouses. By leveraging state-of-the-art 
                neural network architectures, it provides accurate 24-hour forecasts for critical 
                environmental parameters.
              </p>
              <p className="text-muted-foreground mb-4">
                The system monitors four key parameters that directly impact plant health and productivity:
              </p>
              <ul className="space-y-3">
                {[
                  { icon: Thermometer, label: 'Temperature - affects metabolic processes' },
                  { icon: Droplets, label: 'Humidity - influences transpiration and disease' },
                  { icon: Wind, label: 'CO₂ - essential for photosynthesis' },
                  { icon: Leaf, label: 'Soil Moisture - critical for nutrient uptake' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '24h', label: 'Forecast Window', icon: Clock },
                { value: '95%+', label: 'Accuracy Rate', icon: BarChart3 },
                { value: '4', label: 'Key Metrics', icon: Cpu },
                { value: 'Real-time', label: 'Processing', icon: Zap },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="glass-card p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <p className="font-display text-2xl font-bold mb-1">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Greenhouse Prediction */}
      <section className="section-padding">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              Why Microclimate Prediction Matters
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Precise environmental control is crucial for maximizing crop yield and quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Prevent Crop Loss',
                description: 'Early detection of unfavorable conditions allows proactive intervention, reducing crop damage by up to 40%.',
              },
              {
                icon: Zap,
                title: 'Optimize Resources',
                description: 'Predictive insights enable efficient use of water, energy, and nutrients, reducing operational costs.',
              },
              {
                icon: Globe,
                title: 'Sustainability',
                description: 'Data-driven decisions minimize environmental impact while maximizing agricultural productivity.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass-card-hover p-8 text-center">
                <div className="icon-circle mx-auto mb-6">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-secondary" />
                  Dataset Structure (ds.csv)
                </h3>
                <div className="bg-foreground/5 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left pb-2">Column</th>
                        <th className="text-left pb-2">Type</th>
                        <th className="text-left pb-2">Range</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr>
                        <td className="py-1 text-primary">timestamp</td>
                        <td>datetime</td>
                        <td>ISO 8601</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-primary">temperature</td>
                        <td>float</td>
                        <td>-10 to 60°C</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-primary">humidity</td>
                        <td>float</td>
                        <td>0 to 100%</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-primary">co2</td>
                        <td>float</td>
                        <td>250-5000 ppm</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-primary">soil_moisture</td>
                        <td>float</td>
                        <td>0 to 100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl font-bold mb-6">
                Training Dataset
              </h2>
              <p className="text-muted-foreground mb-4">
                Our model was trained on an extensive dataset of greenhouse sensor readings 
                collected over multiple growing seasons. The dataset captures the complex 
                interdependencies between environmental parameters.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Over 100,000 hourly sensor readings</li>
                <li>• Multiple greenhouse types and crop varieties</li>
                <li>• Seasonal and diurnal pattern coverage</li>
                <li>• Pre-processed with sliding window technique</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="section-padding">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              Model Architecture
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on proven deep learning techniques for time-series forecasting
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Data Input',
                  description: 'Sensor readings normalized and transformed using sliding window approach',
                  icon: Database,
                },
                {
                  step: '2',
                  title: 'LSTM Layers',
                  description: 'Long Short-Term Memory networks capture temporal dependencies',
                  icon: Brain,
                },
                {
                  step: '3',
                  title: 'Dense Layers',
                  description: 'Fully connected layers for feature extraction and prediction',
                  icon: Cpu,
                },
                {
                  step: '4',
                  title: 'Output',
                  description: '24-hour predictions with confidence intervals',
                  icon: BarChart3,
                },
              ].map(({ step, title, description, icon: Icon }) => (
                <div key={step} className="text-center relative">
                  {step !== '4' && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-border" />
                  )}
                  <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted/50 rounded-xl">
              <h4 className="font-display font-semibold mb-4">Technical Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Model Format</p>
                  <p className="font-medium">Keras (.keras)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Window Size</p>
                  <p className="font-medium">24 time steps</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Optimizer</p>
                  <p className="font-medium">Adam</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Loss Function</p>
                  <p className="font-medium">MSE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React', desc: 'Frontend Framework' },
              { name: 'Flask', desc: 'Backend API' },
              { name: 'TensorFlow/Keras', desc: 'Deep Learning' },
              { name: 'Recharts', desc: 'Visualization' },
              { name: 'Python', desc: 'Data Processing' },
              { name: 'TypeScript', desc: 'Type Safety' },
              { name: 'Tailwind CSS', desc: 'Styling' },
              { name: 'NumPy/Pandas', desc: 'Data Analysis' },
            ].map(({ name, desc }) => (
              <div key={name} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="font-display font-semibold">{name}</p>
                <p className="text-sm text-primary-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
