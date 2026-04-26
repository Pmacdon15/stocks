import Link from "next/link";
import { StockCard } from "@/components/stocks/StockCard";
import { getFollowedStocks, getPortfolio } from "@/dal/stocks";

export async function StockDetail({
  symbolPromise,
  pricePromise,
}: {
  symbolPromise: Promise<string>;
  pricePromise: Promise<number>;
}) {
  const [portfolio, price, symbol] = await Promise.all([
    getPortfolio(),
    pricePromise,
    symbolPromise,
    getFollowedStocks(),
  ]);

  const ownedPosition = portfolio.find((s) => s.symbol === symbol);

  if (!symbol) {
    return (
      <div className="py-8 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Stock not found</h1>
        <Link href="/trade" className="text-primary hover:underline">
          Return to Trade page
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto">
      <StockCard
        symbol={symbol}
        price={price}
        ownedShares={ownedPosition?.shares}
      />
    </div>
  );
}
