export interface Stock {
  symbol: string;
  name: string;
  prediction: "rise" | "watch" | "risky";
  probability: number;
  price: string;
  change: number;
  sentiment: string;
  volume: string;
  sector: string;
  marketCap: string;
}

export interface StockHistoricalData {
  date: string;
  price: number;
  volume: number;
}

export const turkishStocks: Stock[] = [
  {
    symbol: "ASELS",
    name: "Aselsan Elektronik",
    prediction: "rise",
    probability: 78,
    price: "₺45.80",
    change: 2.3,
    sentiment: "Very Positive",
    volume: "8.2M",
    sector: "Defense",
    marketCap: "₺41.2B",
  },
  {
    symbol: "TUPRS",
    name: "Tüpraş",
    prediction: "rise",
    probability: 72,
    price: "₺189.50",
    change: 1.8,
    sentiment: "Positive",
    volume: "5.1M",
    sector: "Energy",
    marketCap: "₺127.3B",
  },
  {
    symbol: "THYAO",
    name: "Türk Hava Yolları",
    prediction: "watch",
    probability: 65,
    price: "₺312.25",
    change: -0.5,
    sentiment: "Neutral",
    volume: "12.3M",
    sector: "Airlines",
    marketCap: "₺215.7B",
  },
  {
    symbol: "EREGL",
    name: "Ereğli Demir Çelik",
    prediction: "rise",
    probability: 81,
    price: "₺56.40",
    change: 3.2,
    sentiment: "Very Positive",
    volume: "15.8M",
    sector: "Steel",
    marketCap: "₺89.4B",
  },
  {
    symbol: "AKBNK",
    name: "Akbank",
    prediction: "rise",
    probability: 76,
    price: "₺67.85",
    change: 1.5,
    sentiment: "Positive",
    volume: "22.4M",
    sector: "Banking",
    marketCap: "₺176.4B",
  },
  {
    symbol: "GARAN",
    name: "Garanti Bankası",
    prediction: "watch",
    probability: 68,
    price: "₺124.30",
    change: 0.3,
    sentiment: "Neutral",
    volume: "18.7M",
    sector: "Banking",
    marketCap: "₺312.5B",
  },
  {
    symbol: "SAHOL",
    name: "Sabancı Holding",
    prediction: "rise",
    probability: 74,
    price: "₺89.60",
    change: 2.1,
    sentiment: "Positive",
    volume: "9.3M",
    sector: "Holding",
    marketCap: "₺223.8B",
  },
  {
    symbol: "KCHOL",
    name: "Koç Holding",
    prediction: "rise",
    probability: 79,
    price: "₺198.75",
    change: 2.8,
    sentiment: "Very Positive",
    volume: "7.1M",
    sector: "Holding",
    marketCap: "₺496.3B",
  },
  {
    symbol: "TCELL",
    name: "Turkcell",
    prediction: "watch",
    probability: 62,
    price: "₺98.45",
    change: -0.8,
    sentiment: "Neutral",
    volume: "11.2M",
    sector: "Telecom",
    marketCap: "₺217.6B",
  },
  {
    symbol: "PETKM",
    name: "Petkim",
    prediction: "risky",
    probability: 45,
    price: "₺23.15",
    change: -1.9,
    sentiment: "Negative",
    volume: "6.8M",
    sector: "Chemicals",
    marketCap: "₺23.1B",
  },
  {
    symbol: "ARCLK",
    name: "Arçelik",
    prediction: "watch",
    probability: 66,
    price: "₺134.20",
    change: 0.5,
    sentiment: "Neutral",
    volume: "4.9M",
    sector: "Electronics",
    marketCap: "₺98.4B",
  },
  {
    symbol: "BIMAS",
    name: "BIM Birleşik Mağazalar",
    prediction: "rise",
    probability: 83,
    price: "₺456.50",
    change: 3.7,
    sentiment: "Very Positive",
    volume: "3.2M",
    sector: "Retail",
    marketCap: "₺278.2B",
  },
];

// Generate historical data for charts
export const generateHistoricalData = (
  currentPrice: number,
  days: number = 30
): StockHistoricalData[] => {
  const data: StockHistoricalData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price fluctuation
    const volatility = 0.03;
    const trend = Math.random() > 0.5 ? 1.005 : 0.995;
    const randomChange = 1 + (Math.random() - 0.5) * volatility;
    const price = currentPrice * trend * randomChange * (1 - i * 0.002);
    
    // Generate volume with some randomness
    const baseVolume = 1000000 + Math.random() * 5000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.round(baseVolume),
    });
  }
  
  return data;
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  return turkishStocks.find((stock) => stock.symbol === symbol);
};
