import { Activity, ArrowRight, Globe, LineChart, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen py-12 px-4 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Hero Bento Box */}
        <div className="lg:col-span-8 bg-card border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-semibold mb-8 border border-accent/20 shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live Market Simulation
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
                Trade the future,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  risk free.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed">
                Step into a professional trading environment. Start with a
                $10,000 simulated balance and test your strategies against
                real-time market data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/trade" />}
                className="rounded-2xl px-8 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
              >
                Enter Portfolio <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                nativeButton={false}
                render={<Link href="/popular" />}
                className="rounded-2xl px-8 h-14 text-lg font-bold hover:bg-secondary/80 border border-border/50"
              >
                View Markets
              </Button>
            </div>
          </div>
        </div>

        {/* Side Bento Boxes */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Top Mini Box */}
          <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -right-6 -top-6 text-white/10 group-hover:rotate-12 transition-transform duration-500">
              <LineChart className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Real-Time Data
              </h3>
              <p className="text-primary-foreground/90 leading-relaxed font-medium">
                Lightning fast stock quotes and historical charts powered by
                Alpaca Markets.
              </p>
            </div>
          </div>

          {/* Bottom Mini Box */}
          <div className="bg-card border border-border/60 rounded-[2rem] p-8 shadow-lg flex-1 flex flex-col justify-between group hover:border-accent/30 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Zero Capital Risk
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Build confidence in your trading logic and algorithms before
                deploying real cash.
              </p>
            </div>
          </div>
        </div>

        {/* Full Width Bottom Bento */}
        <div className="lg:col-span-12 bg-secondary/30 border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-secondary/60 transition-colors backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="h-16 w-16 bg-background rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-border/50">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                Join thousands of simulated traders
              </h3>
              <p className="text-muted-foreground text-lg">
                Experience the most realistic market simulator on the web.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="rounded-xl h-14 px-8 whitespace-nowrap bg-background border-border/50 hover:border-primary/30 text-lg font-semibold shadow-sm w-full md:w-auto"
            render={<Link href="/follow" />}
          >
            Start Your Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}
