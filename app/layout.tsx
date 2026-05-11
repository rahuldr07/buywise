import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Providers } from "@/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "IsItABuy - Know if it is worth buying",
    template: "%s | IsItABuy",
  },
  description:
    "AI-powered product decision assistant. Get a clear Buy, Wait, Avoid, or Better Alternative verdict before you spend.",
  openGraph: {
    title: "IsItABuy",
    description: "Know if a product is worth buying before checkout.",
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
