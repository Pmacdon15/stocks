import { Suspense } from "react";
import { FollowedStocksList } from "@/components/stocks/FollowedStocksList";
import { SearchBar } from "@/components/stocks/SearchBar";

export default async function FollowPage(props: PageProps<"/follow">) {
  const filterPromise = props.searchParams.then((params) =>
    Array.isArray(params.filter) ? params.filter[0] : (params.filter ?? ""),
  );

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Followed Stocks</h1>
        <p className="text-muted-foreground">
          Keep an eye on up to 10 stocks you're interested in.
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
          <div className="mt-8 text-center text-muted-foreground animate-pulse p-12 bg-muted/10 rounded-xl border">
            Loading your watched stocks...
          </div>
        }
      >
        <FollowedStocksList filterPromise={filterPromise} />
      </Suspense>
    </div>
  );
}
