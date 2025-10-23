import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useWishlist = (stockSymbol?: string) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkWishlist = async () => {
    if (!user || !stockSymbol) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('stock_symbol', stockSymbol)
        .maybeSingle();

      if (error) throw error;
      setIsInWishlist(!!data);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    if (!stockSymbol) return;

    setLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('stock_symbol', stockSymbol);

        if (error) throw error;
        toast.success('Removed from wishlist');
        setIsInWishlist(false);
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, stock_symbol: stockSymbol });

        if (error) throw error;
        toast.success('Added to wishlist');
        setIsInWishlist(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkWishlist();
  }, [user, stockSymbol]);

  return { isInWishlist, toggleWishlist, loading };
};
