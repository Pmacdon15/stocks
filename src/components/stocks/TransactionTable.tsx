"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Transaction } from "@/db/queries";
import { Button } from "../ui/button";

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  filter: string;
  timezone: string;
}

export function TransactionTable({
  transactions,
  total,
  page,
  limit,
  filter,
  timezone,
}: TransactionTableProps) {
  const [typeFilter, setTypeFilter] = useState<"ALL" | "BUY" | "SELL">("ALL");

  const filteredTransactions = transactions.filter(
    (t) => typeFilter === "ALL" || t.type === typeFilter,
  );

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", p.toString());
    if (filter) params.set("filter", filter);
    return `/transactions${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timezone
    }).format(new Date(date));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-xl bg-card/40 backdrop-blur-md rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border/50">
              {(["ALL", "BUY", "SELL"] as const).map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="rounded-lg text-xs font-bold px-4"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50 self-start sm:self-auto">
            {total} Records found
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-widest border-b border-border/50">
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Stock</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold text-right">Quantity</th>
                  <th className="px-6 py-4 font-bold text-right">Price</th>
                  <th className="px-6 py-4 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground italic"
                    >
                      No {typeFilter !== "ALL" ? typeFilter.toLowerCase() : ""}{" "}
                      transactions match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => {
                    const isBuy = t.type === "BUY";
                    const totalVal = Number(t.price) * t.shares;

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {formatDate(t.created_at)}
                          <span className="block text-[10px] opacity-60">
                            {formatTime(t.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground group-hover:text-primary transition-colors">
                          {t.symbol}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isBuy
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                            }`}
                          >
                            {isBuy ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {t.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          {t.shares.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right">
                          ${Number(t.price).toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm font-bold text-right ${isBuy ? "text-foreground" : "text-primary"}`}
                        >
                          $
                          {totalVal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-bold text-foreground">{page}</span> of{" "}
          <span className="font-bold text-foreground">{totalPages || 1}</span>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={getPageUrl(page - 1) as Route}
            className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              className="rounded-xl border-border/50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
          </Link>
          <Link
            href={getPageUrl(page + 1) as Route}
            className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              className="rounded-xl border-border/50"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
