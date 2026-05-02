import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 relative py-20">
      {/* Background Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-accent/30 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tight leading-[0.85] uppercase">
            Trade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_auto]">
              Everything.
            </span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-muted-foreground/80 lowercase">
            No risk. Pure performance.
          </h2>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          The ultimate market simulator. Real-time data, professional tools, and
          $10k to test your edge.
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
  );
}
