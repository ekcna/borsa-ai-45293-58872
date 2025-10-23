import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sparkles,
  Brain,
  TrendingUp,
  Bell,
  Heart,
  BarChart3,
  Shield,
  Zap,
  Target,
  Crown,
} from "lucide-react";
import heroImage from "@/assets/hero-market.jpg";

const Home = () => {
  const { user, userPlan } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models analyze market patterns to predict stock movements with confidence scores.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analysis",
      description: "Get instant insights on Turkish stocks with live data updates and technical indicators.",
      color: "text-success"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay informed with intelligent alerts for your watchlisted stocks and market changes.",
      color: "text-warning"
    },
    {
      icon: Heart,
      title: "Wishlist Management",
      description: "Track your favorite stocks and build a personalized portfolio with easy-to-use tools.",
      color: "text-destructive"
    },
    {
      icon: BarChart3,
      title: "Advanced Charts",
      description: "Visualize stock performance with interactive charts, volume data, and historical trends.",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy measures.",
      color: "text-primary"
    },
  ];

  const plans = [
    {
      name: "Free",
      icon: Sparkles,
      features: ["Basic stock viewing", "Limited predictions", "Standard support"],
      color: "bg-muted"
    },
    {
      name: "Pro",
      icon: Zap,
      features: ["AI predictions", "Unlimited watchlist", "Priority support", "Advanced charts"],
      color: "bg-gradient-to-br from-primary to-primary-glow"
    },
    {
      name: "Ultimate",
      icon: Crown,
      features: ["Everything in Pro", "Real-time news", "Lifetime data history", "Premium support"],
      color: "bg-gradient-to-br from-accent to-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(139, 92, 246, 0.9) 100%), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "multiply",
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00Yy0xLjEgMC0yLS45LTItMnYtNHptMCAxNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMmgtNGMtMS4xIDAtMi0uOS0yLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTRjLTEuMSAwLTItLjktMi0ydi00ek0yMiAxNmMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMmgtNGMtMS4xIDAtMi0uOS0yLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTRjLTEuMSAwLTItLjktMi0ydi00em0wIDE0YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00Yy0xLjEgMC0yLS45LTItMnYtNHpNOCAxNmMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMkg4YzAtMS4xLjktMiAyLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJIOGMwLTEuMS45LTIgMi0ydi00em0wIDE0YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAySDhjMC0xLjEuOS0yIDItMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4 animate-fade-in">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI & Machine Learning
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight animate-fade-in">
              Smart Turkish Stock
              <br />
              <span className="bg-gradient-to-r from-success via-accent to-primary-glow bg-clip-text text-transparent">
                Market Predictions
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              AI-powered platform for analyzing and predicting BIST stock movements. 
              Get real-time insights, manage your watchlist, and make informed investment decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Link to="/market">
                  <Button size="xl" variant="hero" className="gap-2 animate-scale-in">
                    <TrendingUp className="h-5 w-5" />
                    Browse Market
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="xl" variant="hero" className="gap-2 animate-scale-in">
                    Get Started Free
                  </Button>
                </Link>
              )}
              <Link to="/pricing">
                <Button
                  size="xl"
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Smart Trading
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and AI-driven insights to help you navigate the Turkish stock market with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-elevated transition-smooth hover-scale cursor-pointer bg-gradient-card border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Simple Steps to Start
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start hover-scale transition-smooth">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Sign Up & Choose Your Plan
                </h3>
                <p className="text-muted-foreground">
                  Create a free account or upgrade to Pro/Ultimate for advanced features and unlimited access to AI predictions.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start hover-scale transition-smooth">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-success-foreground font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Explore Stocks & AI Predictions
                </h3>
                <p className="text-muted-foreground">
                  Browse Turkish stocks, view AI-powered predictions with confidence scores, and add favorites to your wishlist.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start hover-scale transition-smooth">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Track & Get Notifications
                </h3>
                <p className="text-muted-foreground">
                  Enable notifications for your tracked stocks and receive smart alerts about market movements and opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Preview */}
      {user && userPlan !== 'ultimate' && (
        <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="outline">
                Pricing Plans
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Perfect Plan
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index}
                  className="hover:shadow-elevated transition-smooth hover-scale border-border/50"
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${plan.color} flex items-center justify-center mb-4`}>
                      <plan.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing">
                      <Button className="w-full" variant={plan.name === "Pro" ? "default" : "outline"}>
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-hero rounded-2xl p-8 md:p-12 text-center shadow-elevated">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors using AI-powered insights to make better trading decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/market">
                  <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Go to Market
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              AI-Powered Turkish Stock Market Analysis
            </p>
            <p>
              Not financial advice. For educational purposes only.
            </p>
            <p className="mt-4">
              Creator: <span className="font-semibold">Emir Kaan CAF</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
