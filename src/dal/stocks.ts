import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import { connection } from "next/server";
import {
  executeTradeDb,
  followStockDb,
  getOwnedStocks,
  getUserFollowedStocks,
  unfollowStockDb,
} from "@/db/queries";
import { getStockPrice } from "./market-data";
import { getAuthUser } from "./user";
export async function getFollowedStocks() {
  await connection;
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    return await getUserFollowedStocks(userId);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch followed stocks");
  }
}

export async function followStock(symbol: string) {
  const { userId } = await auth();
  if (!userId) return errAsync({ reason: "Not Authorized" } as const);

  try {
    const followed = await getUserFollowedStocks(userId);
    if (followed.length >= 10) {
      return errAsync({
        reason: "You can only follow up to 10 stocks.",
      } as const);
    }
    await followStockDb(userId, symbol);
    return okAsync({ userId });
  } catch (error: any) {
    console.error(error);
    return errAsync({
      reason: "Failed to follow stock",
    } as const);
  }
}

export async function unfollowStock(symbol: string) {
  const { userId } = await auth.protect();
  if (!userId) return errAsync({ reason: "Not Authorized" } as const);

  try {
    await unfollowStockDb(userId, symbol);
    return okAsync({ userId });
  } catch (error) {
    console.error(error);
    return errAsync({
      reason: "Failed to unfollow stock",
    } as const);
  }
}

export async function getPortfolio() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const owned = await getOwnedStocks(userId);
    return owned;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch portfolio");
  }
}

export async function tradeStock(
  symbol: string,
  shares: number,
  type: "BUY" | "SELL",
) {
  try {
    const [user, currentPrice] = await Promise.all([
      getAuthUser(),
      getStockPrice(symbol),
    ]);
    if (!user) return errAsync({ reason: "Not Authorized" } as const);

    const totalCost = shares * currentPrice;

    if (type === "BUY") {
      if (Number(user.balance) < totalCost) {
        return errAsync({ reason: "Insufficient funds" } as const);
      }
    } else {
      const owned = await getOwnedStocks(user.clerk_id);
      const stock = owned.find((s) => s.symbol === symbol);
      if (!stock || stock.shares < shares) {
        return errAsync({ reason: "Not enough shares to sell" } as const);
      }
    }

    await executeTradeDb(user.clerk_id, symbol, shares, currentPrice, type);
    return okAsync({ userId: user.clerk_id });
  } catch (error: any) {
    console.error(error);
    console.error(error);
    return errAsync({
      reason: "Failed to execute trade",
    } as const);
  }
}
