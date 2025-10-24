import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockCard from "@/components/StockCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Filter } from "lucide-react";
import { turkishStocks } from "@/data/turkishStocks";

const Market = () => {
  const { userPlan } = useAuth();
  const [filter, setFilter] = useState<"all" | "rise" | "watch" | "risky">("all");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("change");

  const getFilteredStocks = () => {
    let filtered = [...turkishStocks];

    switch (filter) {
      case "rise":
        filtered = filtered.filter((stock) => stock.change >= 3);
        break;
      case "watch":
        filtered = filtered.filter((stock) => stock.change >= -1 && stock.change <= 3);
        break;
      case "risky":
        filtered = filtered.filter((stock) => stock.change < -1);
        break;
    }

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case "change":
        filtered.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        break;
      case "volume":
        filtered.sort((a, b) => parseFloat(b.volume.replace(/[^\d.]/g, "")) - parseFloat(a.volume.replace(/[^\d.]/g, "")));
        break;
    }

    return filtered;
  };

  const filteredStocks = getFilteredStocks();
  const risingStocks = turkishStocks.filter((s) => s.change >= 3).length;
  const fallingStocks = turkishStocks.filter((s) => s.change < -1).length;
  const totalVolume = turkishStocks.reduce((acc, s) => acc + parseFloat(s.volume.replace(/[^\d.]/g, "")), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Turkish Stock Market</h1>
          <p className="text-muted-foreground">Real-time stock data from BIST</p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rising Stocks</p>
                <p className="text-2xl font-bold text-success">{risingStocks}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Falling Stocks</p>
                <p className="text-2xl font-bold text-destructive">{fallingStocks}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">{totalVolume.toFixed(0)}M</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={filter === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("all")}>
              <Filter className="h-3 w-3 mr-1" />
              All Stocks
            </Badge>
            <Badge variant={filter === "rise" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("rise")}>
              <TrendingUp className="h-3 w-3 mr-1" />
              Rising
            </Badge>
            <Badge variant={filter === "watch" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("watch")}>
              <Eye className="h-3 w-3 mr-1" />
              Watch List
            </Badge>
            <Badge variant={filter === "risky" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("risky")}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              Risky
            </Badge>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 rounded-md border border-input bg-background text-sm"
            >
              <option value="change">Sort by Change</option>
              <option value="name">Sort by Name</option>
              <option value="volume">Sort by Volume</option>
            </select>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {filteredStocks.map((stock) => (
            <StockCard key={stock.symbol} {...stock} userPlan={userPlan} />
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No stocks match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;
