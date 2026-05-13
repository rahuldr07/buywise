import { productCatalog } from "@/lib/demo-product";

export const searchFacets = {
  categories: ["Headphones", "Smartphones", "Running Shoes", "Laptops", "Kitchen", "Beauty"],
  retailers: ["Amazon", "Walmart", "Best Buy", "Target", "eBay"],
  priceRanges: ["Under $100", "$100-$300", "$300-$800", "$800+"],
  ratings: ["4.5+ stars", "4.0+ stars", "10k+ reviews", "Trusted reviews"],
  sorts: ["Best value", "Most trusted reviews", "Lowest price", "Highest AI score"],
};

export const popularCategories = [
  { label: "Laptops under $800", href: "/best/laptops-under-800", count: "42 ranked" },
  { label: "Noise-canceling headphones", href: "/search?q=headphones", count: "31 checked" },
  { label: "Running shoes", href: "/search?q=running%20shoes", count: "26 checked" },
  { label: "Kitchen upgrades", href: "/best/kitchen-upgrades", count: "18 ranked" },
];

export const dealFeed = productCatalog.map((product, index) => {
  const low = Math.min(...product.priceHistory.map((point) => point.price));
  const dropPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : 8 + index * 4;

  return {
    product,
    historicalLow: low,
    dropPercent,
    quality: product.aiBuyScore >= 82 ? "Strong deal" : product.verdict === "Wait" ? "Watch deal" : "Verify alternative",
    reason:
      product.aiBuyScore >= 82
        ? "Strong score, trusted reviews, and current price is inside the fair-buy band."
        : "The discount is visible, but timing or alternatives still need checking.",
  };
});

export const categoryRankings = {
  "laptops-under-800": {
    title: "Best laptops under $800",
    description: "A demo ranking layout for budget laptops using the same BuyWise score language.",
    filters: ["Student", "Work", "Creator", "Battery life"],
    winners: [
      { label: "Best overall", product: productCatalog[1], reason: "Best blend of performance and trust signals." },
      { label: "Best value", product: productCatalog[0], reason: "Strong score at a lower effective price." },
      { label: "Best budget", product: productCatalog[2], reason: "Good enough when price matters most." },
    ],
    avoid: ["Low review-trust listings", "Refurbished listings without clear warranty", "Unknown sellers"],
  },
  "kitchen-upgrades": {
    title: "Best kitchen upgrades",
    description: "A compact category page pattern for future home and kitchen product rankings.",
    filters: ["Air fryer", "Coffee", "Blender", "Storage"],
    winners: [
      { label: "Best overall", product: productCatalog[0], reason: "Strong evidence pattern and broad retailer availability." },
      { label: "Best value", product: productCatalog[2], reason: "Good score when discounted." },
      { label: "Premium pick", product: productCatalog[1], reason: "Higher confidence and quality score." },
    ],
    avoid: ["Flash deals with weak reviews", "Products with unclear warranty", "High-return listings"],
  },
};

export const savedProducts = [
  {
    product: productCatalog[0],
    movement: "-$21 this month",
    alertStatus: "Alert at $299",
    note: "Better alternative still leads by 8 points.",
  },
  {
    product: productCatalog[1],
    movement: "No change",
    alertStatus: "Watching carrier deals",
    note: "Verdict stayed Buy for three checks.",
  },
  {
    product: productCatalog[2],
    movement: "+$7 this week",
    alertStatus: "Wait for $99",
    note: "Seasonal sale likely improves timing.",
  },
];

export const priceAlerts = [
  {
    product: productCatalog[0],
    targetPrice: 299,
    alertType: "Historical low",
    method: "Email",
    history: ["Created May 1", "Price dropped May 8", "Still above target"],
  },
  {
    product: productCatalog[2],
    targetPrice: 99,
    alertType: "Buy threshold",
    method: "Push + email",
    history: ["Created Apr 29", "Sale missed target by $6", "Next check tomorrow"],
  },
];

export const receiptDemo = {
  id: "receipt-demo",
  retailer: "Amazon",
  purchaseDate: "May 3, 2026",
  status: "OCR matched 3 of 3 items",
  items: [
    { name: "Sony WH-1000XM5", paid: 349, current: 328, action: "Return window open" },
    { name: "USB-C charger", paid: 29, current: 24, action: "Keep" },
    { name: "Laptop sleeve", paid: 42, current: 37, action: "No better alternative" },
  ],
};

export const chatPrompts = [
  "Should I buy this laptop?",
  "Find me the best air fryer under $150.",
  "Compare these two products.",
  "Is this Amazon deal actually good?",
];

export const dashboardPreferences = {
  budgets: ["Tech: $900", "Shoes: $130", "Kitchen: $180"],
  retailers: ["Amazon", "Best Buy", "Target"],
  blockedBrands: ["Unknown marketplace brands", "No-warranty refurbishers"],
  categories: ["Tech", "Running", "Kitchen", "Beauty"],
  privacy: ["Do not use receipt data for personalization without consent", "Email alerts only"],
};

