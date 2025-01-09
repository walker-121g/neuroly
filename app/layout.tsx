import { Poppins } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";

import type { Metadata } from "next";

import { useOnlineManager } from "@/hooks/useOnlineManager";

import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Neuroly",
  description: "Track and analyze your headache patterns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useOnlineManager();

  return (
    <html lang="en">
      <body className={cn(poppins.className, "antialiased")}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
