import { Bell, ShieldCheck, TrendingDown } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";

export default function AlertsPage() {
  return (
    <StagedRouteShell
      eyebrow="Price alerts"
      title="Alerts are designed, but still login-gated by intent."
      description="IsItABuy should know who asked for the alert and where to send it, so this route stays reserved for signed-in flows. The Phase 1 experience makes that rule explicit instead of pretending alerts already persist."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo report"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="The price-alert modal on the product page now clearly behaves like a login handoff rather than a fake save."
    >
      <div className="grid gap-3">
        <div className="border-bw-border rounded-xl border bg-white p-5">
          <Bell className="text-primary size-5" />
          <p className="text-bw-ink mt-4 font-semibold">Target price, then sign in</p>
          <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
            The interaction remains open enough to explain the value, but the save step is reserved
            for authenticated users.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-bw-border rounded-xl border bg-white p-5">
            <TrendingDown className="text-bw-amber size-5" />
            <p className="text-bw-ink mt-4 font-semibold">Timing-sensitive</p>
            <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
              Alerts are especially important for products with a strong Wait signal.
            </p>
          </div>
          <div className="border-bw-border rounded-xl border bg-white p-5">
            <ShieldCheck className="text-bw-green size-5" />
            <p className="text-bw-ink mt-4 font-semibold">Trust-aware</p>
            <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
              Disclosure stays adjacent to any future buy or alert-save flow.
            </p>
          </div>
        </div>
      </div>
    </StagedRouteShell>
  );
}
