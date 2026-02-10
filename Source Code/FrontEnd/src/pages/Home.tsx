import { Link } from 'react-router-dom';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Leaf, 
  Brain, 
  BarChart3, 
  Shield, 
  Clock, 
  Upload, 
  LineChart, 
  FileText,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepCard from '@/components/ui/StepCard';
import heroImage from '@/assets/hero-greenhouse.jpg';

const benefits = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Deep learning models trained on extensive greenhouse data for accurate microclimate forecasting.',
  },
  {
    icon: Clock,
    title: '24-Hour Forecasting',
    description: 'Get detailed predictions for the next 24 hours to plan your greenhouse management.',
  },
  {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Intelligent risk scoring to identify potential issues before they affect your crops.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Comprehensive metrics and visualizations to understand your greenhouse conditions.',
  },
];

const metrics = [
  { icon: Thermometer, label: 'Temperature', color: 'text-danger' },
  { icon: Droplets, label: 'Humidity', color: 'text-secondary' },
  { icon: Wind, label: 'CO₂ Levels', color: 'text-purple-500' },
  { icon: Leaf, label: 'Soil Moisture', color: 'text-primary' },
];

const steps = [
  {
    icon: Upload,
    title: 'Input Data',
    description: 'Enter sensor readings manually or upload your CSV data file with greenhouse measurements.',
  },
  {
    icon: LineChart,
    title: 'AI Forecast',
    description: 'Our deep learning model analyzes patterns and generates accurate 24-hour predictions.',
  },
  {
    icon: FileText,
    title: 'Get Report',
    description: 'Receive detailed insights, risk assessment, and actionable recommendations.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Smart greenhouse interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-float" />
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-secondary/20 blur-xl animate-float-delayed" />
          <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-accent/20 blur-xl animate-float" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-width px-4 md:px-8 text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Agriculture</span>
            </div>
          </div>

          <h1 className="animate-fade-up font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Agri<span className="text-primary">Cast</span>Net
          </h1>

          <p className="animate-fade-up-delayed text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            A Unified Deep Forecasting Framework for Smart Greenhouse Microclimates. 
            Harness the power of AI to optimize your agricultural productivity.
          </p>

          {/* Metric icons */}
          <div className="animate-fade-up-delayed flex justify-center gap-4 md:gap-8 mb-10">
            {metrics.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-background/10 backdrop-blur-sm flex items-center justify-center border border-background/20">
                  <Icon className={`w-6 h-6 md:w-7 md:h-7 ${color}`} />
                </div>
                <span className="text-xs md:text-sm text-primary-foreground/70">{label}</span>
              </div>
            ))}
          </div>

          <div className="animate-fade-up-delayed flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/predict">
              <Button className="btn-gradient text-lg h-14 px-8 gap-2">
                Start Prediction
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-lg h-14 px-8 bg-background/10 backdrop-blur-sm border-background/30 text-primary-foreground hover:bg-background/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-background/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-background/50" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-background">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">AgriCastNet</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge deep learning technology to transform your greenhouse management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="glass-card-hover p-6 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="icon-circle mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text-secondary">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get accurate microclimate predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <StepCard
                key={step.title}
                step={index + 1}
                {...step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/predict">
              <Button className="btn-gradient-secondary text-lg h-14 px-8 gap-2">
                Try It Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-background rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-background rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container-width relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your Greenhouse?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Start making data-driven decisions with AI-powered predictions today.
          </p>
          <Link to="/predict">
            <Button className="bg-background text-primary hover:bg-background/90 text-lg h-14 px-8 shadow-xl">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
