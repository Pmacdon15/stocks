import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  followStockAction,
  tradeStockAction,
  unfollowStockAction,
} from "@/actions/stocks";

type ApiResult<T> = { data?: T; error?: string | Error | null } | T;

async function resolveResult<T>(result: ApiResult<T>): Promise<T> {
  if (result && typeof result === "object" && "error" in result && result.error) {
    throw new Error(String(result.error));
  }

  if (result && typeof result === "object" && "data" in result) {
    return result.data as T;
  }

  return result as T;
}

export function useFollowStock() {
  return useMutation({
    mutationFn: async (symbol: string) => {
      const result = await followStockAction(symbol);
      return resolveResult(result);
    },
    onSuccess: (_, symbol) => {
      toast.success(`Successfully followed ${symbol}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to follow stock");
    },
  });
}

export function useUnfollowStock() {
  return useMutation({
    mutationFn: async (symbol: string) => {
      const result = await unfollowStockAction(symbol);
      return resolveResult(result);
    },
    onSuccess: (_, symbol) => {
      toast.success(`Successfully unfollowed ${symbol}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unfollow stock");
    },
  });
}

export function useTradeStock() {
  return useMutation({
    mutationFn: async ({
      symbol,
      shares,
      type,
    }: {
      symbol: string;
      shares: number;
      type: "BUY" | "SELL";
    }) => {
      const result = await tradeStockAction(symbol, shares, type);
      return resolveResult(result);
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Successfully executed ${variables.type} for ${variables.shares} shares of ${variables.symbol}`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to execute trade");
    },
  });
}
