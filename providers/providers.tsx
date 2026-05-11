"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LenisProvider } from "@/providers/lenis-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <LenisProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </LenisProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
