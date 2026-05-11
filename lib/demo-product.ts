import type { ProductVerdict } from "@/types/product";

export const demoProduct: ProductVerdict = {
  id: "prod_sony_wh1000xm5",
  slug: "sony-wh-1000xm5",
  name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
  brand: "Sony",
  category: "Headphones",
  retailer: "Amazon",
  retailerUrl: "https://www.amazon.com/s?k=Sony+WH-1000XM5",
  currentPrice: 328,
  originalPrice: 399,
  currency: "USD",
  verdict: "Better Alternative Available",
  verdictReason:
    "The XM5 is a strong headphone, but today it is not the cleanest value. A competing option has stronger price stability and similar everyday performance.",
  aiBuyScore: 76,
  confidenceScore: 88,
  reviewRating: 4.6,
  reviewCount: 18400,
  lastUpdated: "Today",
  pros: [
    "Excellent active noise cancellation",
    "Lightweight design for long listening sessions",
    "Strong battery life for travel and work",
    "Reliable microphone quality for calls",
  ],
  cons: [
    "Current price is above the best historical deal range",
    "Not foldable, so it is less compact for travel",
    "Some long-term reviews mention hinge and case durability concerns",
  ],
  scores: [
    {
      id: "value",
      label: "Value Score",
      score: 72,
      description: "Good, but weaker at today's price versus top alternatives.",
    },
    {
      id: "quality",
      label: "Quality Score",
      score: 84,
      description: "Strong sound, ANC, and battery evidence across multiple sources.",
    },
    {
      id: "price",
      label: "Price Score",
      score: 68,
      description: "Worth watching for a lower sale price before buying.",
    },
    {
      id: "trust",
      label: "Review Trust Score",
      score: 81,
      description: "Review patterns are mostly stable with a few recurring complaints.",
    },
  ],
  priceHistory: [
    { date: "Jan", price: 349, retailer: "Amazon" },
    { date: "Feb", price: 338, retailer: "Amazon" },
    { date: "Mar", price: 329, retailer: "Amazon" },
    { date: "Apr", price: 318, retailer: "Amazon" },
    { date: "May", price: 328, retailer: "Amazon" },
  ],
  alternatives: [
    {
      id: "alt_bose_qc_ultra",
      name: "Bose QuietComfort Ultra Headphones",
      tag: "Stronger comfort pick",
      aiBuyScore: 84,
      price: 349,
      retailer: "Best Buy",
      verdict: "Buy",
      reasons: [
        "Higher comfort sentiment in long listening reviews",
        "Competitive noise cancellation",
        "More stable recent pricing",
      ],
    },
  ],
  sources: [
    {
      type: "retailer",
      label: "Retailer offer snapshot",
      detail: "Current price, listing title, and availability from retailer page data.",
      url: "#",
    },
    {
      type: "review",
      label: "Review cluster summary",
      detail: "Recurring themes from verified buyer review patterns.",
      url: "#",
    },
    {
      type: "price_history",
      label: "Price history model",
      detail: "Recent price trend compared with normal sale range.",
      url: "#",
    },
  ],
};

export const demoProducts = new Map<string, ProductVerdict>([[demoProduct.slug, demoProduct]]);
