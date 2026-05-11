export type Verdict = "Buy" | "Wait" | "Avoid" | "Better Alternative Available";

export interface ProductVerdict {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  retailer: string;
  retailerUrl: string;
  currentPrice: number;
  originalPrice?: number;
  currency: string;
  verdict: Verdict;
  verdictReason: string;
  aiBuyScore: number;
  confidenceScore: number;
  reviewRating: number;
  reviewCount: number;
  lastUpdated: string;
  pros: string[];
  cons: string[];
  scores: ScoreCard[];
  priceHistory: PricePoint[];
  alternatives: Alternative[];
  sources: Source[];
}

export interface ScoreCard {
  id: string;
  label: string;
  score: number;
  description: string;
}

export interface PricePoint {
  date: string;
  price: number;
  retailer: string;
}

export interface Alternative {
  id: string;
  name: string;
  tag: string;
  aiBuyScore: number;
  price: number;
  retailer: string;
  verdict: Verdict;
  reasons: string[];
}

export interface Source {
  type: "retailer" | "review" | "youtube" | "expert" | "price_history";
  label: string;
  detail: string;
  url: string;
}
