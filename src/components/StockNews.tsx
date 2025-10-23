import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, AlertCircle } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  source: string;
}

interface StockNewsProps {
  stockSymbol: string;
  stockName: string;
}

const StockNews = ({ stockSymbol, stockName }: StockNewsProps) => {
  // Mock news data - in production, this would fetch from a real news API
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: `${stockName} Reports Strong Quarterly Earnings`,
      summary: `${stockSymbol} exceeded market expectations with a 15% increase in quarterly revenue...`,
      date: "2 hours ago",
      sentiment: "positive",
      source: "Financial Times"
    },
    {
      id: "2",
      title: `Market Analysis: ${stockName} Stock Performance`,
      summary: `Analysts maintain neutral outlook on ${stockSymbol} amid market volatility...`,
      date: "5 hours ago",
      sentiment: "neutral",
      source: "Bloomberg"
    },
    {
      id: "3",
      title: `${stockName} Announces Strategic Partnership`,
      summary: `${stockSymbol} enters collaboration with major industry player, potential growth ahead...`,
      date: "1 day ago",
      sentiment: "positive",
      source: "Reuters"
    },
    {
      id: "4",
      title: `Regulatory Updates Affecting ${stockName}`,
      summary: `New regulations may impact ${stockSymbol} operations in the coming quarter...`,
      date: "2 days ago",
      sentiment: "negative",
      source: "Wall Street Journal"
    }
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Latest News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNews.map((news) => (
            <div
              key={news.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-sm leading-tight flex-1">
                  {news.title}
                </h3>
                <Badge variant="outline" className={getSentimentColor(news.sentiment)}>
                  <span className="flex items-center gap-1">
                    {getSentimentIcon(news.sentiment)}
                    {news.sentiment}
                  </span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {news.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{news.source}</span>
                <span>{news.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground text-center">
          News data is simulated for demonstration. Connect to a real news API for live updates.
        </div>
      </CardContent>
    </Card>
  );
};

export default StockNews;
