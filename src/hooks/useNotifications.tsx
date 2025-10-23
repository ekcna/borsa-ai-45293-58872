import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useNotifications = (stockSymbol?: string) => {
  const { user } = useAuth();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkNotification = async () => {
    if (!user || !stockSymbol) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('stock_symbol', stockSymbol)
        .maybeSingle();

      if (error) throw error;
      setIsNotificationEnabled(!!data);
    } catch (error) {
      console.error('Error checking notification:', error);
    }
  };

  const toggleNotification = async () => {
    if (!user) {
      toast.error('Please sign in to enable notifications');
      return;
    }

    if (!stockSymbol) return;

    setLoading(true);
    try {
      if (isNotificationEnabled) {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id)
          .eq('stock_symbol', stockSymbol);

        if (error) throw error;
        toast.success('Notifications disabled');
        setIsNotificationEnabled(false);
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert({ user_id: user.id, stock_symbol: stockSymbol });

        if (error) throw error;
        toast.success('Notifications enabled');
        setIsNotificationEnabled(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update notification');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkNotification();
  }, [user, stockSymbol]);

  return { isNotificationEnabled, toggleNotification, loading };
};
