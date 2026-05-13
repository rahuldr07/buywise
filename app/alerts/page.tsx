import Link from "next/link";
import { Bell, Mail, Pencil, Trash2 } from "lucide-react";
import {
  AppPageShell,
  LoginGateCard,
  MockChart,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { priceAlerts } from "@/lib/buywise-demo-data";
import { formatPrice } from "@/lib/utils";

export default function AlertsPage() {
  return (
    <AppPageShell
      eyebrow="Price alerts"
      title="Manage target prices without making basic checks private."
      description="Alerts need identity and delivery preferences, so this UI is intentionally login-gated while still explaining the value before sign-in."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/account">Create account</Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Active alerts"
            title="Target price, current price, history, and notification method."
          />
          <div className="grid gap-4">
            {priceAlerts.map((alert) => (
              <article
                key={alert.product.slug}
                className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-bw-border bg-white px-3 py-1.5 text-xs font-black text-primary">
                        {alert.alertType}
                      </span>
                      <span className="rounded-full border border-bw-border bg-white px-3 py-1.5 text-xs font-black text-bw-green">
                        {alert.method}
                      </span>
                    </div>
                    <h2 className="font-display mt-4 text-3xl font-black text-bw-ink">
                      {alert.product.name}
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <AlertMetric label="Target" value={formatPrice(alert.targetPrice, alert.product.currency)} />
                      <AlertMetric label="Current" value={formatPrice(alert.product.currentPrice, alert.product.currency)} />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="h-10 rounded-full px-4 font-black" variant="outline">
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>
                      <Button className="h-10 rounded-full px-4 font-black" variant="outline">
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-bw-paper p-4">
                    <p className="text-xs font-black text-bw-muted">Alert history</p>
                    <div className="mt-4 space-y-3">
                      {alert.history.map((event) => (
                        <div key={event} className="flex items-start gap-2 text-sm font-bold text-bw-muted">
                          <span className="mt-1.5 size-2 rounded-full bg-primary" />
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <LoginGateCard
            title="Alerts save only after sign-in"
            description="BuyWise needs an account to store targets and deliver notifications by email or push."
          />
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <Bell className="size-6 text-primary" />
            <p className="mt-4 font-display text-2xl font-black text-bw-ink">Alert volume</p>
            <div className="mt-4">
              <MockChart
                color="#23a866"
                points={[
                  { label: "Jan", value: 2 },
                  { label: "Feb", value: 3 },
                  { label: "Mar", value: 5 },
                  { label: "Apr", value: 4 },
                  { label: "May", value: 6 },
                ]}
              />
            </div>
          </div>
          <TrustNotice>
            Notification settings remain user-controlled. BuyWise should not create hidden alerts.
          </TrustNotice>
          <div className="border-bw-border rounded-[1.5rem] border bg-white p-4 text-sm font-bold text-bw-muted">
            <Mail className="mb-3 size-5 text-bw-violet" />
            Email, push, and digest delivery are represented as Phase 1 UI only.
          </div>
        </aside>
      </div>
    </AppPageShell>
  );
}

function AlertMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-bw-border bg-bw-paper p-4">
      <p className="text-xs font-black text-bw-muted">{label}</p>
      <p className="font-display mt-1 text-2xl font-black text-bw-ink">{value}</p>
    </div>
  );
}
