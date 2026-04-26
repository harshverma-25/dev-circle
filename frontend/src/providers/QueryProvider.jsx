"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * QueryProvider must be a Client Component because QueryClientProvider
 * uses React Context, which cannot be used in Next.js Server Components.
 *
 * We create the QueryClient inside useState so each browser session
 * gets its own instance (avoids sharing state between users/SSR requests).
 */
export default function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
