import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import {
  executeTradeDb,
  followStockDb,
  getOwnedStocks,
  getTransactions,
  getUserAmountOfStocksDb,
  getUserFollowedStocks,
  unfollowStockDb,
} from "@/db/queries";
import { getStockPrice } from "./market-data";
import { getAuthUser } from "./user";

export async function getHistory(page: number = 1, limit: number = 20, search?: string) {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  const offset = (page - 1) * limit;

  try {
    return await getTransactions(userId, limit, offset, search);
  } catch (error) {
    console.error(error);
  }
}
export async function getFollowedStocks() {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  try {
    return await getUserFollowedStocks(userId);
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to fetch followed stocks");
  }
}

export async function followStock(symbol: string) {
  const { userId, has } = await auth.protect();
  if (!userId)
    return errAsync({
      reason: "Unauthorized",
    } as const);
  const followLimit = has({ feature: "follow_10_stocks" })
    ? 10
    : has({ feature: "follow_20_stocks" })
      ? 20
      : 0;
  try {
    const followed = await getUserFollowedStocks(userId);
    if (followed.length >= followLimit) {
      return errAsync({
        reason: "You can only follow up to 10 stocks.",
      } as const);
    }
    const result = await followStockDb(userId, symbol);
    return okAsync(result);
  } catch (error: any) {
    console.error(error);
    return errAsync({
      reason: "Failed to follow stock",
    } as const);
  }
}

export async function unfollowStock(symbol: string) {
  const { userId } = await auth.protect();
  if (!userId)
    return errAsync({
      reason: "Unauthorized",
    } as const);

  try {
    const result = await unfollowStockDb(userId, symbol);
    return okAsync(result);
  } catch (error) {
    console.error(error);
    return errAsync({
      reason: "Failed to unfollow stock",
    } as const);
  }
}

export async function getPortfolio() {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("Unauthorized");

  try {
    const owned = await getOwnedStocks(userId);
    return owned;
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to fetch portfolio");
  }
}

export async function tradeStock(
  symbol: string,
  shares: number,
  type: "BUY" | "SELL",
) {
  const { userId, has } = await auth.protect();
  if (!userId) return errAsync({ reason: "Unauthorized" } as const);
  const stockLimit = has({ feature: "trade_10_stocks" })
    ? 10
    : has({ feature: "trade_20_stocks" })
      ? 20
      : 0;

  try {
    const user = await getAuthUser();
    if (!user) return errAsync({ reason: "User not found" } as const);
    const amountOfStocks = await getUserAmountOfStocksDb(user.clerk_id);
    if (amountOfStocks >= stockLimit) {
      return errAsync({
        reason: `Your stock limit is ${stockLimit}, you have ${amountOfStocks}`,
      } as const);
    }
    const currentPrice = await getStockPrice(symbol);
    const totalCost = shares * currentPrice;

    if (type === "BUY") {
      if (Number(user.balance) < totalCost) {
        return errAsync({ reason: "Insufficient funds" } as const);
      }
    } else {
      const owned = await getOwnedStocks(userId);
      const stock = owned.find((s) => s.symbol === symbol);
      if (!stock || stock.shares < shares) {
        return errAsync({ reason: "Not enough shares to sell" } as const);
      }
    }

    await executeTradeDb(userId, symbol, shares, currentPrice, type);
    return okAsync({ userId });
  } catch (error: any) {
    console.error(error);
    return errAsync({
      reason: error.message || "Failed to execute trade",
    } as const);
  }
}
