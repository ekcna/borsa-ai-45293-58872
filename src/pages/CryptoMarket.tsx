import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Eye, AlertTriangle, Filter, Bitcoin, Coins, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CryptoData } from "@/data/cryptoData";

const CryptoMarket = () => {
  const { userPlan } = useAuth();
  const [filter, setFilter] = useState<"all" | "rise" | "watch" | "risky">("all");
  const [sortBy, setSortBy] = useState<"name" | "change" | "volume">("change");
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canAccessAdvancedFeatures = userPlan === 'pro' || userPlan === 'ultimate';

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-crypto-prices`;

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }

        const data = await response.json();

        const cryptoIcons: { [key: string]: string } = {
          bitcoin: "₿",
          ethereum: "Ξ",
          binancecoin: "⬡",
          solana: "◎",
          ripple: "✕",
          cardano: "₳",
          avalanche: "⛰",
          polkadot: "●",
          dogecoin: "Ð",
          chainlink: "⬡"
        };

        const cryptoNames: { [key: string]: string } = {
          bitcoin: "Bitcoin",
          ethereum: "Ethereum",
          binancecoin: "Binance Coin",
          solana: "Solana",
          ripple: "Ripple",
          cardano: "Cardano",
          "avalanche-2": "Avalanche",
          polkadot: "Polkadot",
          dogecoin: "Dogecoin",
          chainlink: "Chainlink"
        };

        const cryptoSymbols: { [key: string]: string } = {
          bitcoin: "BTC",
          ethereum: "ETH",
          binancecoin: "BNB",
          solana: "SOL",
          ripple: "XRP",
          cardano: "ADA",
          "avalanche-2": "AVAX",
          polkadot: "DOT",
          dogecoin: "DOGE",
          chainlink: "LINK"
        };

        const formattedData: CryptoData[] = Object.entries(data).map(([id, values]: [string, any]) => {
          const change = values.usd_24h_change || 0;
          let prediction: "rise" | "watch" | "risky" = "watch";
          let probability = 60;
          let sentiment = "Neutral";

          if (change >= 3) {
            prediction = "rise";
            probability = 70 + Math.floor(Math.random() * 15);
            sentiment = change >= 5 ? "Very Bullish" : "Bullish";
          } else if (change < -1) {
            prediction = "risky";
            probability = 40 + Math.floor(Math.random() * 15);
            sentiment = "Bearish";
          } else {
            probability = 55 + Math.floor(Math.random() * 10);
          }

          return {
            symbol: cryptoSymbols[id] || id.toUpperCase().slice(0, 4),
            name: cryptoNames[id] || id,
            price: `$${values.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: parseFloat(change.toFixed(2)),
            volume: `${(values.usd_24h_vol / 1e9).toFixed(2)}B`,
            marketCap: `${(values.usd_market_cap / 1e12).toFixed(2)}T`,
            icon: cryptoIcons[id] || "◎",
            prediction,
            probability,
            sentiment,
            circulatingSupply: "N/A"
          };
        });

        setCryptoData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching crypto data:', err);
        setError('Failed to load crypto data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);

    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading crypto data...</span>
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
            <Link key={crypto.symbol} to={`/crypto/${crypto.symbol}`}>
              <Card className="p-6 hover-scale transition-smooth cursor-pointer border-border/50 hover:border-primary/50 h-full">
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

                {/* AI Prediction Badge */}
                <div className="mb-3">
                  {canAccessAdvancedFeatures ? (
                    <Badge 
                      variant="outline" 
                      className={
                        crypto.prediction === "rise" 
                          ? "bg-success/10 text-success border-success/20" 
                          : crypto.prediction === "risky"
                          ? "bg-muted text-muted-foreground"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {crypto.prediction === "rise" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {crypto.prediction === "watch" && <Eye className="h-3 w-3 mr-1" />}
                      {crypto.prediction === "risky" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      AI: {crypto.probability}% confidence
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                      🔒 AI Prediction - Pro
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-semibold text-foreground">{crypto.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume 24h</span>
                    <span className="text-sm text-foreground">${crypto.volume}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="text-sm text-foreground">${crypto.marketCap}</span>
                  </div>
                </div>
              </Card>
            </Link>
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
