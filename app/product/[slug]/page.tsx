import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ExternalLink,
  Headphones,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
} from "lucide-react";
import { PriceAlertDialog } from "@/components/verdict/price-alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { demoProducts } from "@/lib/demo-product";
import { cn, formatNumber, formatPrice, scoreToColor, verdictToClass } from "@/lib/utils";
import { verdictTheme } from "@/lib/verdict-theme";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = demoProducts.get(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} verdict`,
    description: product.verdictReason,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = demoProducts.get(slug);

  if (!product) notFound();

  const alternative = product.alternatives[0];
  const alternativeTheme = alternative ? verdictTheme[alternative.verdict] : null;
  const verdict = verdictTheme[product.verdict];

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <Button
          asChild
          className="text-bw-ink border-bw-border hover:bg-bw-fog mb-5 h-12 rounded-2xl border bg-white px-5 shadow-sm"
          variant="ghost"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to checker
          </Link>
        </Button>

        <section className="premium-shell premium-noise rounded-[2.75rem] border border-white/85 p-3 shadow-[0_34px_120px_rgba(44,37,24,0.12)] md:p-5">
          <div className="grid gap-5 rounded-[2.25rem] border border-white/80 bg-white p-4 md:p-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[2rem] border border-white/85 bg-white/76 p-4 shadow-[0_18px_70px_rgba(44,37,24,0.09)]">
              <div className="border-bw-border relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.75rem] border bg-[linear-gradient(145deg,#fff6da,#eef6ff_54%,#e9fbf2)]">
                <div className="premium-orb absolute -top-14 -right-14 size-52 rounded-full opacity-70" />
                <div className="bg-bw-coral/18 absolute bottom-10 left-10 size-28 rounded-full" />
                <div className="relative flex size-72 items-center justify-center">
                  <div className="border-bw-ink absolute h-56 w-56 rounded-full border-[20px] shadow-[0_24px_80px_rgba(24,32,25,0.18)]" />
                  <div className="absolute h-36 w-36 rounded-full border-[18px] border-white/90 bg-white/40" />
                  <div className="bg-bw-ink absolute top-8 flex h-32 w-12 items-center justify-center rounded-full">
                    <Headphones className="text-bw-mint size-5" />
                  </div>
                  <div className="bg-bw-blue absolute bottom-8 left-9 size-14 rounded-2xl shadow-lg" />
                  <div className="bg-bw-green absolute right-9 bottom-8 size-14 rounded-2xl shadow-lg" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/80 bg-white/72 p-4">
                  <p className="text-bw-muted text-sm font-bold">Retailer</p>
                  <p className="font-display text-bw-ink mt-1 text-xl font-black">
                    {product.retailer}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/80 bg-white/72 p-4">
                  <p className="text-bw-muted text-sm font-bold">Current price</p>
                  <p className="font-display text-bw-ink mt-1 text-xl font-black">
                    {formatPrice(product.currentPrice, product.currency)}
                  </p>
                </div>
              </div>

              <div className="border-bw-border mt-4 rounded-[1.75rem] border bg-white/72 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-bw-muted text-sm font-black">Signal map</p>
                  <Badge className={cn("rounded-2xl px-3 py-1 text-xs font-black", verdict.soft)}>
                    {product.aiBuyScore}/100
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {product.scores.slice(0, 3).map((score) => (
                    <div key={score.id}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-bw-ink text-sm font-bold">{score.label}</span>
                        <span
                          className={`font-display text-lg font-black ${scoreToColor(score.score)}`}
                        >
                          {score.score}
                        </span>
                      </div>
                      <Progress className="bg-bw-border h-2" value={score.score} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="border-bw-amber/25 bg-bw-amber-soft rounded-[1.5rem] border p-4">
                  <div className="text-bw-amber flex items-center gap-2">
                    <TrendingDown className="size-4" />
                    <p className="text-sm font-black">Timing read</p>
                  </div>
                  <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
                    Wait for a cleaner buy point unless you need it now.
                  </p>
                </div>
                <div className="border-bw-green/20 bg-bw-green-soft rounded-[1.5rem] border p-4">
                  <div className="text-bw-green flex items-center gap-2">
                    <BadgeCheck className="size-4" />
                    <p className="text-sm font-black">Better option visible</p>
                  </div>
                  <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
                    {alternative
                      ? alternative.name
                      : "BuyWise will surface alternatives when available."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/85 bg-white/82 p-5 shadow-[0_18px_70px_rgba(44,37,24,0.09)] md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={cn(
                    "rounded-2xl px-4 py-2 text-xs font-black",
                    verdictToClass(product.verdict)
                  )}
                >
                  {product.verdict}
                </Badge>
                <Badge className="border-bw-border bg-bw-fog text-bw-ink rounded-2xl border px-4 py-2">
                  Confidence {product.confidenceScore}%
                </Badge>
                <Badge className="border-bw-border text-bw-muted rounded-2xl border bg-white px-4 py-2">
                  {product.category}
                </Badge>
              </div>

              <h1 className="font-display text-bw-ink mt-6 text-4xl leading-tight font-black md:text-6xl">
                {product.name}
              </h1>

              <div className="text-bw-muted mt-5 flex flex-wrap items-center gap-3 text-sm font-bold">
                <span>{product.retailer}</span>
                <span className="bg-bw-border h-1 w-1 rounded-full" />
                <span className="flex items-center gap-1.5">
                  <Star className="text-bw-amber size-4 fill-current" />
                  {product.reviewRating} from {formatNumber(product.reviewCount)} reviews
                </span>
                <span className="bg-bw-border h-1 w-1 rounded-full" />
                <span>Updated {product.lastUpdated}</span>
              </div>

              <p className="text-bw-muted mt-7 max-w-3xl text-lg leading-8 font-medium">
                {product.verdictReason}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/80 bg-[linear-gradient(145deg,#ffffff,#fff3d8)] p-5 shadow-sm">
                  <p className="text-bw-muted text-sm font-black">AI Buy Score</p>
                  <p
                    className={`font-display mt-2 text-5xl font-black ${scoreToColor(product.aiBuyScore)}`}
                  >
                    {product.aiBuyScore}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/80 bg-[linear-gradient(145deg,#ffffff,#eef6ff)] p-5 shadow-sm">
                  <p className="text-bw-muted text-sm font-black">Current price</p>
                  <p className="font-display text-bw-ink mt-2 text-3xl font-black">
                    {formatPrice(product.currentPrice, product.currency)}
                  </p>
                </div>
                <div className={cn("rounded-[1.75rem] border p-5 shadow-sm", verdict.tint)}>
                  <p className="text-bw-muted text-sm font-black">Verdict</p>
                  <p className="font-display text-bw-ink mt-2 text-2xl font-black">
                    {product.verdict}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="text-primary-foreground h-[3.25rem] rounded-2xl bg-[linear-gradient(135deg,var(--bw-ink),var(--bw-blue)_58%,var(--bw-green))] px-5 shadow-[0_16px_42px_rgba(40,103,232,0.2)]"
                >
                  <a href={product.retailerUrl} rel="noreferrer" target="_blank">
                    View retailer
                    <ExternalLink className="ml-2 size-4" />
                  </a>
                </Button>

                <PriceAlertDialog
                  currency={product.currency}
                  currentPrice={product.currentPrice}
                  productName={product.name}
                />
              </div>

              <p className="border-bw-green/20 bg-bw-green-soft text-bw-muted mt-5 rounded-[1.5rem] border p-4 text-sm leading-6 font-medium">
                We may earn a commission when you buy through some links. AI scores and
                recommendations remain commission-neutral.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-bw-border rounded-[2.25rem] border bg-white p-6 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-primary text-sm font-black">Score breakdown</p>
                <h2 className="font-display text-bw-ink mt-2 text-3xl font-black">
                  Why this verdict landed here
                </h2>
              </div>
              <span className="bg-bw-blue-soft flex size-[3.25rem] items-center justify-center rounded-3xl">
                <BarChart3 className="text-primary size-6" />
              </span>
            </div>

            <div className="mt-7 space-y-4">
              {product.scores.map((score) => (
                <div
                  key={score.id}
                  className="border-bw-border rounded-[1.75rem] border bg-white/78 p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-bw-ink font-black">{score.label}</p>
                      <p className="text-bw-muted mt-1 text-sm leading-6 font-medium">
                        {score.description}
                      </p>
                    </div>
                    <span
                      className={`font-display text-3xl font-black ${scoreToColor(score.score)}`}
                    >
                      {score.score}
                    </span>
                  </div>
                  <Progress className="bg-bw-border h-2" value={score.score} />
                </div>
              ))}
            </div>
          </div>

          <div className="border-bw-border rounded-[2.25rem] border bg-white p-6 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-8">
            <p className="text-bw-green text-sm font-black">Buyer read</p>
            <h2 className="font-display text-bw-ink mt-2 text-3xl font-black">
              Pros and cons without the noise
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="border-bw-green/20 bg-bw-green-soft rounded-[1.75rem] border p-4">
                <p className="font-display text-bw-ink text-xl font-black">What works</p>
                <div className="mt-4 space-y-3">
                  {product.pros.map((pro) => (
                    <div
                      key={pro}
                      className="text-bw-muted flex gap-3 rounded-[1.35rem] border border-white/80 bg-white/78 p-4 text-sm leading-6 font-medium"
                    >
                      <BadgeCheck className="text-bw-green mt-0.5 size-5 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-bw-amber/25 bg-bw-amber-soft rounded-[1.75rem] border p-4">
                <p className="font-display text-bw-ink text-xl font-black">What to watch</p>
                <div className="mt-4 space-y-3">
                  {product.cons.map((con) => (
                    <div
                      key={con}
                      className="text-bw-muted flex gap-3 rounded-[1.35rem] border border-white/80 bg-white/78 p-4 text-sm leading-6 font-medium"
                    >
                      <ShieldCheck className="text-bw-amber mt-0.5 size-5 shrink-0" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {alternative ? (
          <section className="border-bw-green/20 mt-5 rounded-[2.25rem] border bg-[linear-gradient(135deg,#eafaf1,#ffffff_54%,#fff4dd)] p-6 shadow-[0_18px_70px_rgba(44,37,24,0.08)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge className="text-bw-green rounded-2xl bg-white px-4 py-2 shadow-sm">
                  Better alternative found
                </Badge>
                <h2 className="font-display text-bw-ink mt-4 text-3xl font-black">
                  {alternative.name}
                </h2>
                <p className="text-bw-muted mt-3 max-w-3xl text-base leading-8 font-medium">
                  {alternative.tag} at {formatPrice(alternative.price, product.currency)} from{" "}
                  {alternative.retailer}. This option currently looks cleaner on comfort and recent
                  price stability.
                </p>

                <ul className="mt-5 grid gap-3 md:grid-cols-3">
                  {alternative.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="text-bw-muted rounded-[1.5rem] border border-white/80 bg-white/78 p-4 text-sm leading-6 font-medium shadow-sm"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-white/85 bg-white/82 p-6 text-center shadow-[0_18px_70px_rgba(44,37,24,0.08)]">
                {alternativeTheme ? (
                  <span
                    className={cn(
                      "rounded-2xl px-4 py-2 text-xs font-black",
                      alternativeTheme.badge
                    )}
                  >
                    {alternative.verdict}
                  </span>
                ) : null}
                <p className="text-bw-muted mt-5 text-sm font-black">Alternative score</p>
                <p className="font-display text-bw-green mt-1 text-6xl font-black">
                  {alternative.aiBuyScore}
                </p>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground mt-5 h-12 rounded-2xl px-5"
                >
                  <Link href={`/compare/${product.slug}`}>
                    Compare view
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="border-bw-border rounded-[2.25rem] border bg-white p-6 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-8">
            <div className="text-bw-amber flex items-center gap-2">
              <TrendingDown className="size-5" />
              <p className="font-black">Price history preview</p>
            </div>
            <h2 className="font-display text-bw-ink mt-3 text-3xl font-black">
              Timing matters as much as quality
            </h2>

            <div className="mt-7 space-y-3">
              {product.priceHistory.map((point) => (
                <div
                  key={point.date}
                  className="border-bw-border flex items-center justify-between rounded-[1.5rem] border bg-white/76 p-4"
                >
                  <div>
                    <p className="text-bw-ink font-black">{point.date}</p>
                    <p className="text-bw-muted mt-1 text-sm font-medium">{point.retailer}</p>
                  </div>
                  <span className="font-display text-bw-ink text-2xl font-black">
                    {formatPrice(point.price, product.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-bw-border rounded-[2.25rem] border bg-white p-6 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-8">
            <p className="text-primary text-sm font-black">Sources and evidence</p>
            <h2 className="font-display text-bw-ink mt-3 text-3xl font-black">
              Trust comes from visible source categories
            </h2>

            <ScrollArea className="mt-7 h-72 pr-4" data-lenis-prevent>
              <div className="space-y-3">
                {product.sources.map((source) => (
                  <div
                    key={source.label}
                    className="border-bw-border rounded-[1.5rem] border bg-white/76 p-4 shadow-sm"
                  >
                    <Badge className="border-bw-border text-bw-ink rounded-2xl border bg-white px-3 py-1">
                      {source.type.replace("_", " ")}
                    </Badge>
                    <p className="text-bw-ink mt-3 font-black">{source.label}</p>
                    <p className="text-bw-muted mt-2 text-sm leading-6 font-medium">
                      {source.detail}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-6" />

            <div className="bg-bw-blue-soft flex gap-3 rounded-[1.5rem] p-4">
              <Sparkles className="text-primary mt-0.5 size-5 shrink-0" />
              <p className="text-bw-muted text-sm leading-6 font-medium">
                Source cards are demo-grade in Phase 1, but they show how evidence will be grouped.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
