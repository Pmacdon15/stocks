import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import HeaderStockPage from "@/components/header-stock-page";
import { StockDetail } from "@/components/stocks/StockDetail";
import { getStockPrice } from "@/dal/market-data";

export async function generateMetadata(props: PageProps<"/stock">) {
  const searchParams = await props.searchParams;
  const symbol = searchParams.symbol as string;

  return {
    title: `${(symbol || "Stock").toUpperCase()} - TradeSim`,
  };
}

export default async function StockPage(props: PageProps<"/stock">) {
  const symbolPromise = props.searchParams.then((params) =>
    (Array.isArray(params.symbol)
      ? params.symbol[0]
      : (params.symbol ?? "")
    ).toUpperCase(),
  );
  const pricePromise = props.searchParams.then((params) =>
    getStockPrice(
      (Array.isArray(params.symbol)
        ? params.symbol[0]
        : (params.symbol ?? "")
      ).toUpperCase(),
    ),
  );

  return (
    <div className="py-8 space-y-6 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-4">
        <Link
          href="/trade"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <Suspense
          fallback={
            <h1 className="text-3xl font-bold tracking-tight">
              Trade {"    "}
            </h1>
          }
        >
          <HeaderStockPage symbolPromise={symbolPromise} />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="mt-8 text-center text-muted-foreground animate-pulse p-12 bg-muted/10 rounded-xl border">
            Loading data...
          </div>
        }
      >
        <StockDetail
          symbolPromise={symbolPromise}
          pricePromise={pricePromise}
        />
      </Suspense>
    </div>
  );
}
