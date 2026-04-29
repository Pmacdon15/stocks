import { StockCard } from "@/components/stocks/StockCard";
import { getStockPrice } from "@/dal/market-data";
import { getPortfolio } from "@/dal/stocks";
import { getAuthUser } from "@/dal/user";
import { PortfolioOverview } from "./PortfolioOverview";
import { getPortfolioSnapshots } from "@/db/queries";
import { Suspense } from "react";

export async function PortfolioList({
  filterPromise,
}: {
  filterPromise?: Promise<string>
}) {
  const [portfolio, filter, user] = await Promise.all([
    getPortfolio(),
    filterPromise,
    getAuthUser(),
  ]);

  let portfolioWithPrices = await Promise.all(
    portfolio?.map(async (s) => ({
      ...s,
      currentPrice: await getStockPrice(s.symbol),
    })) || [],
  );

  const portfolioValue = portfolioWithPrices.reduce(
    (acc, stock) => acc + stock.shares * stock.currentPrice,
    0,
  );
  const totalValue = Number(user.balance) + portfolioValue;
  const totalProfit = totalValue - 10000;

  // Fetch initial history on server
  const snapshots = await getPortfolioSnapshots(user.clerk_id, "1W");
  const initialHistory = snapshots.length <= 1 
    ? [
        snapshots[0] || { time: Date.now() / 1000 - 86400, value: 10000 },
        { time: Date.now() / 1000, value: totalValue }
      ]
    : snapshots;

  if (filter) {
    const f = filter.toLowerCase();
    portfolioWithPrices = portfolioWithPrices.filter((s) =>
      s.symbol.toLowerCase().includes(f),
    );
  }

  return (
    <div className="space-y-12">
      <Suspense fallback={
        <div className="w-full h-[400px] bg-muted/20 animate-pulse rounded-[2rem] border border-border/50 flex items-center justify-center">
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      }>
        <PortfolioOverview 
          totalValue={totalValue}
          totalProfit={totalProfit}
          buyingPower={Number(user.balance)}
          portfolioValue={portfolioValue}
          initialHistory={initialHistory}
        />
      </Suspense>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Your Positions</h2>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border/50">
            {portfolioWithPrices.length} Active Assets
          </div>
        </div>
        
        {portfolioWithPrices.length === 0 ? (
          <div className="text-center p-16 border-2 border-dashed rounded-[2rem] bg-muted/10 text-muted-foreground">
            {filter
              ? "No positions match your search."
              : "You don't own any stocks yet. Go to Popular or Follow to start trading."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioWithPrices.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                price={stock.currentPrice}
                ownedShares={stock.shares}
                averageCost={stock.averageCost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
