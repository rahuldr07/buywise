import { BookmarkPlus, Bell, Sparkles } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";

export default function WatchlistPage() {
  return (
    <StagedRouteShell
      eyebrow="Saved products"
      title="Watchlist is staged for signed-in users."
      description="Basic product checks stay open. Watchlists are the first saved-product surface, so this route is intentionally positioned behind login once auth is connected."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo report"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="This is where saved products, follow-up comparisons, and revisit history will live."
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-bw-border bg-white p-5">
          <BookmarkPlus className="size-5 text-primary" />
          <p className="mt-4 font-semibold text-bw-ink">Save products worth revisiting</p>
          <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
            Hold products when the verdict is close, the price is high, or the alternative needs a
            second look.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <Bell className="size-5 text-bw-green" />
            <p className="mt-4 font-semibold text-bw-ink">Alert handoff</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Watchlists will flow into price alerts once authentication is live.
            </p>
          </div>
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <Sparkles className="size-5 text-bw-violet" />
            <p className="mt-4 font-semibold text-bw-ink">Personalization surface</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Saved items are the foundation for personal recommendations later.
            </p>
          </div>
        </div>
      </div>
    </StagedRouteShell>
  );
}
