import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import StockCard from "@/components/StockCard";
import { turkishStocks } from "@/data/turkishStocks";
import { Loader2 } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [notificationStocks, setNotificationStocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("stock_symbol")
        .eq("user_id", user.id);

      if (error) throw error;
      setNotificationStocks(data.map((item) => item.stock_symbol));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const notificationEnabledStocks = turkishStocks.filter((stock) =>
    notificationStocks.includes(stock.symbol)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("notifications") || "My Notifications"}
          </h1>
          <p className="text-muted-foreground">
            {t("notificationsDescription") || "Stocks you're monitoring"}
          </p>
        </div>

        {notificationEnabledStocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t("noNotifications") || "No notification preferences set yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notificationEnabledStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
