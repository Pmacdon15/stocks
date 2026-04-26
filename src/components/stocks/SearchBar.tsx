'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStockSearch } from '@/hooks/use-stock-search';
import { useFollowStock } from '@/hooks/use-stock-mutations';
import { Card } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBar() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('filter') || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: results, isLoading } = useStockSearch(query);
  const followStock = useFollowStock();
  const router = useRouter();

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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Search for stocks (e.g. AAPL)..." 

            className="pl-9 w-full shadow-sm"
          />
        </div>
        <Button type="submit" variant="default">Search</Button>
      </form>

      {query && showDropdown && results && (
        <Card className="absolute top-full mt-2 w-full z-50 p-2 max-h-60 overflow-y-auto shadow-xl">
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground text-center animate-pulse">Searching...</div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((r: any) => (
                <div 
                  key={r.symbol} 
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  onClick={() => {
                    setQuery(r.symbol);
                    setShowDropdown(false);
                    router.push(`?filter=${encodeURIComponent(r.symbol)}`);
                  }}
                >
                  <div>
                    <div className="font-semibold text-foreground">{r.symbol}</div>
                    <div className="text-xs text-muted-foreground">{r.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        followStock.mutate(r.symbol);
                        setShowDropdown(false);
                      }}
                      disabled={followStock.isPending}
                    >
                      Follow
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/stock?symbol=${r.symbol}`);
                        setShowDropdown(false);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 text-sm text-muted-foreground text-center">No stocks found.</div>
          )}
        </Card>
      )}
    </div>
  );
}
