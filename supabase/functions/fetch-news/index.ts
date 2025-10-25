import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  source: string;
  url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, name, type } = await req.json();
    console.log('Fetching news for:', { symbol, name, type });

    // Construct search query
    const query = type === 'crypto' 
      ? `${name} ${symbol} cryptocurrency news latest` 
      : `${name} ${symbol} stock market news latest`;

    // Use Brave Search API or similar - for now using a simple approach
    // In production, you'd want to use a proper news API
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=nws`;
    
    // For this demo, we'll create a structured response
    // In production, integrate with a real news API like NewsAPI, Alpha Vantage, or similar
    
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: `${name} Shows Strong Performance in Recent Trading`,
        summary: `${symbol} has demonstrated significant market activity with notable volume increases...`,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: "positive",
        source: "Financial Times",
        url: searchUrl
      },
      {
        id: "2",
        title: `Market Analysis: ${name} Outlook`,
        summary: `Analysts provide insights on ${symbol} performance and future projections...`,
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        sentiment: "neutral",
        source: "Bloomberg",
        url: searchUrl
      },
      {
        id: "3",
        title: `${name} Announces Strategic Updates`,
        summary: `${symbol} reveals new developments that could impact market position...`,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sentiment: "positive",
        source: "Reuters",
        url: searchUrl
      },
      {
        id: "4",
        title: `Market Volatility Affects ${name}`,
        summary: `${symbol} experiences fluctuations amid broader market movements...`,
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative",
        source: "Wall Street Journal",
        url: searchUrl
      }
    ];

    console.log('Returning news items:', mockNews.length);

    return new Response(
      JSON.stringify({ news: mockNews, timestamp: new Date().toISOString() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
