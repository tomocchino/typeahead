"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/styles/globals.css";
import "@/src/css/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Typeahead</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="p-4 mx-auto w-full max-w-xl items-center">
            {children}
          </main>
        </SidebarProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
