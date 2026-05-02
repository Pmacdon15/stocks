import { TrendingUp, Zap, Globe } from "lucide-react";

export function Features() {
  return (
    <section className="w-full py-32 space-y-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Feature 01 */}
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
              Powered by professional data feeds with millisecond accuracy.
              Experience the market as it happens.
            </p>
          </div>
        </div>

        {/* Feature 02 */}
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

        {/* Feature 03 */}
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
  );
}
