export interface CryptoData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  marketCap: string;
  icon: string;
  prediction: "rise" | "watch" | "risky";
  probability: number;
  sentiment: string;
  circulatingSupply: string;
}

export const cryptoData: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: "$95,234.56", change: 5.2, volume: "45.2B", marketCap: "1.87T", icon: "₿", prediction: "rise", probability: 78, sentiment: "Bullish", circulatingSupply: "19.6M" },
  { symbol: "ETH", name: "Ethereum", price: "$3,456.78", change: 3.8, volume: "23.1B", marketCap: "415.6B", icon: "Ξ", prediction: "rise", probability: 72, sentiment: "Bullish", circulatingSupply: "120.3M" },
  { symbol: "BNB", name: "Binance Coin", price: "$612.34", change: -1.2, volume: "2.1B", marketCap: "94.3B", icon: "⬡", prediction: "watch", probability: 58, sentiment: "Neutral", circulatingSupply: "154.5M" },
  { symbol: "SOL", name: "Solana", price: "$198.45", change: 8.5, volume: "4.5B", marketCap: "91.2B", icon: "◎", prediction: "rise", probability: 82, sentiment: "Very Bullish", circulatingSupply: "459.7M" },
  { symbol: "XRP", name: "Ripple", price: "$2.34", change: -2.1, volume: "8.9B", marketCap: "132.8B", icon: "✕", prediction: "risky", probability: 45, sentiment: "Bearish", circulatingSupply: "56.7B" },
  { symbol: "ADA", name: "Cardano", price: "$1.02", change: 1.5, volume: "1.8B", marketCap: "35.7B", icon: "₳", prediction: "watch", probability: 62, sentiment: "Neutral", circulatingSupply: "35.0B" },
  { symbol: "AVAX", name: "Avalanche", price: "$43.21", change: 4.3, volume: "892M", marketCap: "17.2B", icon: "⛰", prediction: "rise", probability: 68, sentiment: "Bullish", circulatingSupply: "398.2M" },
  { symbol: "DOT", name: "Polkadot", price: "$7.89", change: -0.8, volume: "456M", marketCap: "11.3B", icon: "●", prediction: "watch", probability: 55, sentiment: "Neutral", circulatingSupply: "1.4B" },
  { symbol: "MATIC", name: "Polygon", price: "$0.98", change: 6.7, volume: "678M", marketCap: "9.8B", icon: "⬢", prediction: "rise", probability: 75, sentiment: "Bullish", circulatingSupply: "10.0B" },
  { symbol: "LINK", name: "Chainlink", price: "$23.45", change: 2.9, volume: "1.2B", marketCap: "14.5B", icon: "⬡", prediction: "watch", probability: 64, sentiment: "Neutral", circulatingSupply: "617.1M" },
  { symbol: "UNI", name: "Uniswap", price: "$12.67", change: -3.4, volume: "345M", marketCap: "7.6B", icon: "🦄", prediction: "risky", probability: 48, sentiment: "Bearish", circulatingSupply: "600.0M" },
  { symbol: "ATOM", name: "Cosmos", price: "$9.87", change: 1.2, volume: "234M", marketCap: "3.8B", icon: "⚛", prediction: "watch", probability: 60, sentiment: "Neutral", circulatingSupply: "385.0M" },
];

export const getCryptoBySymbol = (symbol: string): CryptoData | undefined => {
  return cryptoData.find((crypto) => crypto.symbol === symbol);
};

export const generateCryptoHistoricalData = (currentPrice: number, days: number = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price fluctuation (±3-8%)
    const fluctuation = (Math.random() - 0.5) * 0.15;
    const price = currentPrice * (1 + fluctuation);
    const volume = Math.random() * 5000000000 + 1000000000; // Random volume
    
    data.push({
      date: date.toISOString(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(volume),
    });
  }
  
  return data;
};
