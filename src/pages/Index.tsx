import StockCard from "@/components/StockCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { turkishStocks } from "@/data/turkishStocks";

const Index = () => {
  const { user, userPlan, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("market") || "Market"}
          </h1>
          <p className="text-muted-foreground">
            {t("marketDescription") || "Browse all available stocks"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {turkishStocks.map((stock) => (
            <StockCard key={stock.symbol} {...stock} userPlan={userPlan} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
