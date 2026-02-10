import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StepCard from "@/components/ui/StepCard";
import heroImage from "@/assets/about-bg.jpg";

// BENEFITS
const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description:
      "Deep learning models trained on extensive greenhouse data for accurate microclimate forecasting.",
  },
  {
    icon: Clock,
    title: "24-Hour Forecasting",
    description:
      "Get detailed predictions for the next 24 hours to plan your greenhouse management.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Intelligent risk scoring to identify potential issues before they affect your crops.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Comprehensive metrics and visualizations to understand your greenhouse conditions.",
  },
];

const metrics = [
  { icon: Thermometer, label: "Temperature", color: "text-red-500" },
  { icon: Droplets, label: "Humidity", color: "text-blue-400" },
  { icon: Wind, label: "CO₂ Levels", color: "text-purple-500" },
  { icon: Leaf, label: "Soil Moisture", color: "text-green-500" },
];

const steps = [
  {
    icon: Upload,
    title: "Input Data",
    description:
      "Enter sensor readings manually or upload your CSV data with greenhouse measurements.",
  },
  {
    icon: LineChart,
    title: "AI Forecast",
    description:
      "Our deep learning model analyzes patterns and generates accurate 24-hour predictions.",
  },
  {
    icon: FileText,
    title: "Get Report",
    description:
      "Receive detailed insights, risk assessment, and actionable recommendations.",
  },
];

// HOMEPAGE
const Home = () => {
  return (
    <div className="min-h-screen w-full">

      {/* ================= HERO SECTION ================= */}
         <section className="relative min-h-screen w-full flex items-center">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Garden"
          className="w-full h-full object-cover"
        />

        {/* Green overlay (same as DreamHub) */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-800/60 via-green-700/40 to-transparent"></div>
      </div>

      {/* MAIN LEFT PANEL */}
      <div className="relative z-20 ml-6 md:ml-20 max-w-xl 
                      bg-green-900/40 backdrop-blur-xl 
                      p-8 md:p-10 rounded-3xl flex flex-col 
                      items-center 
                      shadow-2xl border border-white/20">

        {/* Top label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 
                        rounded-full bg-white/20 border border-white/30 
                        text-white mb-4">
          <Sparkles className="w-4 h-4" />
         <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"> Agri<span className="text-green-300">Cast</span>Net </h1>
        </div>

        {/* Title */}
        
       {/* Subtitle */}
        <p className="text-white/90 text-lg mb-8"> A Unified Deep Forecasting Framework for Smart Greenhouse Microclimates.</p>

         {/* METRICS ROW */}
          <div className="flex gap-6 mb-10">
            {metrics.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-md">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-xs text-white/90">{label}</span>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Link to="/predict">
              <Button className="bg-green-600 hover:bg-green-700 text-white h-12 px-6 shadow-xl rounded-lg flex gap-2">
                Start Prediction
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/about">
              <Button className="h-12 px-6 bg-white/30 backdrop-blur-sm border border-white/50 text-white hover:bg-white/40 shadow-md rounded-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* ================= BENEFITS SECTION ================= */}
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
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="glass-card-hover p-6 text-center">
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

      {/* ================= HOW IT WORKS ================= */}
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
            {steps.map((step, i) => (
              <StepCard
                key={step.title}
                step={i + 1}
                {...step}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/predict">
              <Button className="btn-gradient-secondary text-lg h-14 px-8 gap-2 shadow-lg">
                Try It Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
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
