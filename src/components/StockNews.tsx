import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  source: string;
  url?: string;
}

interface StockNewsProps {
  stockSymbol: string;
  stockName: string;
  type?: 'stock' | 'crypto';
}

const StockNews = ({ stockSymbol, stockName, type = 'stock' }: StockNewsProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching news for:', { stockSymbol, stockName, type });
      
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { 
          symbol: stockSymbol, 
          name: stockName,
          type: type 
        }
      });

      if (error) throw error;

      if (data?.news) {
        setNews(data.news);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error loading news",
        description: "Failed to fetch latest news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [stockSymbol, stockName, type]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "negative":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Newspaper className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success/10 text-success border-success/20";
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Latest News & Updates
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && news.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((newsItem) => (
              <a
                key={newsItem.id}
                href={newsItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-sm leading-tight flex-1">
                    {newsItem.title}
                  </h3>
                  <Badge variant="outline" className={getSentimentColor(newsItem.sentiment)}>
                    <span className="flex items-center gap-1">
                      {getSentimentIcon(newsItem.sentiment)}
                      {newsItem.sentiment}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {newsItem.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{newsItem.source}</span>
                  <span>{formatDate(newsItem.date)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
        <div className="mt-4 p-3 bg-success/10 rounded-lg text-xs text-success text-center flex items-center justify-center gap-2">
          <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
          Live news updates • Refreshes every 5 minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default StockNews;
