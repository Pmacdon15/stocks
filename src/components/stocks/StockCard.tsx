'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { useUnfollowStock, useFollowStock, useTradeStock } from '@/hooks/use-stock-mutations';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface StockCardProps {
  symbol: string;
  price: number;
  ownedShares?: number;
  averageCost?: number;
  isFollowed?: boolean;
}

export function StockCard({ symbol, price, ownedShares, averageCost, isFollowed }: StockCardProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1D');
  const [sharesStr, setSharesStr] = useState('1');
  const unfollow = useUnfollowStock();
  const follow = useFollowStock();
  const trade = useTradeStock();

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const shares = parseInt(sharesStr, 10);
    if (isNaN(shares) || shares <= 0) return;
    trade.mutate({ symbol, shares, type });
  };

  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['stockBars', symbol, timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/bars?symbol=${symbol}&timeframe=${timeframe}`);
      if (!res.ok) throw new Error('Failed to fetch chart data');
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const { data: details } = useQuery({
    queryKey: ['companyDetails', symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/details?symbol=${symbol}`);
      if (!res.ok) throw new Error('Failed to fetch details');
      return res.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const isPositive = chartData && chartData.length > 1 ? chartData[chartData.length - 1].price >= chartData[0].price : true;
  const strokeColor = isPositive ? 'var(--primary)' : 'var(--destructive)';

  return (
    <Card className="overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-4">
          {details?.logo ? (
            <img src={details.logo} alt={`${symbol} logo`} className="w-12 h-12 rounded-full border border-border/50 bg-white object-contain p-1" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {symbol.substring(0, 2)}
            </div>
          )}
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {symbol}
              {isPositive ? <TrendingUp className="h-5 w-5 text-primary" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
            </CardTitle>
            <div className="text-3xl font-bold text-foreground mt-1">${price.toFixed(2)}</div>
            {ownedShares !== undefined && (
              <div className="text-sm font-medium text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                <span>Owned: <span className="text-foreground">{ownedShares}</span></span>
                {averageCost !== undefined && (
                  <>
                    <span className="text-border">•</span>
                    <span>Avg: <span className="text-foreground">${averageCost.toFixed(2)}</span></span>
                    <span className="text-border">•</span>
                    <span className={(price - averageCost) >= 0 ? "text-primary" : "text-destructive"}>
                      {(price - averageCost) >= 0 ? "+" : ""}{((price - averageCost) * ownedShares).toFixed(2)} ({(((price - averageCost) / averageCost) * 100).toFixed(2)}%)
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {isFollowed !== undefined && (
          isFollowed ? (
            <Button variant="ghost" size="sm" onClick={() => unfollow.mutate(symbol)} disabled={unfollow.isPending} className="text-muted-foreground hover:text-destructive">
              Unfollow
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => follow.mutate(symbol)} disabled={follow.isPending}>
              Follow
            </Button>
          )
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={(v: any) => setTimeframe(v)} className="mb-4">
          <TabsList className="grid w-full grid-cols-5 h-8 bg-muted/50">
            <TabsTrigger value="1D" className="text-xs">1D</TabsTrigger>
            <TabsTrigger value="1W" className="text-xs">1W</TabsTrigger>
            <TabsTrigger value="1M" className="text-xs">1M</TabsTrigger>
            <TabsTrigger value="1Y" className="text-xs">1Y</TabsTrigger>
            <TabsTrigger value="5Y" className="text-xs">5Y</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="h-[200px] w-full mt-4 -ml-4">
          {error ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-destructive text-xs bg-destructive/10 rounded-md ml-4 p-4 text-center">
              <span className="font-bold mb-1">Chart Error</span>
              {error instanceof Error ? error.message : 'Failed to load chart'}
            </div>
          ) : isLoading || !chartData ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm bg-muted/10 rounded-md ml-4">
              Loading chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm bg-muted/10 rounded-md ml-4">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={strokeColor}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: strokeColor, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Company Details Grid */}
        {details && (
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-muted/20 rounded-xl border border-border/50">
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Market Cap</div>
              <div className="font-semibold">{details.marketCap ? `$${(details.marketCap / 1000).toFixed(2)}B` : 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dividend Yield</div>
              <div className="font-semibold">{details.dividendYield ? `${details.dividendYield.toFixed(2)}%` : 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Trade Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/50">
          <Input 
            type="number" 
            min="1" 
            value={sharesStr} 
            onChange={(e) => setSharesStr(e.target.value)} 
            className="w-full sm:w-24 bg-background shadow-sm"
            placeholder="Qty"
          />
          <Button 
            className="flex-1 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
            onClick={() => handleTrade('BUY')}
            disabled={trade.isPending}
          >
            Buy {symbol}
          </Button>
          <Button 
            variant="outline"
            className="flex-1 w-full border-destructive text-destructive hover:bg-destructive/10 shadow-sm" 
            onClick={() => handleTrade('SELL')}
            disabled={trade.isPending || (ownedShares || 0) < parseInt(sharesStr || '0', 10)}
          >
            Sell
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
