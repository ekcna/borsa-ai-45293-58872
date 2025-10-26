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
      // Fetch real Turkish stock prices from Yahoo Finance
      const prices: { [key: string]: any } = {};
      
      // Fetch prices for all symbols in parallel
      const stockPromises = symbols.map(async (symbol: string) => {
        try {
          // Yahoo Finance uses .IS suffix for Istanbul Stock Exchange
          const yahooSymbol = `${symbol}.IS`;
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=2d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            console.error(`Yahoo Finance API error for ${symbol}: ${response.status}`);
            return { symbol, data: null };
          }

          const data = await response.json();
          const result = data?.chart?.result?.[0];
          
          if (result?.meta && result?.indicators?.quote?.[0]) {
            const meta = result.meta;
            const quote = result.indicators.quote[0];
            const currentPrice = meta.regularMarketPrice || quote.close?.[quote.close.length - 1];
            const previousClose = meta.chartPreviousClose;
            
            // Calculate 24h change percentage
            const change = previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0;
            
            // Get volume
            const volumes = quote.volume || [];
            const volume = volumes[volumes.length - 1] || 0;

            return {
              symbol,
              data: {
                price: currentPrice,
                change: change,
                volume: volume
              }
            };
          }
          
          return { symbol, data: null };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return { symbol, data: null };
        }
      });

      const results = await Promise.all(stockPromises);
      
      // Build prices object
      for (const result of results) {
        if (result.data) {
          prices[result.symbol] = result.data;
        }
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
