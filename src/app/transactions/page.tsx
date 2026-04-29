import { Suspense } from "react";
import { SearchBar } from "@/components/stocks/SearchBar";
import { TransactionList } from "@/components/stocks/TransactionList";

export default async function TransactionsPage(
  props: PageProps<"/transactions">,
) {
  const pagePromise = props.searchParams.then(
    (params) =>
      Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1,
  );

  const filterPromise = props.searchParams.then(
    (params) =>
      (Array.isArray(params.filter) ? params.filter[0] : params.filter) || "",
  );

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Transaction History
        </h1>
        <p className="text-muted-foreground">
          View all your previous buy and sell orders.
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
          <div className="w-full border-border/50 shadow-xl bg-card/40 backdrop-blur-md rounded-[2rem] overflow-hidden animate-pulse">
            <div className="h-16 bg-muted/20 border-b border-border/50" />
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted/10 rounded-lg w-full" />
              ))}
            </div>
          </div>
        }
      >
        <TransactionList
          pagePromise={pagePromise}
          filterPromise={filterPromise}
        />
      </Suspense>
    </div>
  );
}
