import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function StockCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm animate-pulse">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted" />
          <div>
            <div className="h-6 w-16 bg-muted rounded mb-2" />
            <div className="h-8 w-24 bg-muted rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-full bg-muted rounded mb-4" />
        <div className="h-[200px] w-full bg-muted/50 rounded-md mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="flex gap-3">
            <div className="h-12 flex-1 bg-muted rounded" />
            <div className="h-12 flex-1 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioOverviewSkeleton() {
  return (
    <Card className="w-full overflow-hidden border-border/50 shadow-xl bg-card/40 backdrop-blur-md rounded-[2rem] animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="flex items-baseline gap-3">
              <div className="h-12 w-48 bg-muted rounded" />
              <div className="h-6 w-24 bg-muted rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-end">
            <div className="h-10 w-full md:w-64 bg-muted rounded-xl" />
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="h-12 w-32 bg-muted rounded-xl" />
              <div className="h-12 w-32 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-6 bg-muted/20 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-border/30">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StockGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <StockCardSkeleton key={i} />
      ))}
    </div>
  );
}
