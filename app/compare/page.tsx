import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  GitCompareArrows,
  Scale,
  ShieldCheck,
  Target,
  TrendingDown,
} from "lucide-react";
import {
  AffiliateDisclosure,
  AppPageShell,
  VerdictBadge,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { productCatalog } from "@/lib/demo-product";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductVerdict } from "@/types/product";

const compareWeights = [
  { id: "ai", label: "AI verdict strength", weight: 28 },
  { id: "value", label: "Value", weight: 20 },
  { id: "quality", label: "Quality", weight: 16 },
  { id: "trust", label: "Review trust", weight: 18 },
  { id: "price", label: "Price timing", weight: 14 },
  { id: "confidence", label: "Confidence", weight: 4 },
] as const;

export default function ComparePage() {
  const products = productCatalog.slice(0, 3);
  const ranked = products
    .map((product) => ({ product, intelligence: getCompareIntelligence(product) }))
    .sort((a, b) => b.intelligence.modelScore - a.intelligence.modelScore);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const winGap = winner.intelligence.modelScore - runnerUp.intelligence.modelScore;

  return (
    <AppPageShell
      eyebrow="Compare intelligence"
      title="A decision engine for choosing the cleanest product."
      description="Compare does more than line up specs. It weights value, quality, review trust, price timing, confidence, and alternative risk before naming a winner."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href={`/product/${winner.product.slug}`}>
            Open winner
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <section className="space-y-5">
        <div className="border-bw-border overflow-hidden rounded-[2.5rem] border bg-[linear-gradient(135deg,#ffffff_0%,#fff8e7_48%,#edf5ff_100%)] p-5 shadow-[0_20px_70px_rgba(33,32,24,0.08)] md:p-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-5 text-primary" />
                <p className="text-sm font-black text-primary">Final model read</p>
              </div>
              <h2 className="font-display mt-3 max-w-4xl text-4xl leading-tight font-black tracking-[-0.055em] text-bw-ink md:text-6xl">
                {winner.product.name} wins by {winGap} intelligence points.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 font-medium text-bw-muted">
                The winner is not just the highest AI score. It has the strongest weighted blend of
                evidence quality, price timing, review confidence, and buyer-fit trade-offs.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <SignalPill label="Winner" value={winner.product.brand} />
                <SignalPill label="Model score" value={winner.intelligence.modelScore} />
                <SignalPill label="Runner-up gap" value={`+${winGap}`} />
              </div>
            </div>

            <div className="border-bw-border rounded-[2rem] border bg-white/82 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
              <div className="relative h-48 overflow-hidden rounded-[1.5rem] bg-bw-fog">
                <Image
                  alt={winner.product.name}
                  className="h-full w-full object-cover"
                  height={360}
                  priority
                  src={winner.product.imageUrl}
                  width={520}
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <VerdictBadge verdict={winner.product.verdict} />
                <span className="font-display text-4xl font-black text-bw-ink">
                  {winner.intelligence.modelScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ranked.map(({ product, intelligence }, index) => (
            <article
              key={product.slug}
              className={cn(
                "border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]",
                index === 0 && "ring-primary/15 ring-4"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <VerdictBadge verdict={product.verdict} />
                <span className="rounded-full border border-bw-border bg-bw-paper px-3 py-1.5 text-xs font-black text-bw-muted">
                  Rank #{index + 1}
                </span>
              </div>
              <h2 className="font-display mt-4 text-2xl leading-tight font-black text-bw-ink">
                {product.name}
              </h2>
              <p className="mt-2 text-sm font-bold text-bw-muted">
                {product.brand} - {product.category} - {formatPrice(product.currentPrice, product.currency)}
              </p>

              <div className="mt-5 rounded-[1.5rem] bg-bw-paper p-4">
                <p className="text-xs font-black text-bw-muted">Weighted compare score</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="font-display text-5xl font-black text-bw-ink">
                    {intelligence.modelScore}
                  </p>
                  <p className="text-right text-xs leading-5 font-black text-bw-muted">
                    {intelligence.reasons[0]}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {compareWeights.slice(1, 5).map((factor) => (
                  <FactorBar
                    key={factor.id}
                    label={factor.label}
                    score={intelligence.factors[factor.id]}
                    weight={factor.weight}
                  />
                ))}
              </div>

              <Button asChild className="mt-5 h-11 w-full rounded-full font-black" variant="outline">
                <Link href={`/product/${product.slug}`}>View full report</Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_24rem]">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <div className="flex items-center gap-2">
              <GitCompareArrows className="size-5 text-primary" />
              <p className="font-black text-bw-ink">Evidence matrix</p>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-xs font-black uppercase tracking-[0.16em] text-bw-muted">
                  <tr>
                    <th className="p-3">Signal</th>
                    {products.map((product) => (
                      <th key={product.slug} className="p-3">
                        {product.brand}
                      </th>
                    ))}
                    <th className="p-3">Why it matters</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-bw-ink">
                  {compareWeights.map((factor) => (
                    <tr key={factor.id} className="border-t border-bw-border">
                      <td className="p-3 text-bw-muted">
                        {factor.label}
                        <span className="ml-2 rounded-full bg-bw-paper px-2 py-1 text-[0.65rem]">
                          {factor.weight}%
                        </span>
                      </td>
                      {products.map((product) => (
                        <td key={product.slug} className="p-3">
                          {getCompareIntelligence(product).factors[factor.id]}
                        </td>
                      ))}
                      <td className="p-3 text-bw-muted">{factorMeaning(factor.id)}</td>
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
                Choose {winner.product.name} when the priority is the strongest total evidence
                profile. Choose {runnerUp.product.name} only if its specific use case matters more
                than the model-weighted winner.
              </p>
            </div>

            <div className="border-bw-border rounded-[2rem] border bg-white p-5">
              <ShieldCheck className="size-6 text-primary" />
              <p className="mt-4 font-display text-2xl font-black text-bw-ink">Neutrality guardrail</p>
              <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                Affiliate availability is not a weighted factor. The compare model ranks evidence,
                not commission.
              </p>
            </div>
            <AffiliateDisclosure />
          </aside>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <UseCaseCard
            icon={<Target className="size-5" />}
            label="Best for most buyers"
            product={winner.product}
            reason={winner.intelligence.reasons[1]}
          />
          <UseCaseCard
            icon={<TrendingDown className="size-5" />}
            label="Best price timing"
            product={bestByFactor(products, "price")}
            reason="Has the strongest price score and the cleanest current deal timing."
          />
          <UseCaseCard
            icon={<Scale className="size-5" />}
            label="Best trust profile"
            product={bestByFactor(products, "trust")}
            reason="Review trust and confidence signals are strongest for this option."
          />
        </div>
      </section>
    </AppPageShell>
  );
}

function getCompareIntelligence(product: ProductVerdict) {
  const factors = {
    ai: product.aiBuyScore,
    confidence: product.confidenceScore,
    price: scoreById(product, "price"),
    quality: scoreById(product, "quality"),
    trust: scoreById(product, "trust"),
    value: scoreById(product, "value"),
  };
  const modelScore = Math.round(
    factors.ai * 0.28 +
      factors.value * 0.2 +
      factors.quality * 0.16 +
      factors.trust * 0.18 +
      factors.price * 0.14 +
      factors.confidence * 0.04
  );
  const bestFactor = Object.entries(factors)
    .filter(([key]) => key !== "ai")
    .sort((a, b) => b[1] - a[1])[0];

  return {
    factors,
    modelScore,
    reasons: [
      `Strongest ${labelForFactor(bestFactor[0])} signal at ${bestFactor[1]}.`,
      product.verdictReason,
      product.pros[0],
    ],
  };
}

function scoreById(product: ProductVerdict, id: string) {
  return product.scores.find((score) => score.id === id)?.score ?? product.aiBuyScore;
}

function bestByFactor(products: ProductVerdict[], id: "price" | "trust") {
  return [...products].sort((a, b) => scoreById(b, id) - scoreById(a, id))[0];
}

function labelForFactor(id: string) {
  if (id === "price") return "price timing";
  if (id === "trust") return "review trust";
  if (id === "quality") return "quality";
  if (id === "value") return "value";
  return "confidence";
}

function factorMeaning(id: string) {
  if (id === "ai") return "Overall verdict strength from the full product report.";
  if (id === "value") return "How much useful product you get for today’s price.";
  if (id === "quality") return "Build, reliability, feature, and performance evidence.";
  if (id === "trust") return "Review consistency across retailer, expert, and community signals.";
  if (id === "price") return "Whether today is a good time to buy versus recent history.";
  return "How much evidence supports the final recommendation.";
}

function SignalPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-bw-border rounded-full border bg-white/82 px-4 py-3 text-left">
      <p className="text-[0.68rem] font-black tracking-[0.16em] text-bw-muted uppercase">{label}</p>
      <p className="font-display text-bw-ink text-lg font-black">{value}</p>
    </div>
  );
}

function FactorBar({ label, score, weight }: { label: string; score: number; weight: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-black">
        <span className="text-bw-muted">{label}</span>
        <span className="text-bw-ink">
          {score} / {weight}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bw-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function UseCaseCard({
  icon,
  label,
  product,
  reason,
}: {
  icon: ReactNode;
  label: string;
  product: ProductVerdict;
  reason: string;
}) {
  return (
    <article className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]">
      <span className="bg-bw-blue-soft text-primary flex size-11 items-center justify-center rounded-full">
        {icon}
      </span>
      <p className="mt-4 text-sm font-black text-primary">{label}</p>
      <h3 className="font-display mt-2 text-2xl leading-tight font-black text-bw-ink">
        {product.name}
      </h3>
      <p className="mt-3 text-sm leading-6 font-medium text-bw-muted">{reason}</p>
    </article>
  );
}
