import { Bell, ShieldCheck, TrendingDown } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";

export default function AlertsPage() {
  return (
    <StagedRouteShell
      eyebrow="Price alerts"
      title="Alerts are designed, but still login-gated by intent."
      description="BuyWise should know who asked for the alert and where to send it, so this route stays reserved for signed-in flows. The Phase 1 experience makes that rule explicit instead of pretending alerts already persist."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo report"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="The price-alert modal on the product page now clearly behaves like a login handoff rather than a fake save."
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-bw-border bg-white p-5">
          <Bell className="size-5 text-primary" />
          <p className="mt-4 font-semibold text-bw-ink">Target price, then sign in</p>
          <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
            The interaction remains open enough to explain the value, but the save step is reserved
            for authenticated users.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <TrendingDown className="size-5 text-bw-amber" />
            <p className="mt-4 font-semibold text-bw-ink">Timing-sensitive</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Alerts are especially important for products with a strong Wait signal.
            </p>
          </div>
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <ShieldCheck className="size-5 text-bw-green" />
            <p className="mt-4 font-semibold text-bw-ink">Trust-aware</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Disclosure stays adjacent to any future buy or alert-save flow.
            </p>
          </div>
        </div>
      </div>
    </StagedRouteShell>
  );
}
