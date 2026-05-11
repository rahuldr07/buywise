import type { Verdict } from "@/types/product";

type VerdictTheme = {
  badge: string;
  soft: string;
  dot: string;
  tint: string;
};

export const verdictTheme = {
  Buy: {
    badge: "bg-verdict-buy text-[#041610]",
    soft: "border border-verdict-buy/[0.2] bg-bw-green-soft text-verdict-buy",
    dot: "bg-verdict-buy",
    tint: "border-verdict-buy/[0.15] bg-verdict-buy/[0.05]",
  },
  Wait: {
    badge: "bg-verdict-wait text-[#1f1202]",
    soft: "border border-verdict-wait/[0.2] bg-bw-amber-soft text-verdict-wait",
    dot: "bg-verdict-wait",
    tint: "border-verdict-wait/[0.15] bg-verdict-wait/[0.05]",
  },
  Avoid: {
    badge: "bg-verdict-avoid text-[#fff6f8]",
    soft: "border border-verdict-avoid/[0.2] bg-bw-red-soft text-verdict-avoid",
    dot: "bg-verdict-avoid",
    tint: "border-verdict-avoid/[0.15] bg-verdict-avoid/[0.05]",
  },
  "Better Alternative Available": {
    badge: "bg-verdict-alternative text-[#f6f5ff]",
    soft: "border border-verdict-alternative/[0.2] bg-bw-violet-soft text-verdict-alternative",
    dot: "bg-verdict-alternative",
    tint: "border-verdict-alternative/[0.15] bg-verdict-alternative/[0.05]",
  },
} satisfies Record<Verdict, VerdictTheme>;
