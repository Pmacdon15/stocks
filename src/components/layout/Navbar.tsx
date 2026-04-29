"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, TrendingUp } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const routes = [
    { label: "Popular", href: "/popular" },
    { label: "Follow Stocks", href: "/follow" },
    { label: "Trade", href: "/trade" },
    { label: "Activity", href: "/transactions" },
    // { label: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary tracking-tight">
                TradeSim
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {routes.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href as Route}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" className="border-border/50">
                  Log in
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button>Sign up</Button>
              </SignInButton>
            </Show>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </SignInButton>
            </Show>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {routes.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href as Route}
                      className="text-muted-foreground hover:text-foreground px-3 py-2 text-lg font-medium transition-colors"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
