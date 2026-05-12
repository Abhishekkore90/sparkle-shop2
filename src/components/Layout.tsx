import { ReactNode, useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

/**
 * Layout — wraps every page with the shared Navbar, Footer, and toast region.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <Footer />

      <Toaster position="top-right" />
    </div>
  );
}
