import { Suspense } from "react";
import { PortfolioList } from "@/components/stocks/PortfolioList";
import { SearchBar } from "@/components/stocks/SearchBar";
import { PortfolioOverviewSkeleton, StockGridSkeleton } from "@/components/stocks/Skeletons";

export default async function TradePage(props: PageProps<"/trade">) {
  const filterPromise = props.searchParams.then((params) =>
    Array.isArray(params.filter) ? params.filter[0] : (params.filter ?? ""),
  );

  const timeframePromise = props.searchParams.then((params) => {
    const timeframe = Array.isArray(params.timeframe)
      ? params.timeframe[0]
      : params.timeframe;

    const validTimeframes = ["1D", "1W", "1M", "1Y", "5Y"] as const;
    return validTimeframes.includes(timeframe as any)
      ? (timeframe as "1D" | "1W" | "1M" | "1Y" | "5Y")
      : "1W";
  }) as Promise<"1D" | "1W" | "1M" | "1Y" | "5Y">;

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Trading Portfolio</h1>
        <p className="text-muted-foreground">
          Manage your positions and view your account balance.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-10 w-full max-w-lg bg-muted animate-pulse rounded-md"></div>
        }
      >
        <SearchBar />
      </Suspense>

      <Suspense
        fallback={
          <div className="space-y-12 mt-8">
            <PortfolioOverviewSkeleton />
            <div className="space-y-6">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <StockGridSkeleton count={3} />
            </div>
          </div>
        }
      >
        <PortfolioList
          filterPromise={filterPromise}
          timeframePromise={timeframePromise}
        />
      </Suspense>
    </div>
  );
}
