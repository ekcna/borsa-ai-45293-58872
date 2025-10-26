import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, symbols } = await req.json();
    console.log('Fetching prices for:', { type, symbols });

    if (type === 'crypto') {
      // Fetch crypto prices from CoinGecko API
      const symbolMap: { [key: string]: string } = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'SOL': 'solana',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOGE': 'dogecoin',
        'DOT': 'polkadot',
        'AVAX': 'avalanche-2',
        'MATIC': 'matic-network',
        'LINK': 'chainlink',
        'UNI': 'uniswap',
        'ATOM': 'cosmos',
        'LTC': 'litecoin',
        'NEAR': 'near'
      };

      const coinIds = symbols.map((sym: string) => symbolMap[sym]).filter(Boolean).join(',');
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('CoinGecko response:', data);

      // Transform data to match our format
      const prices: { [key: string]: any } = {};
      
      for (const [symbol, coinId] of Object.entries(symbolMap)) {
        if (data[coinId] && data[coinId].usd) {
          prices[symbol] = {
            price: data[coinId].usd,
            change: data[coinId].usd_24h_change || 0,
            marketCap: data[coinId].usd_market_cap || 0,
            volume: data[coinId].usd_24h_vol || 0
          };
        }
      }

      return new Response(
        JSON.stringify({ prices, timestamp: new Date().toISOString() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (type === 'stocks') {
      // Use Google Finance-style API or fallback to Yahoo Finance
      // For now, using a more realistic simulation based on actual Turkish stock market
      const prices: { [key: string]: any } = {};
      
      // More realistic Turkish stock prices (in TRY)
      const baseStockPrices: { [key: string]: number } = {
        'THYAO': 285.50,  // Turkish Airlines
        'GARAN': 142.30,  // Garanti Bank
        'ISCTR': 8.75,    // Isbank
        'TUPRS': 185.20,  // Tupras
        'AKBNK': 56.80,   // Akbank
        'EREGL': 48.90,   // Eregli
        'SASA': 125.60,   // Sasa
        'BIMAS': 178.40,  // BIM
        'KCHOL': 215.70,  // Koc Holding
        'SAHOL': 92.30    // Sabanci Holding
      };

      for (const symbol of symbols) {
        const basePrice = baseStockPrices[symbol] || 100;
        // Add realistic market variation (-1.5% to +1.5%)
        const variation = (Math.random() - 0.5) * 0.03;
        const currentPrice = basePrice * (1 + variation);
        const change = variation * 100;
        
        // Realistic volume for Turkish stocks (in millions TRY)
        const volumeBase = basePrice * 100000; // Scale volume by price
        const volumeVariation = Math.random() * 0.5 + 0.75; // 75% to 125%
        const volume = volumeBase * volumeVariation;

        prices[symbol] = {
          price: currentPrice,
          change: change,
          volume: volume
        };
      }

      return new Response(
        JSON.stringify({ prices, timestamp: new Date().toISOString() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Invalid type specified');

  } catch (error) {
    console.error('Error fetching prices:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
