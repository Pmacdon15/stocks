"use server";

import { followStock, tradeStock, unfollowStock } from "@/dal/stocks";

export async function followStockAction(symbol: string) {
  await followStock(symbol);
  // revalidatePath('/follow');
}

export async function unfollowStockAction(symbol: string) {
  await unfollowStock(symbol);
  // revalidatePath('/follow');
}

export async function tradeStockAction(
  symbol: string,
  shares: number,
  type: "BUY" | "SELL",
) {
  await tradeStock(symbol, shares, type);
  // revalidatePath('/trade');
  // revalidatePath('/follow');
}
