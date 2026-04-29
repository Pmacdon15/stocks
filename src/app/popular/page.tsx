import { Suspense } from "react";
import { SearchBar } from "@/components/stocks/SearchBar";
import { getStockPrice, searchMarketStocks } from "@/dal/market-data";
import { StockGridSkeleton } from "@/components/stocks/Skeletons";
import { getFollowedStocks } from "@/dal/stocks";
import { OptimisticStockGrid } from "@/components/stocks/OptimisticStockGrid";

async function PopularList() {
  const popular = await searchMarketStocks("a");
  const followedStocks = await getFollowedStocks() ?? [];
  const followedSet = new Set(followedStocks.map((s) => s.symbol));

  const popularWithPrices = await Promise.all(
    popular.map(async (s: any) => ({
      symbol: s.symbol,
      price: await getStockPrice(s.symbol),
      isFollowed: followedSet.has(s.symbol),
    })),
  );

  return (
    <OptimisticStockGrid 
      initialStocks={popularWithPrices} 
      removeOnUnfollow={false} 
    />
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

      <Suspense fallback={<div className="h-10 w-full max-w-lg bg-muted animate-pulse rounded-md"></div>}>
        <SearchBar />
      </Suspense>

      <Suspense
        fallback={
          <div className="mt-8">
            <StockGridSkeleton count={6} />
          </div>
        }
      >
        <PopularList />
      </Suspense>
    </div>
  );
}
