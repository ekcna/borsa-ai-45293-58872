import { useState } from "react";
import StockCard from "@/components/StockCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { turkishStocks } from "@/data/turkishStocks";
import { TrendingUp, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Market = () => {
  const { userPlan } = useAuth();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "rise" | "watch" | "risky">("all");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("name");

  const filteredStocks = turkishStocks
    .filter((stock) => filter === "all" || stock.prediction === filter)
    .sort((a, b) => {
      if (sortBy === "name") return a.symbol.localeCompare(b.symbol);
      if (sortBy === "change") return b.change - a.change;
      if (sortBy === "volume") {
        const aVol = parseFloat(a.volume.replace(/[^0-9.]/g, ""));
        const bVol = parseFloat(b.volume.replace(/[^0-9.]/g, ""));
        return bVol - aVol;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              {t("market") || "Stock Market"}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {t("marketDescription") || "Browse and analyze Turkish stocks with AI-powered predictions"}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live Data
            </Badge>
            <Badge variant="outline">
              {turkishStocks.length} Stocks Available
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 items-center animate-fade-in">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Stocks
            </Button>
            <Button
              variant={filter === "rise" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rise")}
              className={filter === "rise" ? "bg-success hover:bg-success/90" : ""}
            >
              Likely to Rise
            </Button>
            <Button
              variant={filter === "watch" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("watch")}
              className={filter === "watch" ? "bg-warning hover:bg-warning/90" : ""}
            >
              Watch Closely
            </Button>
            <Button
              variant={filter === "risky" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("risky")}
              className={filter === "risky" ? "bg-muted hover:bg-muted/90" : ""}
            >
              Risky
            </Button>
          </div>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="change">Change %</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-gradient-card border border-border/50 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Total Stocks</p>
            <p className="text-2xl font-bold text-foreground">{turkishStocks.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-card border border-border/50 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Positive</p>
            <p className="text-2xl font-bold text-success">
              {turkishStocks.filter((s) => s.change > 0).length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-card border border-border/50 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">Negative</p>
            <p className="text-2xl font-bold text-destructive">
              {turkishStocks.filter((s) => s.change < 0).length}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-card border border-border/50 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-1">AI Predictions</p>
            <p className="text-2xl font-bold text-primary">{turkishStocks.length}</p>
          </div>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStocks.map((stock, index) => (
            <div 
              key={stock.symbol} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <StockCard {...stock} userPlan={userPlan} />
            </div>
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No stocks found matching your filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Market;
