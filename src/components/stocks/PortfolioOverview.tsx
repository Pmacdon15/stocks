"use client";

import {
  BarChart3,
  DollarSign,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PortfolioOverviewProps {
  totalValue: number;
  totalProfit: number;
  buyingPower: number;
  portfolioValue: number;
  history: { time: number; value: number }[];
  timeframe: "1D" | "1W" | "1M" | "1Y" | "5Y";
}

export function PortfolioOverview({
  totalValue,
  totalProfit,
  buyingPower,
  portfolioValue,
  history,
  timeframe,
}: PortfolioOverviewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPositive = totalProfit >= 0;

  const handleTimeframeChange = (newTimeframe: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", newTimeframe);
    router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
  };

  const strokeColor = isPositive ? "var(--primary)" : "var(--destructive)";

  return (
    <Card className="w-full overflow-hidden border-border/50 shadow-xl bg-card/40 backdrop-blur-md rounded-[2rem]">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
              Portfolio Performance
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-extrabold tracking-tight">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
              <div
                className={`flex items-center text-lg font-bold ${isPositive ? "text-primary" : "text-destructive"}`}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                {isPositive ? "+" : ""}$
                {Math.abs(totalProfit).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-sm opacity-80">
                  ({((totalProfit / 10000) * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-end">
            <Tabs
              value={timeframe}
              onValueChange={handleTimeframeChange}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-5 h-10 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="1D" className="rounded-lg text-xs">
                  1D
                </TabsTrigger>
                <TabsTrigger value="1W" className="rounded-lg text-xs">
                  1W
                </TabsTrigger>
                <TabsTrigger value="1M" className="rounded-lg text-xs">
                  1M
                </TabsTrigger>
                <TabsTrigger value="1Y" className="rounded-lg text-xs">
                  1Y
                </TabsTrigger>
                <TabsTrigger value="5Y" className="rounded-lg text-xs">
                  5Y
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-background/40 px-4 py-2 rounded-xl border border-border/40 min-w-[120px]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Buying Power
                </p>
                <p className="text-md font-bold text-primary">
                  ${buyingPower.toLocaleString()}
                </p>
              </div>
              <div className="bg-background/40 px-4 py-2 rounded-xl border border-border/40 min-w-[120px]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Stock Value
                </p>
                <p className="text-md font-bold text-foreground">
                  ${portfolioValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full mt-6 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={["dataMin - 50", "dataMax + 50"]} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                labelStyle={{ display: "none" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-border/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <PieChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Allocation
              </p>
              <p className="font-bold text-foreground">
                {((portfolioValue / totalValue) * 100).toFixed(1)}% Stocks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Portfolio Status
              </p>
              <p className="font-bold text-foreground">
                {isPositive ? "Growth Phase" : "Recovery Phase"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Verified Identity
              </p>
              <p className="font-bold text-foreground">Active Simulation</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
 