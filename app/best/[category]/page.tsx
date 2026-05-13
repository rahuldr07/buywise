import Link from "next/link";
import { ArrowRight, Award, Filter, ShieldAlert } from "lucide-react";
import {
  AppPageShell,
  ProductCard,
  SectionHeader,
  TrustNotice,
  VerdictBadge,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { categoryRankings } from "@/lib/buywise-demo-data";
import { productCatalog } from "@/lib/demo-product";

export default async function BestCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const ranking = categoryRankings[category as keyof typeof categoryRankings] ?? categoryRankings["laptops-under-800"];

  return (
    <AppPageShell
      eyebrow="Best category"
      title={ranking.title}
      description={ranking.description}
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/search">
            Search products
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-5">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-primary" />
              <p className="font-black text-bw-ink">Budget and use-case filters</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Under $800", ...ranking.filters].map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-bw-border bg-bw-paper px-3 py-2 text-sm font-black text-bw-muted"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {ranking.winners.map((winner) => (
              <article
                key={winner.label}
                className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]"
              >
                <Award className="size-6 text-bw-amber" />
                <p className="mt-4 text-sm font-black text-primary">{winner.label}</p>
                <h2 className="font-display mt-2 text-2xl font-black text-bw-ink">
                  {winner.product.name}
                </h2>
                <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">{winner.reason}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <VerdictBadge verdict={winner.product.verdict} />
                  <span className="font-display text-3xl font-black text-bw-ink">
                    {winner.product.aiBuyScore}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <SectionHeader
            eyebrow="Ranked list"
            title="Products ordered by score, trust, timing, and price."
          />
          <div className="grid gap-4 xl:grid-cols-2">
            {productCatalog.map((product) => (
              <ProductCard key={product.slug} compare product={product} />
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <ShieldAlert className="size-6 text-bw-red" />
            <p className="mt-4 font-display text-2xl font-black text-bw-ink">Avoid list</p>
            <div className="mt-4 grid gap-3">
              {ranking.avoid.map((item) => (
                <p
                  key={item}
                  className="rounded-[1rem] border border-bw-border bg-white p-3 text-sm font-bold text-bw-muted"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
          <TrustNotice>
            Category rankings are commission-neutral and should explain why each pick wins.
          </TrustNotice>
        </aside>
      </div>
    </AppPageShell>
  );
}
