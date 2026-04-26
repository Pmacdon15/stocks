import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeSim | Stock Trading Simulator",
  description: "A modern, fresh stock trading simulation app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
            <Toaster position="bottom-right" richColors />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
