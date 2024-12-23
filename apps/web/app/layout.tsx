"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigation } from "@/app/navigation";
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
          <Navigation />
          <SidebarTrigger className="m-1" />
          <main className="w-full p-4 mx-auto max-w-xl items-center">
            {children}
          </main>
        </SidebarProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
