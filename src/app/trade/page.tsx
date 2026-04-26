import { Suspense } from "react";
import { PortfolioList } from "@/components/stocks/PortfolioList";
import { SearchBar } from "@/components/stocks/SearchBar";

export default async function TradePage(props: PageProps<"/trade">) {
  const filterPromise = props.searchParams.then((params) =>
    Array.isArray(params.filter) ? params.filter[0] : (params.filter ?? ""),
  );

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
        // key={filter}
        fallback={
          <div className="mt-8 text-center text-muted-foreground animate-pulse p-12 bg-muted/10 rounded-xl border">
            Loading portfolio data...
          </div>
        }
      >
        <PortfolioList filterPromise={filterPromise} />
      </Suspense>
    </div>
  );
}
