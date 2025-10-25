import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PriceData {
  price: number;
  change: number;
  marketCap?: number;
  volume?: number;
}

interface PricesMap {
  [symbol: string]: PriceData;
}

export const usePriceUpdates = (type: 'crypto' | 'stocks', symbols: string[]) => {
  const [prices, setPrices] = useState<PricesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchPrices = useCallback(async () => {
    try {
      console.log('Fetching prices for:', { type, symbols });
      
      const { data, error } = await supabase.functions.invoke('fetch-prices', {
        body: { type, symbols }
      });

      if (error) throw error;

      if (data?.prices) {
        setPrices(data.prices);
        setLastUpdate(new Date());
        console.log('Prices updated:', data.prices);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: "Error updating prices",
        description: "Failed to fetch latest prices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, symbols, toast]);

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Update every 10 seconds for real-time updates
    const interval = setInterval(fetchPrices, 10000);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, isLoading, lastUpdate, refetch: fetchPrices };
};
