import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { verdictTheme } from "@/lib/verdict-theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function scoreToColor(score: number): string {
  if (score >= 85) return "text-verdict-buy";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-verdict-wait";
  return "text-verdict-avoid";
}

export function verdictToClass(verdict: string): string {
  if (verdict in verdictTheme) {
    return verdictTheme[verdict as keyof typeof verdictTheme].badge;
  }

  return verdictTheme["Better Alternative Available"].badge;
}
