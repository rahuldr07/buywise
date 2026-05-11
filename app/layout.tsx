import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Providers } from "@/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "BuyWise AI - Know what to buy before you buy",
    template: "%s | BuyWise AI",
  },
  description:
    "AI-powered product decision assistant. Get a clear Buy, Wait, Avoid, or Better Alternative verdict before you spend.",
  openGraph: {
    title: "BuyWise AI",
    description: "Know what to buy before you buy.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <ScrollToTop />
      </body>
    </html>
  );
}
