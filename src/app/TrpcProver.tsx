"use client";
import { trpcClient, trpcClientReact } from "@/utils/api";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <trpcClientReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcClientReact.Provider>
  );
}
