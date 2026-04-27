import { StockCard } from "@/components/stocks/StockCard";
import { getStockPrice } from "@/dal/market-data";
import { getFollowedStocks } from "@/dal/stocks";

export async function FollowedStocksList({
  filterPromise,
}: {
  filterPromise: Promise<string>;
}) {
  const [stocks, filter] = await Promise.all([
    getFollowedStocks(),
    filterPromise,
  ]);

  if (stocks?.length === 0) {
    return (
      <div className="text-center p-12 border rounded-xl bg-muted/20 text-muted-foreground mt-8">
        You are not following any stocks yet. Use the search bar above to add
        some.
      </div>
    );
  }

  let stocksWithPrices = await Promise.all(
    stocks?.map(async (s) => ({
      ...s,
      currentPrice: await getStockPrice(s.symbol),
    })) ?? [],
  );

  if (filter) {
    const f = filter.toLowerCase();
    stocksWithPrices = stocksWithPrices.filter((s) =>
      s.symbol.toLowerCase().includes(f),
    );
  }

  if (stocksWithPrices.length === 0) {
    return (
      <div className="text-center p-12 border rounded-xl bg-muted/20 text-muted-foreground mt-8">
        No followed stocks match your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {stocksWithPrices.map((stock) => (
        <StockCard
          key={stock.symbol}
          symbol={stock.symbol}
          price={stock.currentPrice}
          isFollowed={true}
        />
      ))}
    </div>
  );
}
