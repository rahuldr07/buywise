"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
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
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { demoProduct } from "@/lib/demo-product";
import { cn, formatPrice } from "@/lib/utils";
import { verdictTheme } from "@/lib/verdict-theme";
import { useLenisScroll } from "@/providers/lenis-provider";
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
  { label: "Reviews scanned", value: "18.4k" },
] as const;

const verdictCards: Array<{ verdict: Verdict; title: string; body: string }> = [
  {
    verdict: "Buy",
    title: "Green light",
    body: "Value, trust, timing, and product quality are aligned enough to move.",
  },
  {
    verdict: "Wait",
    title: "Better timing ahead",
    body: "The product is solid, but price movement or release timing says pause.",
  },
  {
    verdict: "Avoid",
    title: "Risk is too visible",
    body: "Review complaints, weak value, or trust issues break the recommendation.",
  },
  {
    verdict: "Better Alternative Available",
    title: "A cleaner pick wins",
    body: "BuyWise surfaces a stronger option when the evidence clearly supports it.",
  },
];

const storySteps = [
  {
    icon: Search,
    label: "Bring any product",
    copy: "Paste a retailer link, search by name, scan a barcode, or start from an image.",
  },
  {
    icon: WandSparkles,
    label: "Evidence gets ranked",
    copy: "Price history, review quality, complaint patterns, retailer trust, and alternatives are weighted together.",
  },
  {
    icon: BadgeCheck,
    label: "One clean verdict",
    copy: "The output is Buy, Wait, Avoid, or Better Alternative, with the exact reason attached.",
  },
] as const;

const trustRules = [
  { icon: ShieldCheck, label: "Commission-neutral ranking" },
  { icon: CheckCircle2, label: "Basic checks work without login" },
  {
    icon: LockKeyhole,
    label: "Login only for saved products, alerts, receipts, and personalization",
  },
  { icon: BellRing, label: "Affiliate disclosure stays near buy flows" },
] as const;

const spring = {
  type: "spring" as const,
  stiffness: 150,
  damping: 19,
};

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.22 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function HomeExperience() {
  const scopeRef = useRef<HTMLElement>(null);
  const scrollTo = useLenisScroll();
  const shouldReduceMotion = useReducedMotion();
  const alternative = demoProduct.alternatives[0];
  const verdict = verdictTheme[demoProduct.verdict];

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      gsap.set("[data-progress]", { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({ defaults: { duration: 0.78, ease: "power3.out" } })
        .from("[data-nav]", { y: -18, autoAlpha: 0 })
        .from("[data-hero-copy]", { y: 34, autoAlpha: 0, stagger: 0.08 }, "-=0.28")
        .from("[data-hero-panel]", { y: 44, autoAlpha: 0, rotateX: 5 }, "-=0.48")
        .from("[data-float-card]", { y: 28, autoAlpha: 0, stagger: 0.08 }, "-=0.38");

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-premium-card]").forEach((item, index) => {
        gsap.from(item, {
          y: 34,
          autoAlpha: 0,
          duration: 0.72,
          delay: (index % 3) * 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.to("[data-parallax-orb]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-story]",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <main ref={scopeRef} className="text-bw-ink min-h-screen">
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] h-1 w-full origin-left bg-[linear-gradient(90deg,var(--bw-amber),var(--bw-blue),var(--bw-green))]"
        data-progress
      />

      <header data-nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
        <div className="premium-glass flex h-16 items-center justify-between rounded-3xl border border-white/80 px-3 shadow-[0_18px_60px_rgba(44,37,24,0.1)] md:px-5">
          <Link className="flex items-center gap-3" href="/">
            <span className="bg-bw-ink flex size-11 items-center justify-center rounded-2xl text-white shadow-lg">
              <Sparkles className="text-bw-mint size-4" />
            </span>
            <span className="font-display text-xl font-black">BuyWise</span>
          </Link>

          <nav className="border-bw-border/70 text-bw-muted hidden items-center gap-2 rounded-2xl border bg-white/70 p-1 text-sm font-black md:flex">
            {[
              ["Checker", "#checker"],
              ["Flow", "#flow"],
              ["Verdicts", "#verdicts"],
              ["Trust", "#trust"],
            ].map(([label, target]) => (
              <button
                key={target}
                className="hover:bg-bw-fog hover:text-bw-ink rounded-xl px-4 py-2 transition"
                type="button"
                onClick={() => scrollTo(target)}
              >
                {label}
              </button>
            ))}
          </nav>

          <Link
            className="bg-bw-ink inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(24,32,25,0.18)] transition hover:-translate-y-0.5"
            href="/product/sony-wh-1000xm5"
          >
            Demo report
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-4 pt-10 pb-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:pt-16">
        <div className="relative z-10">
          <div
            data-hero-copy
            className="border-bw-border text-bw-muted inline-flex items-center gap-2 rounded-2xl border bg-white/78 px-4 py-2 text-sm font-black shadow-sm backdrop-blur"
          >
            <ShieldCheck className="text-bw-green size-4" />
            Premium product verdicts, no login for basic checks
          </div>

          <h1
            data-hero-copy
            className="font-display text-bw-ink mt-7 max-w-4xl text-5xl leading-[0.96] font-black md:text-7xl xl:text-8xl"
          >
            Product decisions that feel obvious before checkout.
          </h1>

          <p data-hero-copy className="text-bw-muted mt-6 max-w-2xl text-lg leading-8 font-medium">
            BuyWise turns noisy product pages into a premium verdict: what to buy, what to skip,
            when to wait, and which alternative is actually stronger.
          </p>

          <div data-hero-copy className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--bw-ink),var(--bw-blue)_58%,var(--bw-green))] px-6 text-sm font-black text-white shadow-[0_18px_46px_rgba(40,103,232,0.22)] transition hover:-translate-y-0.5"
              type="button"
              onClick={() => scrollTo("#checker")}
            >
              Check a product
              <ArrowRight className="size-4" />
            </button>
            <Link
              className="border-bw-border text-bw-ink inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-2xl border bg-white/82 px-6 text-sm font-black shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              href="/product/sony-wh-1000xm5"
            >
              View premium report
              <Star className="text-bw-amber size-4 fill-current" />
            </Link>
          </div>

          <div data-hero-copy className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {proof.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-bw-muted text-xs font-black">{item.label}</p>
                <p className="font-display text-bw-ink mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          data-hero-panel
          className="premium-shell premium-noise relative rounded-[2.5rem] border border-white/90 p-3 md:p-5"
        >
          <div className="bg-bw-amber/40 absolute top-12 -left-10 size-24 rounded-full blur-2xl" />
          <div className="bg-bw-green/25 absolute -right-8 bottom-20 size-32 rounded-full blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/80 bg-white/72 p-4 shadow-[0_26px_80px_rgba(44,37,24,0.12)] backdrop-blur-xl md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-bw-muted text-sm font-black">Live checker</p>
                <p className="font-display text-bw-ink text-2xl font-black">Evidence cockpit</p>
              </div>
              <span
                className={cn("rounded-2xl px-4 py-2 text-xs font-black shadow-sm", verdict.badge)}
              >
                {demoProduct.verdict}
              </span>
            </div>

            <div id="checker" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {inputModes.map((mode, index) => {
                const Icon = mode.icon;

                return (
                  <motion.button
                    key={mode.label}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-2xl border text-sm font-black transition",
                      index === 0
                        ? "border-primary/40 bg-bw-blue-soft text-primary shadow-sm"
                        : "border-bw-border text-bw-muted hover:text-bw-ink bg-white/80"
                    )}
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                    transition={spring}
                  >
                    <Icon className="size-4" />
                    {mode.label}
                  </motion.button>
                );
              })}
            </div>

            <form action="/search" className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative">
                <Search className="text-bw-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
                <input
                  className="border-bw-border text-bw-ink placeholder:text-bw-muted/70 focus:border-primary focus:ring-primary/10 h-[3.75rem] w-full rounded-3xl border bg-white/88 pr-4 pl-12 text-base font-bold transition outline-none focus:ring-4"
                  defaultValue="Sony WH-1000XM5"
                  name="q"
                  placeholder="Paste a retailer link or product name"
                />
              </label>
              <button
                className="bg-bw-ink inline-flex h-[3.75rem] items-center justify-center gap-2 rounded-3xl px-6 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
                type="submit"
              >
                Analyze
                <Zap className="text-bw-mint size-4" />
              </button>
            </form>

            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.86fr]">
              <motion.div
                className="border-bw-border relative overflow-hidden rounded-[1.75rem] border bg-white p-5"
                data-float-card
                whileHover={shouldReduceMotion ? undefined : { y: -5, rotate: -0.4 }}
                transition={spring}
              >
                <div className="bg-bw-blue-soft absolute top-5 right-5 size-24 rounded-full" />
                <p className="text-bw-muted relative text-sm font-black">Demo product</p>
                <h2 className="font-display text-bw-ink relative mt-2 text-2xl leading-tight font-black">
                  {demoProduct.name}
                </h2>
                <p className="text-bw-muted relative mt-4 text-sm leading-6 font-medium">
                  {demoProduct.verdictReason}
                </p>
                <div className="bg-bw-fog relative mt-5 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-bw-muted text-sm font-black">Current price</span>
                    <span className="font-display text-bw-ink text-2xl font-black">
                      {formatPrice(demoProduct.currentPrice, demoProduct.currency)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4">
                <motion.div
                  className="border-bw-border rounded-[1.75rem] border bg-white p-5"
                  data-float-card
                  whileHover={shouldReduceMotion ? undefined : { y: -5, rotate: 0.4 }}
                  transition={spring}
                >
                  <div className="text-bw-amber flex items-center gap-2">
                    <TrendingDown className="size-5" />
                    <span className="font-black">Price timing: Wait</span>
                  </div>
                  <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">
                    The report suggests watching for a cleaner buy point instead of rushing the
                    checkout.
                  </p>
                </motion.div>

                {alternative ? (
                  <motion.div
                    className="border-bw-green/20 bg-bw-green-soft rounded-[1.75rem] border p-5"
                    data-float-card
                    whileHover={shouldReduceMotion ? undefined : { y: -5, rotate: -0.4 }}
                    transition={spring}
                  >
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="text-bw-green mt-0.5 size-5 shrink-0" />
                      <div>
                        <p className="text-bw-ink font-black">Alternative found</p>
                        <p className="text-bw-muted mt-1 text-sm leading-6 font-medium">
                          {alternative.name} at{" "}
                          {formatPrice(alternative.price, demoProduct.currency)}.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-story
        id="flow"
        className="relative overflow-hidden border-y border-white/80 bg-white/62 py-20 backdrop-blur"
      >
        <div
          data-parallax-orb
          className="premium-orb absolute top-10 -right-20 size-72 rounded-full opacity-70"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal>
            <p className="text-primary text-sm font-black">How it feels</p>
            <h2 className="font-display text-bw-ink mt-4 max-w-3xl text-4xl leading-tight font-black md:text-6xl">
              A buying flow that moves like a premium product story.
            </h2>
            <p className="text-bw-muted mt-5 max-w-xl text-base leading-8 font-medium">
              Lenis handles smooth travel, GSAP controls page rhythm, and Framer Motion gives every
              decision card a tactile response.
            </p>
          </Reveal>

          <div className="grid gap-4">
            {storySteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.label}
                  className="premium-glass grid gap-4 rounded-[2rem] border border-white/85 p-5 md:grid-cols-[4.5rem_1fr]"
                  data-premium-card
                  whileHover={shouldReduceMotion ? undefined : { x: 8, y: -4 }}
                  transition={spring}
                >
                  <span className="bg-bw-ink font-display flex size-16 items-center justify-center rounded-3xl text-lg font-black text-white">
                    <Icon className="text-bw-mint size-6" />
                  </span>
                  <div>
                    <p className="text-primary text-sm font-black">0{index + 1}</p>
                    <h3 className="font-display text-bw-ink mt-1 text-2xl font-black">
                      {step.label}
                    </h3>
                    <p className="text-bw-muted mt-2 text-base leading-7 font-medium">
                      {step.copy}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="verdicts" className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="max-w-3xl">
          <p className="text-primary text-sm font-black">Verdict system</p>
          <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
            Rounded cards, clear colors, and decisions that never look generic.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {verdictCards.map((card) => {
            const theme = verdictTheme[card.verdict];

            return (
              <motion.article
                key={card.verdict}
                className={cn(
                  "relative overflow-hidden rounded-[2rem] border bg-white p-5 shadow-[0_18px_60px_rgba(44,37,24,0.08)]",
                  theme.tint
                )}
                data-premium-card
                transition={spring}
                whileHover={shouldReduceMotion ? undefined : { y: -8, rotate: -0.8 }}
              >
                <div
                  className={cn(
                    "absolute -top-8 -right-8 size-24 rounded-full opacity-20",
                    theme.dot
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex rounded-2xl px-3 py-1 text-xs font-black",
                    theme.soft
                  )}
                >
                  {card.verdict}
                </span>
                <h3 className="font-display text-bw-ink relative mt-8 text-2xl leading-tight font-black">
                  {card.title}
                </h3>
                <p className="text-bw-muted relative mt-3 text-sm leading-6 font-medium">
                  {card.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="premium-shell premium-noise rounded-[2.5rem] border border-white/85 p-5 md:p-8">
          <div className="grid gap-8 rounded-[2rem] border border-white/80 bg-white/70 p-6 backdrop-blur-xl md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <p className="text-bw-green text-sm font-black">Trust and disclosure</p>
              <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
                Premium polish without hiding the buying rules.
              </h2>
              <p className="text-bw-muted mt-5 max-w-2xl text-base leading-8 font-medium">
                BuyWise can earn commission from some links, but ranking remains neutral. The
                disclosure appears near recommendation and buy actions by design.
              </p>
            </Reveal>

            <div className="grid gap-3">
              {trustRules.map((item) => {
                const Icon = item.icon;

                return (
                  <Reveal key={item.label}>
                    <motion.div
                      className="flex items-center gap-4 rounded-3xl border border-white/85 bg-white/82 p-5 shadow-sm"
                      data-premium-card
                      transition={spring}
                      whileHover={shouldReduceMotion ? undefined : { x: 6 }}
                    >
                      <span className="bg-bw-green-soft flex size-12 shrink-0 items-center justify-center rounded-2xl">
                        <Icon className="text-bw-green size-5" />
                      </span>
                      <p className="text-bw-ink leading-6 font-bold">{item.label}</p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-bw-muted mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm font-bold sm:flex-row sm:items-center sm:justify-between">
        <p>BuyWise AI</p>
        <button className="hover:text-bw-ink text-left" type="button" onClick={() => scrollTo(0)}>
          Back to top
        </button>
      </footer>
    </main>
  );
}
