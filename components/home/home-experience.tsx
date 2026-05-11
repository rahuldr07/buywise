"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Link2,
  LockKeyhole,
  ScanBarcode,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { demoProduct } from "@/lib/demo-product";
import { cn, formatPrice } from "@/lib/utils";
import { verdictTheme } from "@/lib/verdict-theme";
import type { Verdict } from "@/types/product";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const inputModes = [
  { label: "Link", icon: Link2 },
  { label: "Search", icon: Search },
  { label: "Barcode", icon: ScanBarcode },
  { label: "Image", icon: Camera },
] as const;

const proof = [
  { label: "AI Buy Score", value: demoProduct.aiBuyScore },
  { label: "Confidence", value: `${demoProduct.confidenceScore}%` },
  { label: "Reviews", value: "18.4k" },
] as const;

const verdictCards: Array<{ verdict: Verdict; title: string; body: string }> = [
  {
    verdict: "Buy",
    title: "Good value now",
    body: "Price, trust, and product quality are aligned enough to move.",
  },
  {
    verdict: "Wait",
    title: "Right product, wrong timing",
    body: "The item is solid, but the price or release cycle says pause.",
  },
  {
    verdict: "Avoid",
    title: "Risk is too visible",
    body: "Complaints, weak value, or trust signals break the recommendation.",
  },
  {
    verdict: "Better Alternative Available",
    title: "A cleaner option wins",
    body: "BuyWise surfaces a stronger pick when it clearly deserves the slot.",
  },
];

const steps = [
  "Paste a product link or type a product name.",
  "BuyWise checks price, reviews, complaints, and alternatives.",
  "You get one verdict with the reason and next action.",
] as const;

const spring = {
  type: "spring" as const,
  stiffness: 140,
  damping: 18,
};

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomeExperience() {
  const scopeRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const alternative = demoProduct.alternatives[0];
  const verdict = verdictTheme[demoProduct.verdict];

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.72 } })
        .from("[data-hero-nav]", { y: -18, autoAlpha: 0 })
        .from("[data-hero-copy]", { y: 28, autoAlpha: 0, stagger: 0.08 }, "-=0.32")
        .from("[data-checker]", { y: 32, autoAlpha: 0 }, "-=0.42")
        .from("[data-proof]", { y: 18, autoAlpha: 0, stagger: 0.06 }, "-=0.34");

      gsap.utils.toArray<HTMLElement>("[data-lift]").forEach((item) => {
        gsap.from(item, {
          y: 28,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
          },
        });
      });
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <main ref={scopeRef} className="min-h-screen text-bw-ink">
      <header data-hero-nav className="sticky top-0 z-50 border-b border-bw-border/70 bg-bw-paper/86 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-bw-ink text-white">
              <Sparkles className="size-4 text-bw-green" />
            </span>
            <span className="font-display text-xl font-black">BuyWise</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-bw-muted md:flex">
            <a className="hover:text-bw-ink" href="#verdicts">
              Verdicts
            </a>
            <a className="hover:text-bw-ink" href="#flow">
              Flow
            </a>
            <a className="hover:text-bw-ink" href="#trust">
              Trust
            </a>
          </nav>

          <Link
            href="/product/sony-wh-1000xm5"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-bw-ink px-4 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5"
          >
            Demo report
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <div data-hero-copy className="inline-flex items-center gap-2 rounded-xl border border-bw-border bg-white px-3 py-2 text-sm font-bold text-bw-muted shadow-sm">
            <ShieldCheck className="size-4 text-bw-green" />
            Commission-neutral product checks
          </div>

          <h1 data-hero-copy className="mt-7 max-w-3xl font-display text-5xl font-black leading-none text-bw-ink md:text-7xl">
            Know what to buy before you buy.
          </h1>

          <p data-hero-copy className="mt-6 max-w-2xl text-lg font-medium leading-8 text-bw-muted">
            Paste a product link or search by name. BuyWise gives you a clean Buy, Wait, Avoid, or
            Better Alternative verdict with the reason attached.
          </p>

          <div data-hero-copy className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#checker"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground shadow-[0_14px_30px_rgba(49,94,216,0.22)] transition hover:-translate-y-0.5"
            >
              Check a product
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/product/sony-wh-1000xm5"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-bw-border bg-white px-5 text-sm font-black text-bw-ink transition hover:-translate-y-0.5"
            >
              View demo verdict
              <Star className="size-4 text-bw-amber" />
            </Link>
          </div>
        </div>

        <div id="checker" data-checker className="border border-bw-border bg-white shadow-[0_28px_80px_rgba(23,32,25,0.12)]">
          <div className="border-b border-bw-border bg-bw-fog px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-bw-ink">Product checker</p>
                <p className="text-sm font-medium text-bw-muted">No login needed for basic checks</p>
              </div>
              <span className={cn("rounded-lg px-3 py-1 text-xs font-black", verdict.badge)}>
                {demoProduct.verdict}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {inputModes.map((mode, index) => {
                const Icon = mode.icon;

                return (
                  <button
                    key={mode.label}
                    type="button"
                    className={cn(
                      "flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-black transition",
                      index === 0
                        ? "border-primary bg-bw-blue-soft text-primary"
                        : "border-bw-border bg-white text-bw-muted hover:text-bw-ink"
                    )}
                  >
                    <Icon className="size-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <form action="/search" className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-bw-muted" />
                <input
                  name="q"
                  defaultValue="Sony WH-1000XM5"
                  className="h-14 w-full rounded-xl border border-bw-border bg-white pl-12 pr-4 text-base font-bold text-bw-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Paste a retailer link or product name"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-bw-ink px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Analyze
                <ArrowRight className="size-4" />
              </button>
            </form>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.82fr]">
              <div className="rounded-xl border border-bw-border bg-bw-surface-raised p-5">
                <p className="text-sm font-black text-bw-muted">Demo product</p>
                <h2 className="mt-2 font-display text-2xl font-black leading-tight text-bw-ink">
                  {demoProduct.name}
                </h2>
                <p className="mt-4 text-sm font-medium leading-6 text-bw-muted">
                  {demoProduct.verdictReason}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {proof.map((item) => (
                    <div key={item.label} data-proof className="rounded-lg border border-bw-border bg-white p-3">
                      <p className="text-xs font-bold text-bw-muted">{item.label}</p>
                      <p className="mt-1 font-display text-2xl font-black text-bw-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-bw-border bg-white p-5">
                <div className="flex items-center gap-2 text-bw-amber">
                  <TrendingDown className="size-5" />
                  <span className="font-black">Price timing: Wait</span>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-bw-muted">
                  Current price is {formatPrice(demoProduct.currentPrice, demoProduct.currency)}.
                  The report suggests watching for a cleaner buy point.
                </p>

                {alternative ? (
                  <div className="mt-5 rounded-xl bg-bw-green-soft p-4">
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-bw-green" />
                      <div>
                        <p className="font-black text-bw-ink">Better alternative found</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-bw-muted">
                          {alternative.name} at{" "}
                          {formatPrice(alternative.price, demoProduct.currency)}.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="border-y border-bw-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-sm font-black text-primary">How it works</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight text-bw-ink md:text-5xl">
              A buying decision flow that stays simple.
            </h2>
          </Reveal>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <Reveal key={step}>
                <div data-lift className="grid gap-4 rounded-xl border border-bw-border bg-bw-paper p-5 sm:grid-cols-[3.5rem_1fr]">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-bw-ink font-display text-lg font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-lg font-bold leading-7 text-bw-ink">{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="verdicts" className="mx-auto max-w-7xl px-5 py-20">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-black text-primary">Verdict language</p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight text-bw-ink md:text-5xl">
            The color system is clear without feeling childish.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {verdictCards.map((card) => {
            const theme = verdictTheme[card.verdict];

            return (
              <motion.article
                key={card.verdict}
                data-lift
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                transition={spring}
                className="rounded-xl border border-bw-border bg-white p-5 shadow-sm"
              >
                <span className={cn("inline-flex rounded-lg px-3 py-1 text-xs font-black", theme.soft)}>
                  {card.verdict}
                </span>
                <h3 className="mt-7 font-display text-xl font-black leading-tight text-bw-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-bw-muted">{card.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="trust" className="border-y border-bw-border bg-bw-green-soft">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-black text-bw-green">Trust rules</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight text-bw-ink md:text-5xl">
              Affiliate disclosure stays close to the buying action.
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-bw-muted">
              BuyWise can earn commission from some links, but ranking remains neutral. The product
              should feel useful before it ever asks for login.
            </p>
          </Reveal>

          <div className="grid gap-3">
            {[
              { icon: ShieldCheck, label: "Commission-neutral recommendations" },
              { icon: CheckCircle2, label: "Basic checks without login" },
              { icon: LockKeyhole, label: "Login only for saved products and alerts" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Reveal key={item.label}>
                  <div className="flex items-center gap-4 rounded-xl border border-bw-border bg-white p-5">
                    <Icon className="size-5 text-bw-green" />
                    <p className="font-bold text-bw-ink">{item.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-10 text-sm font-bold text-bw-muted sm:flex-row sm:items-center sm:justify-between">
        <p>BuyWise AI</p>
        <p>Buy, Wait, Avoid, or Better Alternative.</p>
      </footer>
    </main>
  );
}
