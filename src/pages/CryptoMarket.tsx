import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Filter, Bitcoin, Coins } from "lucide-react";
import { Link } from "react-router-dom";

interface CryptoData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  marketCap: string;
  icon: string;
}

const cryptoData: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: "$95,234.56", change: 5.2, volume: "45.2B", marketCap: "1.87T", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: "$3,456.78", change: 3.8, volume: "23.1B", marketCap: "415.6B", icon: "Ξ" },
  { symbol: "BNB", name: "Binance Coin", price: "$612.34", change: -1.2, volume: "2.1B", marketCap: "94.3B", icon: "⬡" },
  { symbol: "SOL", name: "Solana", price: "$198.45", change: 8.5, volume: "4.5B", marketCap: "91.2B", icon: "◎" },
  { symbol: "XRP", name: "Ripple", price: "$2.34", change: -2.1, volume: "8.9B", marketCap: "132.8B", icon: "✕" },
  { symbol: "ADA", name: "Cardano", price: "$1.02", change: 1.5, volume: "1.8B", marketCap: "35.7B", icon: "₳" },
  { symbol: "AVAX", name: "Avalanche", price: "$43.21", change: 4.3, volume: "892M", marketCap: "17.2B", icon: "⛰" },
  { symbol: "DOT", name: "Polkadot", price: "$7.89", change: -0.8, volume: "456M", marketCap: "11.3B", icon: "●" },
  { symbol: "MATIC", name: "Polygon", price: "$0.98", change: 6.7, volume: "678M", marketCap: "9.8B", icon: "⬢" },
  { symbol: "LINK", name: "Chainlink", price: "$23.45", change: 2.9, volume: "1.2B", marketCap: "14.5B", icon: "⬡" },
  { symbol: "UNI", name: "Uniswap", price: "$12.67", change: -3.4, volume: "345M", marketCap: "7.6B", icon: "🦄" },
  { symbol: "ATOM", name: "Cosmos", price: "$9.87", change: 1.2, volume: "234M", marketCap: "3.8B", icon: "⚛" },
];

const CryptoMarket = () => {
  const { userPlan } = useAuth();
  const [filter, setFilter] = useState<"all" | "rise" | "watch" | "risky">("all");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("change");

  const getFilteredCrypto = () => {
    let filtered = [...cryptoData];

    switch (filter) {
      case "rise":
        filtered = filtered.filter((crypto) => crypto.change >= 3);
        break;
      case "watch":
        filtered = filtered.filter((crypto) => crypto.change >= -1 && crypto.change <= 3);
        break;
      case "risky":
        filtered = filtered.filter((crypto) => crypto.change < -1);
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

  const filteredCrypto = getFilteredCrypto();
  const risingCrypto = cryptoData.filter((c) => c.change >= 3).length;
  const fallingCrypto = cryptoData.filter((c) => c.change < -1).length;
  const totalMarketCap = cryptoData.reduce((acc, c) => {
    const value = parseFloat(c.marketCap.replace(/[^\d.]/g, ""));
    return acc + value;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Bitcoin className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Crypto Market</h1>
          </div>
          <p className="text-muted-foreground">Real-time cryptocurrency prices and trends</p>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rising Coins</p>
                <p className="text-2xl font-bold text-success">{risingCrypto}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Falling Coins</p>
                <p className="text-2xl font-bold text-destructive">{fallingCrypto}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 hover-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="text-2xl font-bold text-foreground">${totalMarketCap.toFixed(1)}T</p>
              </div>
              <Coins className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
          <div className="flex gap-2 flex-wrap">
            <Badge variant={filter === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("all")}>
              <Filter className="h-3 w-3 mr-1" />
              All Coins
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

        {/* Crypto Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredCrypto.map((crypto) => (
            <Card key={crypto.symbol} className="p-6 hover-scale transition-smooth cursor-pointer border-border/50 hover:border-primary/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-2xl">
                    {crypto.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{crypto.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{crypto.name}</p>
                  </div>
                </div>
                <Badge variant={crypto.change >= 0 ? "default" : "destructive"} className="text-xs">
                  {crypto.change >= 0 ? "+" : ""}{crypto.change}%
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold text-foreground">{crypto.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Volume 24h</span>
                  <span className="text-sm text-foreground">{crypto.volume}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="text-sm text-foreground">${crypto.marketCap}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  {userPlan !== 'free' && (
                    <Button size="sm" variant="default" className="flex-1">
                      Add Alert
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCrypto.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cryptocurrencies match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoMarket;
