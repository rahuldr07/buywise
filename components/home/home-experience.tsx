"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
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
import { demoProduct, productCatalog } from "@/lib/demo-product";
import { cn, formatPrice } from "@/lib/utils";
import { verdictTheme } from "@/lib/verdict-theme";
import { useLenisScroll } from "@/providers/lenis-provider";
import type { Verdict } from "@/types/product";

gsap.registerPlugin(useGSAP);

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

const offerCards = [
  {
    eyebrow: "buy what you",
    title: "need",
    body: "Daily essentials, tech, appliances, home gear.",
    tone: "bg-bw-green-soft",
  },
  {
    eyebrow: "buy what you",
    title: "love",
    body: "Headphones, cameras, sneakers, beauty, hobbies.",
    tone: "bg-bw-blue-soft",
  },
  {
    eyebrow: "skip what you",
    title: "shouldn't",
    body: "Bad timing, weak trust signals, and noisy hype.",
    tone: "bg-bw-amber-soft",
  },
] as const;

const modeStories = {
  Link: "Reading retailer price, title, availability, and trust signals.",
  Search: "Matching products across stores before ranking the cleanest option.",
  Barcode: "Turning shelf scans into price history and review checks.",
  Image: "Using visual clues to identify the product before scoring it.",
} satisfies Record<(typeof inputModes)[number]["label"], string>;

const liveSignals = [
  { label: "Price pulse", value: "$318-$349 range", tone: "bg-bw-amber-soft", dot: "bg-bw-amber" },
  {
    label: "Review signal",
    value: "stable, 18.4k read",
    tone: "bg-bw-blue-soft",
    dot: "bg-bw-blue",
  },
  {
    label: "Trust check",
    value: "retailer verified",
    tone: "bg-bw-green-soft",
    dot: "bg-bw-green",
  },
] as const;

const steps = [
  {
    icon: Search,
    label: "Paste a product",
    copy: "Use a link, search query, barcode, or product photo.",
  },
  {
    icon: WandSparkles,
    label: "AI reads the buying signals",
    copy: "Price history, review quality, retailer trust, complaints, and alternatives are ranked together.",
  },
  {
    icon: BadgeCheck,
    label: "Get one verdict",
    copy: "Buy, Wait, Avoid, or Better Alternative with the exact reason and next action.",
  },
  {
    icon: BellRing,
    label: "Save only when needed",
    copy: "Basic checks stay open. Login is only for saved products, alerts, watchlists, and receipts.",
  },
] as const;

const verdictCards: Array<{ verdict: Verdict; title: string; body: string }> = [
  {
    verdict: "Buy",
    title: "Green light",
    body: "Value, trust, timing, and product quality line up.",
  },
  {
    verdict: "Wait",
    title: "Better timing ahead",
    body: "The product is fine, but the current price is not.",
  },
  {
    verdict: "Avoid",
    title: "Risk is too visible",
    body: "Review complaints or weak trust signals break the recommendation.",
  },
  {
    verdict: "Better Alternative Available",
    title: "A cleaner pick wins",
    body: "IsItABuy shows the stronger option when evidence supports it.",
  },
];

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
  stiffness: 180,
  damping: 22,
};

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.96, y: 10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.16 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function HomeExperience() {
  const scopeRef = useRef<HTMLElement>(null);
  const heroPanelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const scrollTo = useLenisScroll();
  const shouldReduceMotion = useReducedMotion();
  const [selectedMode, setSelectedMode] = useState<(typeof inputModes)[number]["label"]>("Link");
  const [activeSignal, setActiveSignal] = useState(0);
  const alternative = demoProduct.alternatives[0];
  const verdict = verdictTheme[demoProduct.verdict];

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % liveSignals.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  function onPanelPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !heroPanelRef.current) return;

    const panel = heroPanelRef.current;
    const rect = panel.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    const tiltX = (0.5 - yPercent) * 4;
    const tiltY = (xPercent - 0.5) * 5;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      panel.style.setProperty("--spot-x", `${xPercent * 100}%`);
      panel.style.setProperty("--spot-y", `${yPercent * 100}%`);
      panel.style.setProperty("--tilt-x", `${tiltX}deg`);
      panel.style.setProperty("--tilt-y", `${tiltY}deg`);
    });
  }

  function onPanelPointerLeave() {
    if (!heroPanelRef.current) return;

    heroPanelRef.current.style.setProperty("--spot-x", "50%");
    heroPanelRef.current.style.setProperty("--spot-y", "50%");
    heroPanelRef.current.style.setProperty("--tilt-x", "0deg");
    heroPanelRef.current.style.setProperty("--tilt-y", "0deg");
  }

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      gsap
        .timeline({ defaults: { duration: 0.55, ease: "power3.out" } })
        .from("[data-nav]", { y: -14, autoAlpha: 0 })
        .from("[data-hero-copy]", { y: 24, autoAlpha: 0, stagger: 0.06 }, "-=0.18")
        .from("[data-hero-panel]", { y: 26, autoAlpha: 0 }, "-=0.26")
        .from("[data-soft-card]", { y: 16, autoAlpha: 0, stagger: 0.05 }, "-=0.22");
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <main ref={scopeRef} className="text-bw-ink min-h-screen">
      <header data-nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
        <div className="border-bw-border flex h-16 items-center justify-between rounded-full border bg-white px-3 shadow-[0_10px_34px_rgba(44,37,24,0.08)] md:px-5">
          <Link className="flex items-center gap-3" href="/">
            <span className="bg-bw-ink flex size-11 items-center justify-center rounded-full text-white">
              <Sparkles className="text-bw-mint size-4" />
            </span>
            <span className="font-display text-xl font-black">IsItABuy</span>
          </Link>

          <nav className="border-bw-border bg-bw-fog text-bw-muted hidden items-center gap-1 rounded-full border p-1 text-sm font-black md:flex">
            {[
              ["Checker", "#checker"],
              ["Simple", "#simple"],
              ["Verdicts", "#verdicts"],
              ["Trust", "#trust"],
            ].map(([label, target]) => (
              <button
                key={target}
                className="hover:text-bw-ink rounded-full px-4 py-2 transition hover:bg-white"
                type="button"
                onClick={() => scrollTo(target)}
              >
                {label}
              </button>
            ))}
          </nav>

          <Link
            className="bg-bw-ink inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            href="/product/sony-wh-1000xm5"
          >
            Demo report
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pt-12 pb-12 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:pt-16">
        <div>
          <div
            data-hero-copy
            className="border-bw-border text-bw-muted inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-black shadow-sm"
          >
            <ShieldCheck className="text-bw-green size-4" />
            Product checks stay free to start
          </div>

          <h1
            data-hero-copy
            className="font-display text-bw-ink mt-7 max-w-3xl text-5xl leading-[1.02] font-black md:text-6xl xl:text-7xl"
          >
            Know what to buy from{" "}
            <span className="bg-bw-green-soft text-bw-green rounded-[1rem] px-2">
              one product link.
            </span>
          </h1>

          <p data-hero-copy className="text-bw-muted mt-6 max-w-xl text-lg leading-8 font-medium">
            Paste a link or search a product. IsItABuy gives you a clean verdict, explains the
            buying signals, and points out better alternatives before checkout.
          </p>

          <div data-hero-copy className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="bg-bw-ink inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              type="button"
              onClick={() => scrollTo("#checker")}
            >
              Start checking
              <ArrowRight className="size-4" />
            </button>
            <Link
              className="border-bw-border text-bw-ink inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border bg-white px-6 text-sm font-black shadow-sm transition hover:-translate-y-0.5"
              href="/product/sony-wh-1000xm5"
            >
              View report
              <Star className="text-bw-amber size-4 fill-current" />
            </Link>
          </div>

          <div data-hero-copy className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {proof.map((item) => (
              <div
                key={item.label}
                className="border-bw-border rounded-[1.5rem] border bg-white p-4 shadow-sm"
              >
                <p className="text-bw-muted text-xs font-black">{item.label}</p>
                <p className="font-display text-bw-ink mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={heroPanelRef}
          data-hero-panel
          className="living-panel border-bw-border rounded-[2rem] border bg-white p-4 shadow-[0_20px_70px_rgba(44,37,24,0.1)] md:p-5"
          onPointerLeave={onPanelPointerLeave}
          onPointerMove={onPanelPointerMove}
        >
          <div className="relative overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#fff3cf,#eef6ff_52%,#e8faef)] p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-bw-muted flex items-center gap-2 text-sm font-black">
                  <span className="bw-breathe bg-bw-green size-2 rounded-full" />
                  Live checker
                </p>
                <p className="font-display text-bw-ink text-2xl font-black">
                  Paste. Score. Decide.
                </p>
              </div>
              <span className={cn("rounded-full px-4 py-2 text-xs font-black", verdict.badge)}>
                {demoProduct.verdict}
              </span>
            </div>

            <div id="checker" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {inputModes.map((mode) => {
                const Icon = mode.icon;
                const active = selectedMode === mode.label;

                return (
                  <motion.button
                    key={mode.label}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-black transition",
                      active
                        ? "border-primary/40 text-primary bg-white shadow-sm"
                        : "border-bw-border text-bw-muted hover:text-bw-ink bg-white/70"
                    )}
                    onClick={() => setSelectedMode(mode.label)}
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    transition={spring}
                  >
                    <Icon className="size-4" />
                    {mode.label}
                    {active ? (
                      <span className="bw-breathe bg-primary size-1.5 rounded-full" />
                    ) : null}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-3 rounded-[1.25rem] border border-white/80 bg-white/72 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="bw-breathe bg-bw-green size-2 rounded-full" />
                <p className="text-bw-ink text-sm font-black">{selectedMode} mode is awake</p>
              </div>
              <p className="text-bw-muted mt-1 text-sm leading-6 font-medium">
                {modeStories[selectedMode]}
              </p>
            </div>

            <form action="/search" className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative">
                <Search className="text-bw-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
                <input
                  className="border-bw-border text-bw-ink placeholder:text-bw-muted/70 focus:border-primary focus:ring-primary/10 h-[3.75rem] w-full rounded-full border bg-white pr-4 pl-12 text-base font-bold transition outline-none focus:ring-4"
                  defaultValue="Sony WH-1000XM5"
                  name="q"
                  placeholder="Paste a retailer link or product name"
                />
              </label>
              <button
                className="bg-bw-ink inline-flex h-[3.75rem] items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
                type="submit"
              >
                Analyze
                <Zap className="text-bw-mint size-4" />
              </button>
            </form>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {liveSignals.map((signal, index) => (
                <button
                  key={signal.label}
                  className={cn(
                    "rounded-[1.25rem] border px-4 py-3 text-left transition",
                    activeSignal === index
                      ? `${signal.tone} border-bw-border bw-live-slide`
                      : "border-white/80 bg-white/64"
                  )}
                  type="button"
                  onClick={() => setActiveSignal(index)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        signal.dot,
                        activeSignal === index && "bw-breathe"
                      )}
                    />
                    <p className="text-bw-muted text-xs font-black">{signal.label}</p>
                  </div>
                  <p className="text-bw-ink mt-1 text-sm font-black">{signal.value}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_0.78fr]">
              <div data-soft-card className="border-bw-border rounded-[1.5rem] border bg-white p-5">
                <div className="border-bw-border bg-bw-fog mb-4 h-36 overflow-hidden rounded-[1.2rem] border">
                  <Image
                    alt={demoProduct.name}
                    className="h-full w-full object-cover"
                    height={288}
                    loading="eager"
                    src={demoProduct.imageUrl}
                    width={480}
                  />
                </div>
                <p className="text-bw-muted text-sm font-black">Demo product</p>
                <h2 className="font-display text-bw-ink mt-2 text-2xl leading-tight font-black">
                  {demoProduct.name}
                </h2>
                <p className="text-bw-muted mt-4 text-sm leading-6 font-medium">
                  {demoProduct.verdictReason}
                </p>
                <div className="bg-bw-fog mt-5 rounded-full px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-bw-muted text-sm font-black">Current price</span>
                    <span className="font-display text-bw-ink text-2xl font-black">
                      {formatPrice(demoProduct.currentPrice, demoProduct.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <div
                  data-soft-card
                  className="border-bw-border rounded-[1.5rem] border bg-white p-5"
                >
                  <div className="text-bw-amber flex items-center gap-2">
                    <TrendingDown className="size-5" />
                    <span className="font-black">Wait</span>
                  </div>
                  <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">
                    Better price timing is likely.
                  </p>
                </div>

                {alternative ? (
                  <div
                    data-soft-card
                    className="border-bw-green/20 bg-bw-green-soft rounded-[1.5rem] border p-5"
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
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
        {offerCards.map((card) => (
          <motion.article
            key={card.title}
            className={cn("border-bw-border rounded-[2rem] border p-6", card.tone)}
            transition={spring}
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
          >
            <p className="text-bw-muted text-sm font-black">{card.eyebrow}</p>
            <h2 className="font-display text-bw-ink mt-3 text-5xl font-black">{card.title}</h2>
            <p className="text-bw-muted mt-7 text-base leading-7 font-medium">{card.body}</p>
          </motion.article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <Reveal className="max-w-3xl">
          <p className="text-primary text-sm font-black">Live demo products</p>
          <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
            Test the report on real product categories.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {productCatalog.map((product) => {
            const productVerdict = verdictTheme[product.verdict];

            return (
              <motion.article
                key={product.slug}
                className="border-bw-border overflow-hidden rounded-[2rem] border bg-white shadow-[0_10px_30px_rgba(44,37,24,0.06)]"
                transition={spring}
                whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              >
                <div className="bg-bw-fog h-56">
                  <Image
                    alt={product.name}
                    className="h-full w-full object-cover"
                    height={360}
                    loading="lazy"
                    src={product.imageUrl}
                    width={640}
                  />
                </div>
                <div className="p-5">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-black",
                      productVerdict.soft
                    )}
                  >
                    {product.verdict}
                  </span>
                  <h3 className="font-display text-bw-ink mt-4 text-2xl leading-tight font-black">
                    {product.name}
                  </h3>
                  <div className="text-bw-muted mt-3 flex items-center gap-2 text-sm font-bold">
                    <Star className="text-bw-amber size-4 fill-current" />
                    {product.reviewRating} rating ·{" "}
                    {formatPrice(product.currentPrice, product.currency)}
                  </div>
                  <Link
                    className="bg-bw-ink mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white"
                    href={`/product/${product.slug}`}
                  >
                    Open analytics
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="simple" className="border-bw-border border-y bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="max-w-3xl">
            <p className="text-primary text-sm font-black">IsItABuy is simple</p>
            <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
              From product link to buying decision instantly.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal key={step.label}>
                  <article className="border-bw-border bg-bw-paper h-full rounded-[2rem] border p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-primary text-2xl font-black">
                        0{index + 1}
                      </span>
                      <span className="bg-bw-ink flex size-12 items-center justify-center rounded-full text-white">
                        <Icon className="text-bw-mint size-5" />
                      </span>
                    </div>
                    <h3 className="font-display text-bw-ink mt-8 text-2xl font-black">
                      {step.label}
                    </h3>
                    <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">{step.copy}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="verdicts" className="mx-auto max-w-7xl px-4 py-20">
        <Reveal className="max-w-3xl">
          <p className="text-primary text-sm font-black">Verdict system</p>
          <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
            Four plain decisions. No spreadsheet energy.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {verdictCards.map((card) => {
            const theme = verdictTheme[card.verdict];

            return (
              <motion.article
                key={card.verdict}
                className={cn("rounded-[2rem] border bg-white p-5", theme.tint)}
                transition={spring}
                whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              >
                <span
                  className={cn(
                    "inline-flex rounded-full px-3 py-1 text-xs font-black",
                    theme.soft
                  )}
                >
                  {card.verdict}
                </span>
                <h3 className="font-display text-bw-ink mt-8 text-2xl leading-tight font-black">
                  {card.title}
                </h3>
                <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">{card.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="border-bw-border rounded-[2.25rem] border bg-[linear-gradient(135deg,#fff4d8,#eef6ff_58%,#eafaf1)] p-5 md:p-8">
          <div className="border-bw-border grid gap-8 rounded-[1.75rem] border bg-white p-6 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <p className="text-bw-green text-sm font-black">Trust and disclosure</p>
              <h2 className="font-display text-bw-ink mt-4 text-4xl leading-tight font-black md:text-6xl">
                Premium polish without hiding the buying rules.
              </h2>
              <p className="text-bw-muted mt-5 max-w-2xl text-base leading-8 font-medium">
                IsItABuy can earn commission from some links, but ranking remains neutral. The
                disclosure appears near recommendation and buy actions by design.
              </p>
            </Reveal>

            <div className="grid gap-3">
              {trustRules.map((item) => {
                const Icon = item.icon;

                return (
                  <Reveal key={item.label}>
                    <div className="border-bw-border bg-bw-paper flex items-center gap-4 rounded-full border p-4">
                      <span className="bg-bw-green-soft flex size-11 shrink-0 items-center justify-center rounded-full">
                        <Icon className="text-bw-green size-5" />
                      </span>
                      <p className="text-bw-ink leading-6 font-bold">{item.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="text-bw-muted mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm font-bold sm:flex-row sm:items-center sm:justify-between">
        <p>IsItABuy</p>
        <button className="hover:text-bw-ink text-left" type="button" onClick={() => scrollTo(0)}>
          Back to top
        </button>
      </footer>
    </main>
  );
}
