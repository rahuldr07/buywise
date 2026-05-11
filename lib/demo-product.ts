import type { ProductVerdict } from "@/types/product";

export const productCatalog: ProductVerdict[] = [
  {
    id: "prod_sony_wh1000xm5",
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    brand: "Sony",
    category: "Headphones",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
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
        imageUrl:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
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
    reviewInsights: [
      {
        source: "Amazon",
        rating: "4.6/5",
        sentiment: "Positive",
        summary:
          "AI synthesis: buyers praise ANC, comfort, and call quality, while value complaints rise when the price is above the recent deal range.",
      },
      {
        source: "Reddit",
        rating: "Mixed",
        sentiment: "Mixed",
        summary:
          "AI synthesis: community threads like the sound and travel use case, but often compare it against Bose for comfort and foldability.",
      },
      {
        source: "The Verge",
        rating: "Strong",
        sentiment: "Positive",
        summary:
          "AI synthesis: expert reviews frame the XM5 as premium and polished, with price and portability as the main tradeoffs.",
      },
    ],
  },
  {
    id: "prod_iphone_15_pro",
    slug: "iphone-15-pro",
    name: "Apple iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
    retailer: "Best Buy",
    retailerUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=iphone+15+pro",
    currentPrice: 899,
    originalPrice: 999,
    currency: "USD",
    verdict: "Buy",
    verdictReason:
      "The 15 Pro remains a high-confidence buy when discounted below launch pricing. Camera, performance, and resale strength keep the total value strong.",
    aiBuyScore: 87,
    confidenceScore: 91,
    reviewRating: 4.7,
    reviewCount: 12600,
    lastUpdated: "Today",
    pros: [
      "Excellent camera consistency across lighting conditions",
      "Strong performance headroom for several years",
      "USB-C improves accessory compatibility",
      "High resale value compared with most phones",
    ],
    cons: [
      "Battery life is good but not class-leading",
      "Repairs and AppleCare can be expensive",
      "Base storage may feel tight for heavy video use",
    ],
    scores: [
      {
        id: "value",
        label: "Value Score",
        score: 82,
        description: "Good value when discounted below launch price.",
      },
      {
        id: "quality",
        label: "Quality Score",
        score: 92,
        description: "Premium build, camera, chip, and display quality.",
      },
      {
        id: "price",
        label: "Price Score",
        score: 79,
        description: "Current price sits in a reasonable discount band.",
      },
      {
        id: "trust",
        label: "Review Trust Score",
        score: 90,
        description: "Review sentiment is broad, stable, and well sourced.",
      },
    ],
    priceHistory: [
      { date: "Jan", price: 999, retailer: "Best Buy" },
      { date: "Feb", price: 949, retailer: "Best Buy" },
      { date: "Mar", price: 929, retailer: "Best Buy" },
      { date: "Apr", price: 899, retailer: "Best Buy" },
      { date: "May", price: 899, retailer: "Best Buy" },
    ],
    alternatives: [],
    sources: [
      {
        type: "retailer",
        label: "Best Buy offer snapshot",
        detail: "Current discounted price and availability.",
        url: "#",
      },
      {
        type: "expert",
        label: "Expert review cluster",
        detail: "Camera, performance, and build quality consensus.",
        url: "#",
      },
      {
        type: "review",
        label: "Owner review summary",
        detail: "Battery, heat, and camera sentiment patterns.",
        url: "#",
      },
    ],
    reviewInsights: [
      {
        source: "Best Buy",
        rating: "4.7/5",
        sentiment: "Positive",
        summary:
          "AI synthesis: owners praise camera quality and speed, with battery expectations depending heavily on prior device.",
      },
      {
        source: "YouTube",
        rating: "Strong",
        sentiment: "Positive",
        summary:
          "AI synthesis: reviewers consistently rank it as a safe premium phone, especially for video and long-term software support.",
      },
      {
        source: "The Verge",
        rating: "Strong",
        sentiment: "Positive",
        summary:
          "AI synthesis: expert coverage favors the camera, USB-C transition, and titanium build, with price as the major limiter.",
      },
    ],
  },
  {
    id: "prod_nike_pegasus_41",
    slug: "nike-pegasus-41",
    name: "Nike Pegasus 41 Running Shoes",
    brand: "Nike",
    category: "Running Shoes",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    retailer: "Nike",
    retailerUrl: "https://www.nike.com/search?q=pegasus%2041",
    currentPrice: 112,
    originalPrice: 140,
    currency: "USD",
    verdict: "Wait",
    verdictReason:
      "Pegasus 41 is a reliable daily trainer, but the current discount is not yet strong enough versus frequent seasonal promotions.",
    aiBuyScore: 71,
    confidenceScore: 84,
    reviewRating: 4.4,
    reviewCount: 8900,
    lastUpdated: "Today",
    pros: [
      "Reliable everyday training feel",
      "Durable outsole for road miles",
      "Comfortable upper for casual and running use",
      "Available in many sizes and colors",
    ],
    cons: [
      "Discounts often get deeper near seasonal sales",
      "Not the most exciting choice for speed work",
      "Fit can feel narrow for wide-footed runners",
    ],
    scores: [
      {
        id: "value",
        label: "Value Score",
        score: 74,
        description: "Solid value, but sales can improve the deal.",
      },
      {
        id: "quality",
        label: "Quality Score",
        score: 80,
        description: "Durable, stable, and well suited for daily use.",
      },
      {
        id: "price",
        label: "Price Score",
        score: 63,
        description: "Price is okay, not compelling yet.",
      },
      {
        id: "trust",
        label: "Review Trust Score",
        score: 78,
        description: "Consistent owner sentiment with sizing caveats.",
      },
    ],
    priceHistory: [
      { date: "Jan", price: 140, retailer: "Nike" },
      { date: "Feb", price: 126, retailer: "Nike" },
      { date: "Mar", price: 118, retailer: "Nike" },
      { date: "Apr", price: 105, retailer: "Nike" },
      { date: "May", price: 112, retailer: "Nike" },
    ],
    alternatives: [
      {
        id: "alt_asics_novablast",
        name: "ASICS Novablast 4",
        tag: "More energetic daily trainer",
        imageUrl:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
        aiBuyScore: 79,
        price: 109,
        retailer: "Zappos",
        verdict: "Buy",
        reasons: ["Bouncier ride", "Comparable sale price", "Strong daily trainer reviews"],
      },
    ],
    sources: [
      {
        type: "retailer",
        label: "Nike offer snapshot",
        detail: "Current sale pricing and color availability.",
        url: "#",
      },
      {
        type: "review",
        label: "Runner review cluster",
        detail: "Comfort, durability, and sizing patterns.",
        url: "#",
      },
      {
        type: "youtube",
        label: "Running channel summary",
        detail: "Daily trainer comparisons and ride impressions.",
        url: "#",
      },
    ],
    reviewInsights: [
      {
        source: "YouTube",
        rating: "Mixed",
        sentiment: "Mixed",
        summary:
          "AI synthesis: running reviewers call it dependable and safe, but not the most lively shoe in its price class.",
      },
      {
        source: "Reddit",
        rating: "Mixed",
        sentiment: "Mixed",
        summary:
          "AI synthesis: community feedback likes durability and familiarity, with repeated notes about fit and better sale alternatives.",
      },
      {
        source: "Amazon",
        rating: "4.4/5",
        sentiment: "Positive",
        summary:
          "AI synthesis: buyer reviews are positive for walking and daily wear, with running-specific users more price sensitive.",
      },
    ],
  },
];

export const demoProduct = productCatalog[0];
export const demoProducts = new Map<string, ProductVerdict>(
  productCatalog.map((product) => [product.slug, product])
);
