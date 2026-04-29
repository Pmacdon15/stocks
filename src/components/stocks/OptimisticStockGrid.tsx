'use client';

import { useOptimistic, startTransition } from 'react';
import { StockCard } from './StockCard';
import { followStockAction, unfollowStockAction } from '@/actions/stocks';
import { toast } from 'sonner';

interface OptimisticStock {
  symbol: string;
  price: number;
  isFollowed: boolean;
}

interface OptimisticStockGridProps {
  initialStocks: OptimisticStock[];
  removeOnUnfollow?: boolean;
}

export function OptimisticStockGrid({ initialStocks, removeOnUnfollow = false }: OptimisticStockGridProps) {
  const [optimisticStocks, addOptimisticStock] = useOptimistic(
    initialStocks,
    (state, { symbol, isFollowed }: { symbol: string; isFollowed: boolean }) => {
      if (removeOnUnfollow && !isFollowed) {
        return state.filter(s => s.symbol !== symbol);
      }
      return state.map(s => s.symbol === symbol ? { ...s, isFollowed } : s);
    }
  );

  const handleFollowToggle = async (symbol: string, currentFollowed: boolean) => {
    const newFollowedState = !currentFollowed;
    
    startTransition(() => {
      addOptimisticStock({ symbol, isFollowed: newFollowedState });
    });

    try {
      const result = newFollowedState 
        ? await followStockAction(symbol)
        : await unfollowStockAction(symbol);

      if ('error' in result) {
        toast.error(String(result.error));
      } else {
        toast.success(`Successfully ${newFollowedState ? 'followed' : 'unfollowed'} ${symbol}`);
      }
    } catch (e) {
      toast.error(`Failed to ${newFollowedState ? 'follow' : 'unfollowed'} ${symbol}`);
    }
  };

  if (optimisticStocks.length === 0) {
    return (
      <div className="text-center p-16 border-2 border-dashed rounded-[2rem] bg-muted/10 text-muted-foreground mt-8">
        No stocks to show.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {optimisticStocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          symbol={stock.symbol}
          price={stock.price}
          isFollowed={stock.isFollowed}
          onFollowToggle={() => handleFollowToggle(stock.symbol, stock.isFollowed)}
        />
      ))}
    </div>
  );
}
