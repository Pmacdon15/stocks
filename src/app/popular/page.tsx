import { Suspense } from "react";
import { SearchBar } from "@/components/stocks/SearchBar";
import { StockCard } from "@/components/stocks/StockCard";
import { getStockPrice, searchMarketStocks } from "@/dal/market-data";

import { getFollowedStocks } from "@/dal/stocks";

async function PopularList() {
  const [popular, followedStocks] = await Promise.all([
    searchMarketStocks("a"), 
    getFollowedStocks(),
  ]);

  const followedSet = new Set(followedStocks.map((s) => s.symbol));

  const popularWithPrices = await Promise.all(
    popular.map(async (s: any) => ({
      ...s,
      currentPrice: await getStockPrice(s.symbol),
      isFollowed: followedSet.has(s.symbol),
    })),
  );

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularWithPrices.map((s: any) => (
        <StockCard
          key={s.symbol}
          symbol={s.symbol}
          price={s.currentPrice}
          isFollowed={s.isFollowed}
        />
      ))}
    </div>
  );
}

export default function PopularPage() {
  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Popular Stocks</h1>
        <p className="text-muted-foreground">
          Explore trending stocks to add to your watchlist or portfolio.
        </p>
      </div>

      <SearchBar />

      <Suspense
        fallback={
          <div className="mt-8 text-center text-muted-foreground animate-pulse p-12 bg-muted/10 rounded-xl border">
            Loading popular stocks...
          </div>
        }
      >
        <PopularList />
      </Suspense>
    </div>
  );
}
