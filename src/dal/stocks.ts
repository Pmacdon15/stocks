import { auth } from "@clerk/nextjs/server";
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
  if (!userId) throw new Error("Unauthorized");

  try {
    const followed = await getUserFollowedStocks(userId);
    if (followed.length >= 10) {
      throw new Error("You can only follow up to 10 stocks.");
    }
    await followStockDb(userId, symbol);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to follow stock");
  }
}

export async function unfollowStock(symbol: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await unfollowStockDb(userId, symbol);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to unfollow stock");
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
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await getAuthUser();
    const currentPrice = await getStockPrice(symbol);
    const totalCost = shares * currentPrice;

    if (type === "BUY") {
      if (Number(user.balance) < totalCost) {
        throw new Error("Insufficient funds");
      }
    } else {
      const owned = await getOwnedStocks(userId);
      const stock = owned.find((s) => s.symbol === symbol);
      if (!stock || stock.shares < shares) {
        throw new Error("Not enough shares to sell");
      }
    }

    await executeTradeDb(userId, symbol, shares, currentPrice, type);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to execute trade");
  }
}
