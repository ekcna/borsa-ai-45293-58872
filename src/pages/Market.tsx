import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockCard from "@/components/StockCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Filter, Loader2 } from "lucide-react";
import { Stock } from "@/data/turkishStocks";

const Market = () => {
  const { userPlan } = useAuth();
  const [filter, setFilter] = useState<"all" | "rise" | "watch" | "risky">("all");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("change");
  const [turkishStocks, setTurkishStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-turkish-stocks`;

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const data = await response.json();

        const formattedData: Stock[] = data.map((stock: any) => {
          const change = parseFloat(stock.change) || parseFloat(stock.changePercent) || 0;
          let prediction: "rise" | "watch" | "risky" = "watch";
          let probability = 60;
          let sentiment = "Neutral";

          if (change >= 3) {
            prediction = "rise";
            probability = 70 + Math.floor(Math.random() * 15);
            sentiment = change >= 5 ? "Very Positive" : "Positive";
          } else if (change < -1) {
            prediction = "risky";
            probability = 40 + Math.floor(Math.random() * 15);
            sentiment = "Negative";
          } else if (change >= 1) {
            prediction = "rise";
            probability = 65 + Math.floor(Math.random() * 10);
            sentiment = "Positive";
          } else {
            probability = 55 + Math.floor(Math.random() * 10);
          }

          const sectorMap: { [key: string]: string } = {
            ASELS: "Defense",
            TUPRS: "Energy",
            THYAO: "Airlines",
            EREGL: "Steel",
            AKBNK: "Banking",
            GARAN: "Banking",
            ISCTR: "Banking",
            KCHOL: "Holding",
            SAHOL: "Holding",
            SISE: "Industrial",
            TTKOM: "Telecom",
            PETKM: "Chemicals",
            BIMAS: "Retail",
            EKGYO: "Real Estate",
            TCELL: "Telecom"
          };

          return {
            symbol: stock.code,
            name: stock.name,
            prediction,
            probability,
            price: `₺${parseFloat(stock.price).toFixed(2)}`,
            change: parseFloat(change.toFixed(2)),
            sentiment,
            volume: `${(stock.volume / 1000000).toFixed(1)}M`,
            sector: sectorMap[stock.code] || "Other",
            marketCap: `₺${(parseFloat(stock.price) * stock.volume / 1000000).toFixed(1)}B`
          };
        });

        setTurkishStocks(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000);

    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading stock data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

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
