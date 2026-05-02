import { Globe, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import TickerTape from "@/components/home/ticker-tape";
import { Button } from "@/components/ui/button";
import { getStockQuote, searchMarketStocks } from "@/dal/market-data";
import type { StockTicker } from "@/types/types";

export default async function Home() {
  const popularStocksPromise = searchMarketStocks("a");
  const tickerDataPromise: Promise<StockTicker[]> = popularStocksPromise.then(
    (data) =>
      Promise.all(
        data.map(async (stock: { symbol: string }) => {
          const quote = await getStockQuote(stock.symbol);
          return {
            symbol: stock.symbol,
            price: quote.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            change: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
          };
        }),
      ),
  );

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Ticker Tape */}
      <div className="w-full border-y border-border/40 bg-card/30 backdrop-blur-md py-4 overflow-hidden flex items-center">
        <Suspense>
          <TickerTape tickerDataPromise={tickerDataPromise} />
        </Suspense>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Background Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-75 h-75 bg-accent/30 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tight leading-[0.85] uppercase">
              Trade <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary animate-gradient bg-size[200%_auto]">
                Everything.
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-muted-foreground/80 lowercase">
              No risk. Pure performance.
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            The ultimate market simulator. Real-time data, professional tools,
            and $10k to test your edge.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/trade" />}
              className="h-16 px-12 rounded-full text-xl font-black bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/20"
            >
              Start Trading
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/popular" />}
              className="h-16 px-12 rounded-full text-xl font-bold border-2 hover:bg-secondary/50 transition-colors"
            >
              Explore Markets
            </Button>
          </div>
        </div>
      </main>

      {/* New Experience Section */}
      <section className="w-full py-32 space-y-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-24 group">
            <span className="text-8xl md:text-[12rem] font-black text-primary/10 group-hover:text-primary/30 transition-colors duration-500 leading-none">
              01
            </span>
            <div className="space-y-4 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                <TrendingUp className="w-10 h-10 text-primary" />
                Precision
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                Powered by professional data feeds with accuracy. Experience the
                market as it happens.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8 md:gap-24 group mt-40">
            <span className="text-8xl md:text-[12rem] font-black text-accent/10 group-hover:text-accent/30 transition-colors duration-500 leading-none">
              02
            </span>
            <div className="space-y-4 max-w-xl text-left md:text-right flex flex-col items-start md:items-end">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                Strategy
                <Zap className="w-10 h-10 text-accent-foreground" />
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                Backtest your wildest ideas without ever risking a single cent.
                Build your edge with infinite capital.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-24 group mt-40">
            <span className="text-8xl md:text-[12rem] font-black text-primary/10 group-hover:text-primary/30 transition-colors duration-500 leading-none">
              03
            </span>
            <div className="space-y-4 max-w-xl">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                <Globe className="w-10 h-10 text-primary" />
                Access
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                Trade US equities and major crypto pairs from one interface. The
                entire world, simulated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <footer className="w-full py-24 border-t border-border/40 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Ready to{" "}
            <span className="text-primary italic underline decoration-accent/50 underline-offset-8">
              test
            </span>{" "}
            your edge?
          </h2>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/trade" />}
            className="h-20 px-16 rounded-full text-2xl font-black bg-foreground text-background hover:scale-105 transition-transform"
          >
            Enter Simulation
          </Button>
        </div>
      </footer>
    </div>
  );
}
