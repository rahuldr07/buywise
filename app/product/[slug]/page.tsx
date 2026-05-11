import type { Metadata } from "next";
import Link from "next/link";
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
import { PriceAlertDialog } from "@/components/verdict/price-alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = demoProducts.get(slug);

  if (!product) notFound();

  const alternative = product.alternatives[0];
  const alternativeTheme = alternative ? verdictTheme[alternative.verdict] : null;

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="mx-auto max-w-7xl">
        <Button
          asChild
          variant="ghost"
          className="mb-5 h-11 rounded-xl border border-bw-border bg-white px-4 text-bw-ink hover:bg-bw-fog"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to checker
          </Link>
        </Button>

        <section className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-xl border border-bw-border bg-white p-5 shadow-sm">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-bw-border bg-bw-surface-raised">
              <div className="relative flex size-64 items-center justify-center">
                <div className="absolute h-48 w-48 rounded-full border-[18px] border-bw-ink" />
                <div className="absolute h-[7.5rem] w-[7.5rem] rounded-full border-[18px] border-bw-muted" />
                <div className="absolute top-6 h-28 w-9 rounded-full bg-bw-ink" />
                <div className="absolute bottom-6 left-8 size-12 rounded-xl bg-primary" />
                <div className="absolute bottom-6 right-8 size-12 rounded-xl bg-bw-green" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-bw-fog p-4">
                <p className="text-sm font-bold text-bw-muted">Retailer</p>
                <p className="mt-1 font-display text-xl font-black text-bw-ink">{product.retailer}</p>
              </div>
              <div className="rounded-lg bg-bw-fog p-4">
                <p className="text-sm font-bold text-bw-muted">Current price</p>
                <p className="mt-1 font-display text-xl font-black text-bw-ink">
                  {formatPrice(product.currentPrice, product.currency)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={verdictToClass(product.verdict)}>{product.verdict}</Badge>
              <Badge className="rounded-lg border border-bw-border bg-bw-fog px-3 py-1 text-bw-ink">
                Confidence {product.confidenceScore}%
              </Badge>
              <Badge className="rounded-lg border border-bw-border bg-white px-3 py-1 text-bw-muted">
                {product.category}
              </Badge>
            </div>

            <h1 className="mt-5 font-display text-4xl font-black leading-tight text-bw-ink md:text-6xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-bold text-bw-muted">
              <span>{product.retailer}</span>
              <span>|</span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-current text-bw-amber" />
                {product.reviewRating} from {formatNumber(product.reviewCount)} reviews
              </span>
              <span>|</span>
              <span>Updated {product.lastUpdated}</span>
            </div>

            <p className="mt-7 max-w-3xl text-lg font-medium leading-8 text-bw-muted">
              {product.verdictReason}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-bw-fog p-5">
                <p className="text-sm font-black text-bw-muted">AI Buy Score</p>
                <p className={`mt-2 font-display text-5xl font-black ${scoreToColor(product.aiBuyScore)}`}>
                  {product.aiBuyScore}
                </p>
              </div>
              <div className="rounded-xl bg-bw-fog p-5">
                <p className="text-sm font-black text-bw-muted">Current price</p>
                <p className="mt-2 font-display text-3xl font-black text-bw-ink">
                  {formatPrice(product.currentPrice, product.currency)}
                </p>
              </div>
              <div className="rounded-xl bg-bw-fog p-5">
                <p className="text-sm font-black text-bw-muted">Verdict</p>
                <p className="mt-2 font-display text-2xl font-black text-bw-ink">
                  {product.verdict}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-xl bg-primary px-5 text-primary-foreground">
                <a href={product.retailerUrl} rel="noreferrer" target="_blank">
                  View retailer
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>

              <PriceAlertDialog
                productName={product.name}
                currentPrice={product.currentPrice}
                currency={product.currency}
              />
            </div>

            <p className="mt-5 rounded-xl border border-bw-border bg-bw-green-soft p-4 text-sm font-medium leading-6 text-bw-muted">
              We may earn a commission when you buy through some links. AI scores and
              recommendations remain commission-neutral.
            </p>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-primary">Score breakdown</p>
                <h2 className="mt-2 font-display text-3xl font-black text-bw-ink">
                  Why this verdict landed here
                </h2>
              </div>
              <BarChart3 className="size-6 text-primary" />
            </div>

            <div className="mt-7 space-y-4">
              {product.scores.map((score) => (
                <div key={score.id} className="rounded-xl border border-bw-border bg-bw-paper p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-bw-ink">{score.label}</p>
                      <p className="mt-1 text-sm font-medium leading-6 text-bw-muted">
                        {score.description}
                      </p>
                    </div>
                    <span className={`font-display text-3xl font-black ${scoreToColor(score.score)}`}>
                      {score.score}
                    </span>
                  </div>
                  <Progress className="h-2 bg-bw-border" value={score.score} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-black text-bw-green">Buyer read</p>
            <h2 className="mt-2 font-display text-3xl font-black text-bw-ink">
              Pros and cons without the noise
            </h2>

            <Tabs className="mt-7" defaultValue="pros">
              <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-bw-fog p-1">
                <TabsTrigger className="rounded-lg data-active:bg-white" value="pros">
                  Pros
                </TabsTrigger>
                <TabsTrigger className="rounded-lg data-active:bg-white" value="cons">
                  Cons
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pros" className="mt-4 space-y-3">
                {product.pros.map((pro) => (
                  <div key={pro} className="flex gap-3 rounded-xl border border-bw-border bg-bw-paper p-4 text-sm font-medium leading-6 text-bw-muted">
                    <BadgeCheck className="mt-0.5 size-5 shrink-0 text-bw-green" />
                    <span>{pro}</span>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="cons" className="mt-4 space-y-3">
                {product.cons.map((con) => (
                  <div key={con} className="flex gap-3 rounded-xl border border-bw-border bg-bw-paper p-4 text-sm font-medium leading-6 text-bw-muted">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-bw-amber" />
                    <span>{con}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {alternative ? (
          <section className="mt-5 rounded-xl border border-bw-border bg-bw-green-soft p-6 shadow-sm md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge className="rounded-lg bg-white px-3 py-1 text-bw-green">
                  Better alternative found
                </Badge>
                <h2 className="mt-4 font-display text-3xl font-black text-bw-ink">
                  {alternative.name}
                </h2>
                <p className="mt-3 max-w-3xl text-base font-medium leading-8 text-bw-muted">
                  {alternative.tag} at {formatPrice(alternative.price, product.currency)} from{" "}
                  {alternative.retailer}. This option currently looks cleaner on comfort and recent
                  price stability.
                </p>

                <ul className="mt-5 grid gap-3 md:grid-cols-3">
                  {alternative.reasons.map((reason) => (
                    <li key={reason} className="rounded-xl border border-bw-border bg-white p-4 text-sm font-medium leading-6 text-bw-muted">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-bw-border bg-white p-6 text-center shadow-sm">
                {alternativeTheme ? (
                  <span className={cn("rounded-lg px-3 py-1 text-xs font-black", alternativeTheme.badge)}>
                    {alternative.verdict}
                  </span>
                ) : null}
                <p className="mt-4 text-sm font-black text-bw-muted">Alternative score</p>
                <p className="mt-1 font-display text-6xl font-black text-bw-green">
                  {alternative.aiBuyScore}
                </p>
                <Button asChild className="mt-5 h-12 rounded-xl bg-primary px-5 text-primary-foreground">
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
          <div className="rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-2 text-bw-amber">
              <TrendingDown className="size-5" />
              <p className="font-black">Price history preview</p>
            </div>
            <h2 className="mt-3 font-display text-3xl font-black text-bw-ink">
              Timing matters as much as quality
            </h2>

            <div className="mt-7 space-y-3">
              {product.priceHistory.map((point) => (
                <div key={point.date} className="flex items-center justify-between rounded-xl border border-bw-border bg-bw-paper p-4">
                  <div>
                    <p className="font-black text-bw-ink">{point.date}</p>
                    <p className="mt-1 text-sm font-medium text-bw-muted">{point.retailer}</p>
                  </div>
                  <span className="font-display text-2xl font-black text-bw-ink">
                    {formatPrice(point.price, product.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-black text-primary">Sources and evidence</p>
            <h2 className="mt-3 font-display text-3xl font-black text-bw-ink">
              Trust comes from visible source categories
            </h2>

            <ScrollArea className="mt-7 h-72 pr-4" data-lenis-prevent>
              <div className="space-y-3">
                {product.sources.map((source) => (
                  <div key={source.label} className="rounded-xl border border-bw-border bg-bw-paper p-4">
                    <Badge className="rounded-lg border border-bw-border bg-white px-3 py-1 text-bw-ink">
                      {source.type.replace("_", " ")}
                    </Badge>
                    <p className="mt-3 font-black text-bw-ink">{source.label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-bw-muted">
                      {source.detail}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-6" />

            <div className="flex gap-3 rounded-xl bg-bw-blue-soft p-4">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm font-medium leading-6 text-bw-muted">
                Source cards are demo-grade in Phase 1, but they show how evidence will be grouped.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
