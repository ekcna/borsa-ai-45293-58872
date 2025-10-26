import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

async function fetchGoogleNews(searchQuery: string): Promise<NewsItem[]> {
  try {
    const encodedQuery = encodeURIComponent(searchQuery);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;
    
    console.log('Fetching news from:', rssUrl);
    const response = await fetch(rssUrl);
    const text = await response.text();
    
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const items = doc?.querySelectorAll('item') || [];
    
    const newsItems: NewsItem[] = [];
    
    for (let i = 0; i < Math.min(items.length, 10); i++) {
      const item = items[i] as any;
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // Simple sentiment analysis based on keywords
      const lowerText = (title + description).toLowerCase();
      let sentiment: "positive" | "neutral" | "negative" = "neutral";
      
      if (lowerText.includes('surge') || lowerText.includes('gain') || lowerText.includes('rise') || 
          lowerText.includes('profit') || lowerText.includes('growth') || lowerText.includes('bullish') ||
          lowerText.includes('up') || lowerText.includes('high') || lowerText.includes('strong')) {
        sentiment = "positive";
      } else if (lowerText.includes('drop') || lowerText.includes('fall') || lowerText.includes('loss') || 
                 lowerText.includes('decline') || lowerText.includes('bearish') || lowerText.includes('crash') ||
                 lowerText.includes('down') || lowerText.includes('weak') || lowerText.includes('plunge')) {
        sentiment = "negative";
      }
      
      newsItems.push({
        id: `news-${i}-${Date.now()}`,
        title: title.split(' - ')[0] || title,
        summary: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        date: new Date(pubDate).toISOString(),
        sentiment,
        source: 'Google News',
        url: link,
      });
    }
    
    return newsItems;
  } catch (error) {
    console.error('Error fetching Google News:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, name, type } = await req.json();
    console.log('Fetching news for:', { symbol, name, type });

    // Construct search query based on type
    const query = type === 'crypto' 
      ? `${name} ${symbol} cryptocurrency bitcoin news` 
      : `${name} ${symbol} BIST borsa istanbul stock news`;

    console.log('Search query:', query);

    // Fetch real news from Google News RSS
    const news = await fetchGoogleNews(query);
    
    console.log('Returning news items:', news.length);

    return new Response(
      JSON.stringify({ news, timestamp: new Date().toISOString() }),
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
