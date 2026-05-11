import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";
import { Badge } from "@/components/ui/badge";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "your product";

  return (
    <StagedRouteShell
      eyebrow="Search flow"
      title={`Results for ${query}`}
      description="Phase 1 search is intentionally staged: the polished experience exists, but live parsing and result ranking are not wired yet. The strongest current path is the full Sony demo verdict."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo verdict"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="This keeps the product honest while the backend search pipeline is still being connected."
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-bw-border bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-bw-blue-soft text-primary">
              <Search className="size-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase text-bw-muted">
                Current state
              </p>
              <p className="mt-1 font-semibold text-bw-ink">UI path is ready. Live results are staged.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-bw-border bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-bw-muted">
                Recommended path
              </p>
              <p className="mt-1 font-display text-2xl font-black text-bw-ink">
                Sony demo report
              </p>
            </div>
            <Badge className="rounded-lg bg-bw-blue-soft px-3 py-1 text-primary">
              Best available demo
            </Badge>
          </div>

          <p className="mt-4 text-sm font-medium leading-6 text-bw-muted">
            If you want to see the report experience right now, this is the path with the most
            complete product, verdict, and alternative guidance.
          </p>

          <Link
            href="/product/sony-wh-1000xm5"
            className="group mt-5 inline-flex items-center text-sm font-black text-bw-ink transition hover:text-primary"
          >
            Go to the report
            <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="rounded-xl border border-bw-border bg-white p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-bw-violet" />
            <p className="font-semibold text-bw-ink">What gets added next</p>
          </div>
          <ul className="mt-4 grid gap-3 text-sm font-medium text-bw-muted">
            <li className="rounded-lg border border-bw-border bg-bw-paper p-3">
              Real result ranking from pasted links and search terms
            </li>
            <li className="rounded-lg border border-bw-border bg-bw-paper p-3">
              Richer comparison routing for better alternatives
            </li>
            <li className="rounded-lg border border-bw-border bg-bw-paper p-3">
              Logged-in watchlists and alert persistence
            </li>
          </ul>
        </div>
      </div>
    </StagedRouteShell>
  );
}
