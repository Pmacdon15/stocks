import type { StockTicker } from "@/types/types";

export default async function TickerTape({
  tickerDataPromise,
}: {
  tickerDataPromise: Promise<StockTicker[]>;
}) {
  const tickerData = await tickerDataPromise;
  return (
    <div className="w-full bg-primary-background py-4 overflow-hidden flex items-center rounded-sm">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...tickerData].map((stock) => (
          <div
            key={stock.change + stock.price + stock.symbol}
            className="flex items-center gap-4 px-8"
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
