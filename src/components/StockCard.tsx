import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface StockCardProps {
  symbol: string;
  name: string;
  prediction: "rise" | "watch" | "risky";
  probability: number;
  price: string;
  change: number;
  sentiment: string;
  volume: string;
  userPlan?: 'free' | 'pro' | 'ultimate' | null;
}

const StockCard = ({
  symbol,
  name,
  prediction,
  probability,
  price,
  change,
  sentiment,
  volume,
  userPlan,
}: StockCardProps) => {
  const isPositive = change >= 0;
  const predictionConfig = {
    rise: {
      badge: "bg-success text-success-foreground",
      icon: TrendingUp,
      text: "Likely to Rise",
      color: "text-success",
    },
    watch: {
      badge: "bg-warning text-warning-foreground",
      icon: Eye,
      text: "Watch Closely",
      color: "text-warning",
    },
    risky: {
      badge: "bg-muted text-muted-foreground",
      icon: TrendingDown,
      text: "Risky",
      color: "text-muted-foreground",
    },
  };

  const config = predictionConfig[prediction];
  const Icon = config.icon;
  const navigate = useNavigate();
  const isFreeUser = userPlan === 'free';
  const isNotLoggedIn = userPlan === null;

  return (
    <Card 
      className="p-6 bg-gradient-card hover:shadow-elevated transition-smooth cursor-pointer border-border/50"
      onClick={() => navigate(`/stock/${symbol}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground">{symbol}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        {!isFreeUser && !isNotLoggedIn ? (
          <Badge className={cn("gap-1", config.badge)}>
            <Icon className="h-3 w-3" />
            {config.text}
          </Badge>
        ) : (
          <div className="relative inline-block">
            <Badge className={cn("gap-1 blur-sm", config.badge)}>
              <Icon className="h-3 w-3" />
              {config.text}
            </Badge>
            <Badge className="absolute inset-0 bg-muted text-muted-foreground gap-1">
              🔒 {isNotLoggedIn ? 'Sign In' : 'Pro'}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">{price}</span>
          <span
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? "+" : ""}
            {change}%
          </span>
        </div>

        <div className="pt-3 border-t border-border/50 space-y-2">
          {!isFreeUser && !isNotLoggedIn ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Confidence</span>
                <span className={cn("font-semibold", config.color)}>{probability}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sentiment</span>
                <span className="font-medium text-foreground">{sentiment}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                🔒 {isNotLoggedIn ? 'Sign in to see AI predictions' : 'Upgrade to see AI predictions'}
              </p>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-medium text-foreground">{volume}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StockCard;
