import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      ShopMe — a demo clothing store.
      </footer>
    </div>
  );
}
