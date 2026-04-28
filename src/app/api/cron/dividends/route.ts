import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getCompanyDetails, getStockPrice } from "@/dal/market-data";
import { addDividendDb, getAllOwnedStocksWithUsers } from "@/db/queries";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const ownedStocks = await getAllOwnedStocksWithUsers();
    if (ownedStocks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No portfolios to process",
      });
    }

    const uniqueSymbols = Array.from(new Set(ownedStocks.map((s) => s.symbol)));

    const stockData: Record<string, { price: number; yield: number }> = {};

    // Fetch data for all unique symbols
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

    const userDividends: Record<string, number> = {};

    for (const owned of ownedStocks) {
      const data = stockData[owned.symbol];
      if (data && data.yield > 0 && data.price > 0) {
        // Daily dividend: (shares * price * (yield / 100)) / 365
        const dailyDividend =
          (owned.shares * data.price * (data.yield / 100)) / 365;
        userDividends[owned.user_id] =
          (userDividends[owned.user_id] || 0) + dailyDividend;
      }
    }

    const updatePromises = Object.entries(userDividends).map(
      async ([userId, amount]) => {
        console.log(`User: ${userId} amount ${amount}`)
        if (amount > 0.005) {
          // Only update if it's at least half a cent
          await addDividendDb(userId, Number(amount.toFixed(4)));
          revalidateTag(`portfolio-${userId}`,'max');
        }
      },
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      processedUsers: Object.keys(userDividends).length,
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
