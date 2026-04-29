"use server";

import { updateTag } from "next/cache";
import { followStock, tradeStock, unfollowStock } from "@/dal/stocks";

export async function followStockAction(symbol: string) {
  const res = await followStock(symbol);
  return res.match(
    (data) => {
      updateTag(`followed-stocks-${data.user_id}`);
      return { data };
    },
    (err) => {
      return { error: err.reason };
    },
  );
}

export async function unfollowStockAction(symbol: string) {
  const res = await unfollowStock(symbol);
  return res.match(
    (data) => {
      updateTag(`followed-stocks-${data.user_id}`);
      return { data };
    },
    (err) => {
      return { error: err.reason };
    },
  );
}

export async function tradeStockAction(
  symbol: string,
  shares: number,
  type: "BUY" | "SELL",
) {
  const res = await tradeStock(symbol, shares, type);
  return res.match(
    (data) => {
      updateTag(`portfolio-${data.userId}`);
      updateTag(`transactions-${data.userId}`)
      return { data };
    },
    (err) => {
      return { error: err.reason };
    },
  );
}
