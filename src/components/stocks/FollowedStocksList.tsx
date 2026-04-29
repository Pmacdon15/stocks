import { getStockPrice } from "@/dal/market-data";
import { getFollowedStocks } from "@/dal/stocks";
import { OptimisticStockGrid } from "./OptimisticStockGrid";

export async function FollowedStocksList({
  filterPromise,
}: {
  filterPromise: Promise<string>;
}) {
  const [stocks, filter] = await Promise.all([
    getFollowedStocks(),
    filterPromise,
  ]);

  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center p-16 border-2 border-dashed rounded-[2rem] bg-muted/10 text-muted-foreground mt-8">
        You are not following any stocks yet. Use the search bar above to add some.
      </div>
    );
  }

  let stocksWithPrices = await Promise.all(
    stocks.map(async (s) => ({
      symbol: s.symbol,
      price: await getStockPrice(s.symbol),
      isFollowed: true,
    }))
  );

  if (filter) {
    const f = filter.toLowerCase();
    stocksWithPrices = stocksWithPrices.filter((s) =>
      s.symbol.toLowerCase().includes(f),
    );
  }

  return (
    <OptimisticStockGrid 
      initialStocks={stocksWithPrices} 
      removeOnUnfollow={true} 
    />
  );
}
