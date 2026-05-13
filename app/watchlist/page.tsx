import Link from "next/link";
import { ArrowRight, Bell, Trash2 } from "lucide-react";
import {
  AppPageShell,
  LoginGateCard,
  ProductCard,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { savedProducts } from "@/lib/buywise-demo-data";

export default function WatchlistPage() {
  return (
    <AppPageShell
      eyebrow="Saved products"
      title="Watch products when timing, price, or alternatives are still moving."
      description="Watchlists are staged as a signed-in surface. The UI shows saved products, price movement, verdict changes, alert state, and better-alternative notifications."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/alerts">
            Price alerts
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section>
          <SectionHeader
            eyebrow="Watchlist"
            title="Saved products with active buying signals."
            description="Demo state only: persistence starts after auth is connected."
          />
          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {savedProducts.map((item) => (
              <div key={item.product.slug} className="space-y-3">
                <ProductCard product={item.product} actionLabel="Open saved report" />
                <div className="border-bw-border grid gap-3 rounded-[1.5rem] border bg-white p-4 text-sm font-bold text-bw-muted sm:grid-cols-3">
                  <span>{item.movement}</span>
                  <span className="text-primary">{item.alertStatus}</span>
                  <span>{item.note}</span>
                </div>
                <div className="flex gap-2">
                  <Button className="h-10 rounded-full px-4 font-black" variant="outline">
                    <Bell className="mr-2 size-4" />
                    Edit alert
                  </Button>
                  <Button className="h-10 rounded-full px-4 font-black" variant="outline">
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <LoginGateCard
            title="Login required to persist watchlists"
            description="Basic checks remain open, but saved products need an account so BuyWise can retain alerts and history."
          />
          <TrustNotice />
        </aside>
      </div>
    </AppPageShell>
  );
}
