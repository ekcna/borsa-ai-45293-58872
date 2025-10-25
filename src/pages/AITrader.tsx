import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Bot, TrendingUp, Shield, Zap, Play, Pause, Settings, AlertTriangle, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AITrader = () => {
  const { user, userPlan } = useAuth();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [riskLevel, setRiskLevel] = useState([50]);
  const [selectedAsset, setSelectedAsset] = useState("mixed");
  
  const canAccessAITrader = userPlan === 'ultimate';

  const handleToggleTrader = () => {
    if (!canAccessAITrader) {
      toast({
        title: "Premium Feature",
        description: "AI Trader is available for Ultimate plan members only.",
        variant: "destructive",
      });
      return;
    }

    setIsActive(!isActive);
    toast({
      title: isActive ? "AI Trader Stopped" : "AI Trader Started",
      description: isActive 
        ? "Your AI trading bot has been paused." 
        : "Your AI trading bot is now active and monitoring the market.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Trader</h1>
            {isActive && (
              <Badge className="bg-success text-success-foreground">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" />
                Active
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Automated trading powered by advanced AI algorithms</p>
        </div>

        {!user ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                <p className="text-muted-foreground mb-4">Please sign in to access AI Trader features</p>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : !canAccessAITrader ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ultimate Feature</h3>
                <p className="text-muted-foreground mb-4">Upgrade to Ultimate plan to unlock AI Trader</p>
                <Link to="/pricing">
                  <Button variant="hero" className="gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade to Ultimate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trading Configuration */}
            <Card className={!canAccessAITrader ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trading Configuration
                </CardTitle>
                <CardDescription>Set up your automated trading parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Trading Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={100}
                    max={100000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum: $100 • Maximum: $100,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asset">Asset Type</Label>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger id="asset">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Portfolio</SelectItem>
                      <SelectItem value="crypto">Crypto Only</SelectItem>
                      <SelectItem value="stocks">Stocks Only</SelectItem>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Risk Level</Label>
                    <span className="text-sm font-medium">
                      {riskLevel[0] < 30 ? "Low" : riskLevel[0] < 70 ? "Medium" : "High"} ({riskLevel[0]}%)
                    </span>
                  </div>
                  <Slider
                    value={riskLevel}
                    onValueChange={setRiskLevel}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Balanced</span>
                    <span>Aggressive</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleToggleTrader}
                    className="w-full"
                    size="lg"
                    variant={isActive ? "destructive" : "default"}
                  >
                    {isActive ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Stop AI Trader
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start AI Trader
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className={!canAccessAITrader ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Real-time trading statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold text-success">+$0.00</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-foreground">0%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold text-foreground">0</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold text-primary">0%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card className={!canAccessAITrader ? "opacity-50" : ""}>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Latest automated transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No trades yet. Start the AI Trader to begin.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Trader Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Smart Analysis</h4>
                    <p className="text-xs text-muted-foreground">AI analyzes market trends in real-time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Fast Execution</h4>
                    <p className="text-xs text-muted-foreground">Trades executed in milliseconds</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Risk Management</h4>
                    <p className="text-xs text-muted-foreground">Built-in stop-loss and take-profit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Trading involves risk. Past performance does not guarantee future results.</p>
                <p>Only invest what you can afford to lose.</p>
                <p>AI Trader is for educational purposes. Always do your own research.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrader;
