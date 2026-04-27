import { StockCard } from "@/components/stocks/StockCard";
import { Card, CardContent } from "@/components/ui/card";
import { getStockPrice } from "@/dal/market-data";
import { getPortfolio } from "@/dal/stocks";
import { getAuthUser } from "@/dal/user";

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

  if (filter) {
    const f = filter.toLowerCase();
    portfolioWithPrices = portfolioWithPrices.filter((s) =>
      s.symbol.toLowerCase().includes(f),
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Total Account Value
            </div>
            <div className="text-3xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Total Profit/Loss
            </div>
            <div
              className={`text-3xl font-bold ${totalProfit >= 0 ? "text-primary" : "text-destructive"}`}
            >
              {totalProfit >= 0 ? "+" : ""}$
              {totalProfit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-primary/20">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-primary mb-1">
              Buying Power
            </div>
            <div className="text-3xl font-bold text-primary">
              $
              {Number(user.balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Portfolio Value
            </div>
            <div className="text-3xl font-bold text-foreground">
              $
              {portfolioValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Positions</h2>
        {portfolioWithPrices.length === 0 ? (
          <div className="text-center p-12 border rounded-xl bg-muted/20 text-muted-foreground">
            {filter
              ? "No positions match your search."
              : "You don't own any stocks yet. Go to Popular or Follow to start trading."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
