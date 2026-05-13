import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, ReceiptText, RotateCcw, WalletCards } from "lucide-react";
import {
  AppPageShell,
  MockChart,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { receiptDemo } from "@/lib/buywise-demo-data";
import { formatPrice } from "@/lib/utils";

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppPageShell
      eyebrow="Receipt detail"
      title={`Receipt analysis: ${id === "receipt-demo" ? receiptDemo.retailer : "Demo retailer"}`}
      description="Analyze a past purchase, compare current prices, surface better alternatives, and track return or warranty windows."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/receipts/upload">
            Upload another
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <ReceiptMetric icon={<ReceiptText className="size-5" />} label="Retailer" value={receiptDemo.retailer} />
            <ReceiptMetric icon={<CalendarDays className="size-5" />} label="Purchase date" value={receiptDemo.purchaseDate} />
            <ReceiptMetric icon={<WalletCards className="size-5" />} label="Status" value={receiptDemo.status} />
          </div>

          <SectionHeader
            eyebrow="Items purchased"
            title="Current price comparison and next actions."
          />
          <div className="grid gap-4">
            {receiptDemo.items.map((item) => {
              const delta = item.current - item.paid;

              return (
                <article key={item.name} className="border-bw-border rounded-[2rem] border bg-white p-5">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h2 className="font-display text-2xl font-black text-bw-ink">{item.name}</h2>
                      <p className="mt-2 text-sm font-bold text-bw-muted">
                        Paid {formatPrice(item.paid)} - Current {formatPrice(item.current)}
                      </p>
                    </div>
                    <span className="rounded-full border border-bw-border bg-white px-4 py-2 text-sm font-black text-bw-amber">
                      {delta < 0 ? `${formatPrice(Math.abs(delta))} lower now` : "No savings gap"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-[1.25rem] bg-bw-paper p-4 text-sm font-bold text-bw-muted">
                    <RotateCcw className="size-4 text-primary" />
                    {item.action}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <p className="font-display text-2xl font-black text-bw-ink">Spending insight</p>
            <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
              Demo receipt suggests $31 of possible price movement after purchase.
            </p>
            <div className="mt-4">
              <MockChart
                color="#7b5af7"
                points={[
                  { label: "Paid", value: 420 },
                  { label: "Now", value: 389 },
                  { label: "Low", value: 376 },
                ]}
              />
            </div>
          </div>
          <TrustNotice>
            Receipt recommendations should include return-window and warranty context before suggesting action.
          </TrustNotice>
        </aside>
      </div>
    </AppPageShell>
  );
}

function ReceiptMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-bw-border rounded-[2rem] border bg-white p-5">
      <span className="bg-bw-paper flex size-11 items-center justify-center rounded-full text-primary">
        {icon}
      </span>
      <p className="mt-4 text-xs font-black text-bw-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-black text-bw-ink">{value}</p>
    </div>
  );
}
