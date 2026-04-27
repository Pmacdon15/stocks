"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    // <ClerkProvider>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    // </ClerkProvider>
  );
}
