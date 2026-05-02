import type { StockTicker } from "@/types/types";

export default async function TrickerTape({
  tickerDataPromise,
}: {
  tickerDataPromise: Promise<StockTicker[]>;
}) {
  const tickerData = await tickerDataPromise;
  return (
    <div className="w-full border-y border-border/40 bg-card/30 backdrop-blur-md py-4 overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...tickerData].map((stock) => (
          <div
            key={stock.change + stock.price + stock.symbol}
            className="flex items-center gap-4 px-8 border-r border-border/30"
          >
            <span className="font-black tracking-tighter text-xl">
              {stock.symbol}
            </span>
            <span className="font-mono text-lg">{stock.price}</span>
            <span
              className={`text-sm font-bold ${stock.change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
