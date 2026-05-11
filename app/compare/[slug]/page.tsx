import { BarChart3, GitCompareArrows, ShieldCheck } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";
import { demoProduct } from "@/lib/demo-product";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alternative = demoProduct.alternatives[0];

  return (
    <StagedRouteShell
      eyebrow="Comparison route"
      title={`Compare view for ${slug}`}
      description="The comparison route is staged for the next layer of the product. The design path is ready, but structured head-to-head scoring is still being wired into the demo data model."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Back to product report"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="The better-alternative callout now leads somewhere intentional instead of a dead action."
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-bw-border bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-bw-blue-soft text-primary">
              <GitCompareArrows className="size-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-bw-muted">
                Next step
              </p>
              <p className="mt-1 font-semibold text-bw-ink">Head-to-head verdict comparisons</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-bw-border bg-white p-5">
          <p className="text-xs font-black uppercase text-bw-muted">
            Current recommendation
          </p>
          <p className="mt-2 font-display text-2xl font-black text-bw-ink">
            {alternative?.name ?? "Alternative pending"}
          </p>
          <p className="mt-3 text-sm font-medium leading-6 text-bw-muted">
            This route is where side-by-side scoring, tradeoff breakdowns, and source-backed
            reasons will land once comparison data is ready.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <BarChart3 className="size-5 text-bw-violet" />
            <p className="mt-4 font-semibold text-bw-ink">Score delta</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Product vs alternative scoring modules will plug in here.
            </p>
          </div>
          <div className="rounded-xl border border-bw-border bg-white p-5">
            <ShieldCheck className="size-5 text-bw-green" />
            <p className="mt-4 font-semibold text-bw-ink">Reason trace</p>
            <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
              Each recommendation will explain exactly why the alternative wins.
            </p>
          </div>
        </div>
      </div>
    </StagedRouteShell>
  );
}
