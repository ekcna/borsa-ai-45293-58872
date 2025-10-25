import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useNotifications } from "@/hooks/useNotifications";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowLeft,
  Heart,
  Bell,
  Share2,
  ChevronDown,
  Lock,
  Crown,
} from "lucide-react";
import { getStockBySymbol, generateHistoricalData } from "@/data/turkishStocks";
import StockNews from "@/components/StockNews";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { useState } from "react";

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = symbol ? getStockBySymbol(symbol) : undefined;
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M");
  const { user, userPlan } = useAuth();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist(symbol);
  const { isNotificationEnabled, toggleNotification, loading: notificationLoading } = useNotifications(symbol);
  
  const canAccessAdvancedFeatures = userPlan === 'pro' || userPlan === 'ultimate';
  const canAccessNews = userPlan === 'ultimate';

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Stock Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The stock symbol "{symbol}" could not be found in our database.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceValue = parseFloat(stock.price.replace("₺", "").replace(",", ""));
  const historicalData = generateHistoricalData(priceValue, 30);

  const predictionConfig = {
    rise: {
      badge: "bg-success text-success-foreground",
      icon: TrendingUp,
      text: "Likely to Rise",
      color: "text-success",
      explanation:
        "Our AI models indicate strong bullish momentum based on technical indicators and positive market sentiment.",
    },
    watch: {
      badge: "bg-warning text-warning-foreground",
      icon: Eye,
      text: "Watch Closely",
      color: "text-warning",
      explanation:
        "Mixed signals detected. Technical analysis suggests caution while sentiment remains neutral. Monitor closely for directional confirmation.",
    },
    risky: {
      badge: "bg-muted text-muted-foreground",
      icon: TrendingDown,
      text: "Risky",
      color: "text-muted-foreground",
      explanation:
        "Negative technical indicators and sentiment suggest potential downside risk. Consider waiting for stronger signals before entry.",
    },
  };

  const config = predictionConfig[stock.prediction];
  const Icon = config.icon;
  const isPositive = stock.change >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{stock.symbol}</h1>
              <p className="text-xl text-muted-foreground">{stock.name}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{stock.sector}</Badge>
                <span className="text-sm text-muted-foreground">Market Cap: {stock.marketCap}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={cn(isInWishlist && "text-destructive")}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleNotification}
                disabled={notificationLoading}
                className={cn(isNotificationEnabled && "text-primary")}
              >
                <Bell className={cn("h-4 w-4", isNotificationEnabled && "fill-current")} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold text-foreground">{stock.price}</span>
            <span
              className={cn(
                "text-2xl font-semibold flex items-center gap-1",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
              {isPositive ? "+" : ""}
              {stock.change}%
            </span>
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Price Chart</h2>
                <div className="flex gap-2">
                  {(["1D", "1W", "1M", "3M", "1Y"] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₺${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString("tr-TR")}
                    formatter={(value: number) => [`₺${value.toFixed(2)}`, "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Volume Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trading Volume</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      `${(value / 1000000).toFixed(2)}M shares`,
                      "Volume",
                    ]}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Prediction Card */}
            <Card className="p-6 bg-gradient-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Prediction</p>
                  {canAccessAdvancedFeatures ? (
                    <Badge className={cn("mt-1", config.badge)}>{config.text}</Badge>
                  ) : (
                    <div className="relative mt-1">
                      <Badge className={cn("blur-sm", config.badge)}>{config.text}</Badge>
                      <Badge className="absolute inset-0 bg-muted text-muted-foreground">
                        🔒 {user ? 'Pro' : 'Sign In'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {canAccessAdvancedFeatures ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className={cn("font-bold", config.color)}>{stock.probability}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-hero h-2 rounded-full transition-all"
                        style={{ width: `${stock.probability}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground leading-relaxed">{config.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 relative">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center p-6">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground mb-3">Pro Feature</p>
                      <Link to="/pricing">
                        <Button size="sm" variant="hero" className="gap-2">
                          <Crown className="h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Blurred content */}
                  <div className="opacity-30 blur-sm">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className={cn("font-bold", config.color)}>{stock.probability}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-gradient-hero h-2 rounded-full transition-all"
                          style={{ width: `${stock.probability}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground leading-relaxed">{config.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Key Metrics */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-semibold text-foreground">{stock.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-semibold text-foreground">{stock.marketCap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sentiment</span>
                  <span className="font-semibold text-foreground">{stock.sentiment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector</span>
                  <span className="font-semibold text-foreground">{stock.sector}</span>
                </div>
              </div>
            </Card>

            {/* Recent News */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Recent News</h3>
              
              {canAccessNews ? (
                <>
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Strong Q4 earnings reported
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago • Bloomberg HT</p>
                    </div>
                    <div className="pb-3 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Analyst upgrades stock rating
                      </p>
                      <p className="text-xs text-muted-foreground">5 hours ago • Reuters</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Market outlook remains positive</p>
                      <p className="text-xs text-muted-foreground">1 day ago • Anadolu Agency</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All News
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="space-y-4 relative min-h-[200px]">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center p-6">
                      <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground mb-1">Ultimate Feature</p>
                      <p className="text-xs text-muted-foreground mb-3">Real-time news tracking</p>
                      <Link to="/pricing">
                        <Button size="sm" variant="hero" className="gap-2">
                          <Crown className="h-4 w-4" />
                          Upgrade to Ultimate
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Blurred content */}
                  <div className="opacity-20 blur-sm">
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-border/50">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Strong Q4 earnings reported
                        </p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="pb-3 border-b border-border/50">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Analyst upgrades stock rating
                        </p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Full-width News Section */}
        <div className="mt-8">
          <StockNews stockSymbol={stock.symbol} stockName={stock.name} type="stock" />
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
