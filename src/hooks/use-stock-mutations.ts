import { useMutation } from '@tanstack/react-query';
import { followStockAction, unfollowStockAction, tradeStockAction } from '@/actions/stocks';
import { toast } from 'sonner';

export function useFollowStock() {
  return useMutation({
    mutationFn: (symbol: string) => followStockAction(symbol),
    onSuccess: (_, symbol) => {
      toast.success(`Successfully followed ${symbol}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to follow stock');
    }
  });
}

export function useUnfollowStock() {
  return useMutation({
    mutationFn: (symbol: string) => unfollowStockAction(symbol),
    onSuccess: (_, symbol) => {
      toast.success(`Successfully unfollowed ${symbol}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unfollow stock');
    }
  });
}

export function useTradeStock() {
  return useMutation({
    mutationFn: ({ symbol, shares, type }: { symbol: string; shares: number; type: 'BUY' | 'SELL' }) => 
      tradeStockAction(symbol, shares, type),
    onSuccess: (_, variables) => {
      toast.success(`Successfully executed ${variables.type} for ${variables.shares} shares of ${variables.symbol}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to execute trade');
    }
  });
}
