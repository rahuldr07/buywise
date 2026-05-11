import { BadgePercent, SearchCheck, Sparkles } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";

export default function DealsPage() {
  return (
    <StagedRouteShell
      eyebrow="Deal intelligence"
      title="Deals becomes useful when pricing signals get real."
      description="This route is reserved for curated pricing opportunities and timing-based recommendations. The visual system is ready now, while the live deal feed and ranking logic come next."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo report"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="Deals should inherit the same commission-neutral ranking rule as the rest of the product."
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-bw-border bg-white p-5">
          <BadgePercent className="size-5 text-primary" />
          <p className="mt-4 font-semibold text-bw-ink">Deal quality, not just a lower number</p>
          <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
            Good deals need timing context, trust signals, and product quality, not just a temporary
            markdown.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <SearchCheck className="size-5 text-bw-green" />
            <p className="mt-4 font-semibold text-bw-ink">Curated opportunities</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Surface products where the Buy signal gets stronger because the price moved.
            </p>
          </div>
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <Sparkles className="size-5 text-bw-violet" />
            <p className="mt-4 font-semibold text-bw-ink">Future spotlight</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              This route will eventually feel like a premium feed, not a generic sale page.
            </p>
          </div>
        </div>
      </div>
    </StagedRouteShell>
  );
}
