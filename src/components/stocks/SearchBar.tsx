"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFollowStock } from "@/hooks/use-stock-mutations";
import { useStockSearch } from "@/hooks/use-stock-search";

export function SearchBar({ placeholder = "Search for stocks (e.g. AAPL)..." }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("filter") || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: results, isLoading } = useStockSearch(query);
  const followStock = useFollowStock();
  const router = useRouter();

  const handleClear = () => {
    setQuery("");
    setShowDropdown(false);
    router.push("?");
  };

  return (
    <div className="relative w-full max-w-lg">
      <form
        className="relative flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (query) {
            router.push(`?filter=${encodeURIComponent(query)}`);
            setShowDropdown(false);
          } else {
            router.push(`?`);
            setShowDropdown(false);
          }
        }}
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder={placeholder}
            className="pl-9 pr-9 w-full shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="default" className="px-6 font-bold">
          Search
        </Button>
      </form>

      {query && showDropdown && results && (
        <Card className="absolute top-full mt-2 w-full z-50 p-2 max-h-60 overflow-y-auto shadow-xl">
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground text-center animate-pulse">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((r: any) => (
                <div
                  key={r.symbol}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors group"
                >
                  {/* Primary Link: Updates the filter in the current view */}
                  <Link
                    href={`?filter=${encodeURIComponent(r.symbol)}`}
                    onClick={() => {
                      setQuery(r.symbol);
                      setShowDropdown(false);
                    }}
                    className="flex-1 flex flex-col items-start"
                  >
                    <span className="font-semibold text-sm text-foreground">
                      {r.symbol}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.name}
                    </span>
                  </Link>

                  {/* Secondary Actions: These sit outside the Link to avoid nesting errors */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        followStock.mutate(r.symbol);
                        setShowDropdown(false);
                      }}
                      disabled={followStock.isPending}
                    >
                      Follow
                    </Button>

                    {/* View Button: Navigates to a specific stock page */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <Link
                        href={`/stock?symbol=${r.symbol}`}
                        onClick={() => setShowDropdown(false)}
                      >
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No stocks found.
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
