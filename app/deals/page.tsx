import Link from "next/link";
import { ArrowRight, BadgePercent, SlidersHorizontal } from "lucide-react";
import {
  AffiliateDisclosure,
  AppPageShell,
  MockChart,
  ProductCard,
  ScoreTile,
  SectionHeader,
} from "@/components/shared/buywise-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dealFeed, searchFacets } from "@/lib/buywise-demo-data";
import { formatPrice } from "@/lib/utils";

export default function DealsPage() {
  return (
    <AppPageShell
      eyebrow="Deal intelligence"
      title="Deals that are good products, not just cheaper products."
      description="BuyWise deals combine historical lows, AI scores, review trust, and timing so sale pages do not become commission-driven noise."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/alerts">
            Manage alerts
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <ScoreTile label="Near lows" value="7" tone="green" caption="Products inside the fair-buy band." />
            <ScoreTile label="Avg drop" value="18%" tone="amber" caption="Across demo deal candidates." />
            <ScoreTile label="High-score deals" value="4" tone="blue" caption="AI score above 80." />
          </div>

          <div className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]">
            <SectionHeader
              eyebrow="Deal trend"
              title="Price drops are filtered through trust."
              description="A low price is not enough. The deal needs evidence that the product is still worth buying."
            />
            <div className="mt-6">
              <MockChart
                color="#e99b22"
                points={[
                  { label: "Mon", value: 4 },
                  { label: "Tue", value: 7 },
                  { label: "Wed", value: 5 },
                  { label: "Thu", value: 10 },
                  { label: "Fri", value: 12 },
                ]}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {dealFeed.map((deal) => (
              <div key={deal.product.slug} className="space-y-3">
                <ProductCard product={deal.product} actionLabel="Why this deal" />
                <div className="border-bw-border rounded-[1.5rem] border bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge className="border-bw-border rounded-full border bg-white px-3 py-1.5 text-bw-amber">
                      {deal.dropPercent}% drop
                    </Badge>
                    <span className="text-sm font-black text-bw-muted">
                      Low: {formatPrice(deal.historicalLow, deal.product.currency)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 font-medium text-bw-muted">{deal.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary" />
              <p className="font-black text-bw-ink">Deal filters</p>
            </div>
            <div className="mt-5 grid gap-3">
              {["All deals", ...searchFacets.categories.slice(0, 4)].map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-bw-border bg-bw-paper px-3 py-2 text-sm font-black text-bw-muted"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <BadgePercent className="size-6 text-bw-amber" />
            <p className="mt-4 font-display text-2xl font-black text-bw-ink">Retailer view</p>
            <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
              Amazon, Walmart, Best Buy, Target, and eBay filters are represented in Phase 1.
            </p>
          </div>
          <AffiliateDisclosure />
        </aside>
      </div>
    </AppPageShell>
  );
}
