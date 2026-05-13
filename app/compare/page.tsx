import Link from "next/link";
import { ArrowRight, CheckCircle2, GitCompareArrows } from "lucide-react";
import {
  AffiliateDisclosure,
  AppPageShell,
  ProductStatStrip,
  SectionHeader,
  VerdictBadge,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { productCatalog } from "@/lib/demo-product";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const products = productCatalog.slice(0, 3);
  const winner = [...products].sort((a, b) => b.aiBuyScore - a.aiBuyScore)[0];

  return (
    <AppPageShell
      eyebrow="Compare products"
      title="Side-by-side product comparison with one final recommendation."
      description="Compare price, AI score, review trust, specs, pros, cons, use cases, and the final BuyWise recommendation."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href={`/product/${winner.slug}`}>
            Open winner
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-5">
        <SectionHeader
          eyebrow="Recommendation"
          title={`${winner.name} is the strongest current pick.`}
          description="This is based on score strength, confidence, price timing, and review trust in the demo data."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.slug}
              className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]"
            >
              <div className="flex items-center justify-between gap-3">
                <VerdictBadge verdict={product.verdict} />
                {product.slug === winner.slug ? (
                  <span className="rounded-full border border-bw-border bg-white px-3 py-1.5 text-xs font-black text-bw-green">
                    Best pick
                  </span>
                ) : null}
              </div>
              <h2 className="font-display mt-4 text-2xl font-black text-bw-ink">{product.name}</h2>
              <p className="mt-2 text-sm font-bold text-bw-muted">
                {product.brand} - {product.category}
              </p>
              <div className="mt-5">
                <ProductStatStrip product={product} />
              </div>
              <div className="mt-5 grid gap-2">
                <CompareRow label="Best price" value={formatPrice(product.currentPrice, product.currency)} />
                <CompareRow label="Retailer" value={product.retailer} />
                <CompareRow label="Best for" value={bestFor(product.category)} />
              </div>
              <Button asChild className="mt-5 h-11 w-full rounded-full font-black" variant="outline">
                <Link href={`/product/${product.slug}`}>View report</Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_24rem]">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="size-5 text-primary" />
              <p className="font-black text-bw-ink">Spec and trade-off comparison</p>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs font-black uppercase tracking-[0.16em] text-bw-muted">
                  <tr>
                    <th className="p-3">Signal</th>
                    {products.map((product) => (
                      <th key={product.slug} className="p-3">
                        {product.brand}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-bold text-bw-ink">
                  {["AI Buy Score", "Price", "Review rating", "Primary pro", "Main risk"].map((row) => (
                    <tr key={row} className="border-t border-bw-border">
                      <td className="p-3 text-bw-muted">{row}</td>
                      {products.map((product) => (
                        <td key={product.slug} className="p-3">
                          {tableValue(row, product)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <CheckCircle2 className="size-6 text-bw-green" />
              <p className="mt-4 font-display text-2xl font-black text-bw-ink">Final AI read</p>
              <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                Choose {winner.name} if you want the strongest blend of value, trust, quality, and timing.
              </p>
            </div>
            <AffiliateDisclosure />
          </aside>
        </div>
      </section>
    </AppPageShell>
  );
}

function CompareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full border border-bw-border bg-bw-paper px-4 py-2.5">
      <span className="text-xs font-black text-bw-muted">{label}</span>
      <span className="text-sm font-black text-bw-ink">{value}</span>
    </div>
  );
}

function bestFor(category: string) {
  if (category === "Smartphones") return "Camera and resale";
  if (category === "Headphones") return "Travel and focus";
  return "Daily use";
}

function tableValue(row: string, product: (typeof productCatalog)[number]) {
  if (row === "AI Buy Score") return product.aiBuyScore;
  if (row === "Price") return formatPrice(product.currentPrice, product.currency);
  if (row === "Review rating") return `${product.reviewRating}/5`;
  if (row === "Primary pro") return product.pros[0];
  return product.cons[0];
}
