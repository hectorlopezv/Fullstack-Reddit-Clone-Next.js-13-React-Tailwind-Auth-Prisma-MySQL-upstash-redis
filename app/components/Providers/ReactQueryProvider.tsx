"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type Props = {
  children: ReactNode;
};
const client = new QueryClient();
export default function ReactQueryProvider({ children }: Props) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
