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
        if (data[coinId]) {
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
      // For Turkish stocks, we'll use a simplified approach
      // In production, integrate with a real Turkish stock market API
      const prices: { [key: string]: any } = {};
      
      // Simulate price updates with realistic variations
      const stockPrices: { [key: string]: number } = {
        'THYAO': 285.50,
        'GARAN': 142.30,
        'ISCTR': 8.75,
        'TUPRS': 185.20,
        'AKBNK': 56.80,
        'EREGL': 48.90,
        'SASA': 125.60,
        'BIMAS': 178.40,
        'KCHOL': 215.70,
        'SAHOL': 92.30
      };

      for (const symbol of symbols) {
        const basePrice = stockPrices[symbol] || 100;
        // Add small random variation (-2% to +2%)
        const variation = (Math.random() - 0.5) * 0.04;
        const currentPrice = basePrice * (1 + variation);
        const change = variation * 100;

        prices[symbol] = {
          price: currentPrice,
          change: change,
          volume: Math.floor(Math.random() * 10000000) + 5000000
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
