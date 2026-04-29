import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getCompanyDetails, getStockPrice } from "@/dal/market-data";
import {
  addDividendDb,
  getAllOwnedStocksWithUsers,
  getUser,
  savePortfolioSnapshot,
} from "@/db/queries";

export async function GET(request: Request) {
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    const ownedStocks = await getAllOwnedStocksWithUsers();

    // Get all unique symbols to fetch prices and yields
    const uniqueSymbols = Array.from(new Set(ownedStocks.map((s) => s.symbol)));
    const stockData: Record<string, { price: number; yield: number }> = {};

    for (const symbol of uniqueSymbols) {
      try {
        const [price, details] = await Promise.all([
          getStockPrice(symbol),
          getCompanyDetails(symbol),
        ]);
        stockData[symbol] = {
          price: price || 0,
          yield: details?.dividendYield || 0,
        };
      } catch (e) {
        console.error(`Error fetching data for ${symbol}:`, e);
        stockData[symbol] = { price: 0, yield: 0 };
      }
    }

    // Group by user to calculate total portfolio value and dividends
    const userStats: Record<
      string,
      { portfolioValue: number; dividend: number }
    > = {};

    for (const owned of ownedStocks) {
      const data = stockData[owned.symbol];
      if (data && data.price > 0) {
        if (!userStats[owned.user_id]) {
          userStats[owned.user_id] = { portfolioValue: 0, dividend: 0 };
        }

        userStats[owned.user_id].portfolioValue += owned.shares * data.price;

        if (data.yield > 0) {
          const dailyDividend =
            (owned.shares * data.price * (data.yield / 100)) / 365;
          userStats[owned.user_id].dividend += dailyDividend;
        }
      }
    }

    // Process each user: Add dividends and save snapshot
    // We also need to process users who might not have stocks but have a balance
    // For simplicity in this cron, we'll focus on users with active portfolios
    const processedUserIds = Object.keys(userStats);

    const updatePromises = processedUserIds.map(async (userId) => {
      const stats = userStats[userId];
      const user = await getUser(userId);
      if (!user) return;

      const currentBalance = Number(user.balance);
      const totalValue = currentBalance + stats.portfolioValue;

      // 1. Add Dividend if applicable
      if (stats.dividend > 0.005) {
        await addDividendDb(userId, Number(stats.dividend.toFixed(4)));
      }

      // 2. Save Snapshot for history
      await savePortfolioSnapshot(userId, totalValue);

      // 3. Revalidate cache
      revalidateTag(`portfolio-${userId}`, "max");
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      processedUsers: processedUserIds.length,
      symbolsProcessed: uniqueSymbols.length,
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
  