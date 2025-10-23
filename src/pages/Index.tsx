import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockCard from "@/components/StockCard";
import FeatureCard from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Sparkles,
  Newspaper,
  Settings,
  BarChart3,
  Bell,
  Brain,
  TrendingUp,
  Heart,
  Crown,
} from "lucide-react";
import heroImage from "@/assets/hero-market.jpg";
import { turkishStocks } from "@/data/turkishStocks";

const Index = () => {
  const { user, userPlan, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  // Display first 8 stocks on homepage
  const featuredStocks = turkishStocks.slice(0, 8);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Forecasting",
      description:
        "Advanced machine learning models analyze price patterns, volume data, and market trends to predict short-term stock movements with probabilistic confidence.",
    },
    {
      icon: Newspaper,
      title: "Smart News Analysis",
      description:
        "Natural Language Processing monitors Turkish financial news, company announcements, and social sentiment to gauge market mood in real-time.",
    },
    {
      icon: Settings,
      title: "Custom Strategy Builder",
      description:
        "Set your risk tolerance, preferred industries, and time horizon. The AI adapts its algorithms to match your personal investing style.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description:
        "Beautiful, intuitive visualizations show trending stocks at a glance. Friendly colors and clear data help you make informed decisions quickly.",
    },
    {
      icon: Bell,
      title: "Lovable Alerts",
      description:
        "Get friendly, empathetic notifications instead of robotic warnings. Stay informed without feeling overwhelmed or stressed.",
    },
    {
      icon: Heart,
      title: "Educational Insights",
      description:
        "Learn while you invest. Clear explanations of AI predictions, market behavior tips, and responsible investing guidance built right in.",
    },
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
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI & Machine Learning
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              {t("heroTitle")}
              <br />
              <span className="bg-gradient-to-r from-success via-accent to-primary-glow bg-clip-text text-transparent">
                {t("heroSubtitle")}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              {t("heroDescription")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="xl" variant="hero" className="gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("startExploring")}
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
              >
                {t("learnHow")}
              </Button>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-8 text-primary-foreground/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                <span>{t("liveMarketData")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
                <span>{t("aiPowered")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse-soft" />
                <span>{t("multiLanguage")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Predictions Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              {t("livePredictions")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("todaysPredictions")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("aiAnalysis")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} userPlan={userPlan} />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
                {t("updatedRecently")}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Upgrade CTA Section - Only show for non-Ultimate users */}
      {user && userPlan !== 'ultimate' && (
        <section className="py-12 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00Yy0xLjEgMC0yLS45LTItMnYtNHptMCAxNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMmgtNGMtMS4xIDAtMi0uOS0yLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTRjLTEuMSAwLTItLjktMi0ydi00ek0yMiAxNmMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMmgtNGMtMS4xIDAtMi0uOS0yLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJoLTRjLTEuMSAwLTItLjktMi0ydi00em0wIDE0YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAyaC00Yy0xLjEgMC0yLS45LTItMnYtNHpNOCAxNmMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDJ2NGMwIDEuMS0uOSAyLTIgMkg4YzAtMS4xLjktMiAyLTJ2LTR6bTAgMTRjMC0xLjEuOS0yIDItMmg0YzEuMSAwIDIgLjkgMiAydjRjMCAxLjEtLjkgMi0yIDJIOGMwLTEuMS45LTIgMi0ydi00em0wIDE0YzAtMS4xLjktMiAyLTJoNGMxLjEgMCAyIC45IDIgMnY0YzAgMS4xLS45IDItMiAySDhjMC0xLjEuOS0yIDItMnYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
          
          <div className="container relative mx-auto px-4 text-center">
            <Crown className="h-12 w-12 text-primary-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              {userPlan === 'free' ? t("unlockFeatures") : t("upgradeToUltimate")}
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              {userPlan === 'free' 
                ? 'Get AI-powered predictions, real-time alerts, and unlimited watchlist access'
                : 'Access real-time news, lifetime data history, and premium support'}
            </p>
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="gap-2 shadow-elevated">
                <Crown className="h-5 w-5" />
                {t("viewPricing")}
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              {t("features")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("everythingYouNeed")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("powerfulTools")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              {t("howItWorks")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("poweredByAI")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("aiExplains")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  We Collect & Analyze Data
                </h3>
                <p className="text-muted-foreground">
                  Real-time BIST market data, trading volumes, technical indicators (RSI, MACD, moving
                  averages), and Turkish financial news are continuously monitored and processed.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-success-foreground font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  AI Models Make Predictions
                </h3>
                <p className="text-muted-foreground">
                  Machine learning algorithms combine technical analysis (60%), sentiment analysis (30%),
                  and volume trends (10%) to calculate probability scores for each stock's movement.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  You Get Clear, Friendly Insights
                </h3>
                <p className="text-muted-foreground">
                  Results are presented in plain language with confidence scores, sentiment indicators, and
                  educational context — never cold numbers, always helpful guidance.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12 p-6 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-start gap-4">
              <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">The "Lovable" Difference</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We never promise profits or give financial advice. Instead, we educate, encourage, and
                  empower you to make your own informed decisions. Think of us as your friendly guide, not a
                  fortune teller.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-hero rounded-2xl p-8 md:p-12 text-center shadow-elevated">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              {t("readyToStart")}
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              {t("joinThousands")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                {t("getStartedFree")}
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20"
              >
                {t("viewDemo")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">
              {t("footerTagline")}
            </p>
            <p>
              {t("footerDisclaimer")}
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

export default Index;
