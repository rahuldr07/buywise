import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
} from "lucide-react";
import { ProductAnalytics } from "@/components/verdict/product-analytics";
import { PriceAlertDialog } from "@/components/verdict/price-alert-dialog";
import { ReviewSynthesis } from "@/components/verdict/review-synthesis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const lowestPrice = Math.min(...product.priceHistory.map((point) => point.price));
  const highestPrice = Math.max(...product.priceHistory.map((point) => point.price));
  const priceAboveLow = product.currentPrice - lowestPrice;
  const suggestedAction =
    product.verdict === "Buy"
      ? "Buy if it fits your needs"
      : product.verdict === "Wait"
        ? "Wait for deal range"
        : product.verdict === "Avoid"
          ? "Avoid for now"
          : "Compare alternative";
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
    : null;

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <Button
          asChild
          className="border-bw-border text-bw-ink hover:bg-bw-fog mb-5 h-12 rounded-full border bg-white px-5 shadow-sm"
          variant="ghost"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to checker
          </Link>
        </Button>

        <section className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-black",
                    verdictToClass(product.verdict)
                  )}
                >
                  {product.verdict}
                </Badge>
                <Badge className="border-bw-border bg-bw-fog text-bw-ink rounded-full border px-4 py-2">
                  Confidence {product.confidenceScore}%
                </Badge>
                <Badge className="border-bw-border text-bw-muted rounded-full border bg-white px-4 py-2">
                  {product.category}
                </Badge>
              </div>

              <h1 className="font-display text-bw-ink mt-6 max-w-4xl text-4xl leading-tight font-black md:text-6xl">
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-bw-ink h-[3.25rem] rounded-full px-6 text-white">
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

              <p className="border-bw-border bg-bw-green-soft text-bw-muted mt-5 rounded-[1.5rem] border p-4 text-sm leading-6 font-medium">
                We may earn a commission when you buy through some links. AI scores and
                recommendations remain commission-neutral.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="border-bw-border bg-bw-fog rounded-[1.75rem] border p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-bw-muted text-sm font-black">Executive score</p>
                    <p
                      className={`font-display mt-2 text-6xl font-black ${scoreToColor(product.aiBuyScore)}`}
                    >
                      {product.aiBuyScore}
                    </p>
                  </div>
                  <div className="border-bw-border size-28 overflow-hidden rounded-[1.5rem] border bg-white">
                    <Image
                      alt={product.name}
                      className="h-full w-full object-cover"
                      height={224}
                      loading="eager"
                      src={product.imageUrl}
                      width={224}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Current price"
                  value={formatPrice(product.currentPrice, product.currency)}
                />
                <MetricCard
                  label="Deal range"
                  value={`${formatPrice(lowestPrice, product.currency)}-${formatPrice(highestPrice, product.currency)}`}
                />
                <MetricCard
                  label="Above low"
                  value={`+${formatPrice(priceAboveLow, product.currency)}`}
                />
                <MetricCard label="Retail discount" value={discount ? `${discount}%` : "N/A"} />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5">
          <ProductAnalytics
            alternative={alternative}
            currentPrice={product.currentPrice}
            currentScore={product.aiBuyScore}
            priceHistory={product.priceHistory}
            scores={product.scores}
          />
        </div>

        <section className="mt-5">
          <ReviewSynthesis reviews={product.reviewInsights} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-primary text-sm font-black">Score drivers</p>
                <h2 className="font-display text-bw-ink mt-2 text-3xl font-black">
                  What moved the verdict
                </h2>
              </div>
              <BarChart3 className="text-primary size-6" />
            </div>

            <div className="mt-7 space-y-4">
              {product.scores.map((score) => (
                <div
                  key={score.id}
                  className="border-bw-border bg-bw-paper rounded-[1.5rem] border p-4"
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
                  <div className="bg-bw-border h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
            <p className="text-bw-green text-sm font-black">Buyer read</p>
            <h2 className="font-display text-bw-ink mt-2 text-3xl font-black">
              Pros, risks, and action
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <InsightList icon="pro" items={product.pros} title="Strengths" />
              <InsightList icon="risk" items={product.cons} title="Risks" />
            </div>
          </article>
        </section>

        {alternative ? (
          <section className="border-bw-border mt-5 rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge className="border-bw-green/20 bg-bw-green-soft text-bw-green rounded-full border px-4 py-2">
                  Better alternative found
                </Badge>
                <h2 className="font-display text-bw-ink mt-4 text-3xl font-black">
                  {alternative.name}
                </h2>
                <p className="text-bw-muted mt-3 max-w-3xl text-base leading-8 font-medium">
                  {alternative.tag} at {formatPrice(alternative.price, product.currency)} from{" "}
                  {alternative.retailer}. This option currently scores higher and has a stronger
                  stability profile.
                </p>

                <ul className="mt-5 grid gap-3 md:grid-cols-3">
                  {alternative.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="border-bw-border bg-bw-paper text-bw-muted rounded-[1.25rem] border p-4 text-sm leading-6 font-medium"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-bw-border bg-bw-fog rounded-[1.75rem] border p-6 text-center">
                {alternativeTheme ? (
                  <span
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-black",
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
                  className="bg-primary text-primary-foreground mt-5 h-12 rounded-full px-5"
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

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
            <div className="text-bw-amber flex items-center gap-2">
              <TrendingDown className="size-5" />
              <p className="font-black">Price model summary</p>
            </div>
            <h2 className="font-display text-bw-ink mt-3 text-3xl font-black">Timing signal</h2>
            <div className="mt-6 space-y-3">
              <MetricRow
                label="Lowest recent price"
                value={formatPrice(lowestPrice, product.currency)}
              />
              <MetricRow
                label="Highest recent price"
                value={formatPrice(highestPrice, product.currency)}
              />
              <MetricRow
                label="Current vs recent low"
                value={`+${formatPrice(priceAboveLow, product.currency)}`}
              />
              <MetricRow label="Suggested action" value={suggestedAction} />
            </div>
          </article>

          <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
            <p className="text-primary text-sm font-black">Sources and evidence</p>
            <h2 className="font-display text-bw-ink mt-3 text-3xl font-black">
              Evidence categories used in the report
            </h2>

            <ScrollArea className="mt-7 h-72 pr-4" data-lenis-prevent>
              <div className="space-y-3">
                {product.sources.map((source) => (
                  <div
                    key={source.label}
                    className="border-bw-border bg-bw-paper rounded-[1.5rem] border p-4"
                  >
                    <Badge className="border-bw-border text-bw-ink rounded-full border bg-white px-3 py-1">
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
          </article>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-bw-border rounded-[1.35rem] border bg-white p-4">
      <p className="text-bw-muted text-sm font-bold">{label}</p>
      <p className="font-display text-bw-ink mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-bw-border bg-bw-paper flex items-center justify-between gap-4 rounded-[1.25rem] border p-4">
      <span className="text-bw-muted text-sm font-bold">{label}</span>
      <span className="font-display text-bw-ink text-right text-lg font-black">{value}</span>
    </div>
  );
}

function InsightList({
  icon,
  items,
  title,
}: {
  icon: "pro" | "risk";
  items: string[];
  title: string;
}) {
  const positive = icon === "pro";

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border p-4",
        positive ? "border-bw-green/20 bg-bw-green-soft" : "border-bw-amber/25 bg-bw-amber-soft"
      )}
    >
      <p className="font-display text-bw-ink text-xl font-black">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="text-bw-muted flex gap-3 rounded-[1.15rem] border border-white/80 bg-white p-4 text-sm leading-6 font-medium"
          >
            {positive ? (
              <BadgeCheck className="text-bw-green mt-0.5 size-5 shrink-0" />
            ) : (
              <ShieldCheck className="text-bw-amber mt-0.5 size-5 shrink-0" />
            )}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
