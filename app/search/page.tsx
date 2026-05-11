import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import { StagedRouteShell } from "@/components/shared/staged-route-shell";
import { Badge } from "@/components/ui/badge";
import { productCatalog } from "@/lib/demo-product";
import { formatPrice } from "@/lib/utils";

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
      description="Phase 1 search is intentionally staged: the polished experience exists, but live parsing and result ranking are not wired yet. Use these demo products to explore the full analytics report."
      primaryHref="/product/sony-wh-1000xm5"
      primaryLabel="Open demo verdict"
      secondaryHref="/"
      secondaryLabel="Back home"
      note="This keeps the product honest while the backend search pipeline is still being connected."
    >
      <div className="space-y-4">
        <div className="border-bw-border rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="bg-bw-blue-soft text-primary flex size-11 items-center justify-center rounded-lg">
              <Search className="size-5" />
            </span>
            <div>
              <p className="text-bw-muted text-xs font-black uppercase">Current state</p>
              <p className="text-bw-ink mt-1 font-semibold">
                UI path is ready. Live results are staged.
              </p>
            </div>
          </div>
        </div>

        <div className="border-bw-border rounded-xl border bg-white p-5">
          <p className="text-bw-muted text-xs font-black uppercase">Demo result set</p>
          <div className="mt-4 grid gap-3">
            {productCatalog.map((product) => (
              <Link
                key={product.slug}
                className="group border-bw-border bg-bw-paper grid gap-3 rounded-xl border p-3 transition hover:bg-white sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                href={`/product/${product.slug}`}
              >
                <Image
                  alt={product.name}
                  className="h-20 w-full rounded-lg object-cover sm:w-20"
                  height={160}
                  src={product.imageUrl}
                  width={160}
                />
                <div>
                  <p className="font-display text-bw-ink text-lg font-black">{product.name}</p>
                  <p className="text-bw-muted mt-1 text-sm font-medium">
                    {product.verdict} · {formatPrice(product.currentPrice, product.currency)}
                  </p>
                </div>
                <Badge className="bg-bw-blue-soft text-primary w-fit rounded-lg px-3 py-1">
                  Score {product.aiBuyScore}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-bw-border rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-bw-violet size-5" />
            <p className="text-bw-ink font-semibold">What gets added next</p>
          </div>
          <ul className="text-bw-muted mt-4 grid gap-3 text-sm font-medium">
            <li className="border-bw-border bg-bw-paper rounded-lg border p-3">
              Real result ranking from pasted links and search terms
            </li>
            <li className="border-bw-border bg-bw-paper rounded-lg border p-3">
              Richer comparison routing for better alternatives
            </li>
            <li className="border-bw-border bg-bw-paper rounded-lg border p-3">
              Logged-in watchlists and alert persistence
            </li>
          </ul>
        </div>
      </div>
    </StagedRouteShell>
  );
}
