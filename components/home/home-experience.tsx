"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import type { ProductVerdict, Verdict } from "@/types/product";

gsap.registerPlugin(useGSAP);

const inputModes = [
  { label: "Link", icon: Link2 },
  { label: "Search", icon: Search },
  { label: "Barcode", icon: ScanBarcode },
  { label: "Image", icon: Camera },
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

const heroFanStyles = [
  "left-[3%] top-16 -rotate-8",
  "left-1/2 top-0 z-20 -translate-x-1/2 scale-110",
  "right-[3%] top-16 rotate-8",
] as const;

type LenisScrollPayload = {
  direction: -1 | 0 | 1;
  scroll: number;
};

type LenisScrollEmitter = {
  off?: (event: "scroll", callback: (payload: LenisScrollPayload) => void) => void;
  on?: (event: "scroll", callback: (payload: LenisScrollPayload) => void) => void;
};

type HomeWindow = Window &
  typeof globalThis & {
    __buywiseLenis?: LenisScrollEmitter;
  };

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

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function fuzzyScore(query: string, product: ProductVerdict) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return product.slug === demoProduct.slug ? 1 : 0;

  const haystack = normalizeSearch(
    `${product.name} ${product.brand} ${product.category} ${product.slug}`
  );
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  let score = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) score += token.length * 6;
    if (product.slug.includes(token)) score += token.length * 4;
    if (isSubsequence(token, haystack)) score += token.length;
  }

  return score;
}

function isSubsequence(needle: string, haystack: string) {
  let cursor = 0;

  for (const char of haystack) {
    if (char === needle[cursor]) cursor += 1;
    if (cursor === needle.length) return true;
  }

  return false;
}

function findBestProduct(query: string) {
  return productCatalog.reduce((best, product) => {
    return fuzzyScore(query, product) > fuzzyScore(query, best) ? product : best;
  }, demoProduct);
}

function compactReviewCount(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

function getProof(product: ProductVerdict) {
  return [
    { label: "AI Buy Score", value: product.aiBuyScore },
    { label: "Confidence", value: `${product.confidenceScore}%` },
    { label: "Reviews scanned", value: compactReviewCount(product.reviewCount) },
  ] as const;
}

function getHeroInsights(product: ProductVerdict) {
  const prices = product.priceHistory.map((point) => point.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const firstAlternative = product.alternatives[0];

  return [
    {
      label: "Top review source",
      value: product.reviewInsights
        .slice(0, 2)
        .map((review) => review.source)
        .join(" + "),
      tone: "bg-bw-blue-soft",
    },
    {
      label: "Price window",
      value: `${formatPrice(low, product.currency)} low / ${formatPrice(high, product.currency)} high`,
      tone: "bg-bw-amber-soft",
    },
    {
      label: "Next action",
      value: firstAlternative ? `Compare ${firstAlternative.name.split(" ").slice(0, 2).join(" ")}` : "Open report",
      tone: "bg-bw-green-soft",
    },
  ] as const;
}

function getLiveSignals(product: ProductVerdict) {
  const prices = product.priceHistory.map((point) => point.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  return [
    {
      label: "Price pulse",
      value: `${formatPrice(low, product.currency)}-${formatPrice(high, product.currency)} range`,
      tone: "bg-bw-amber-soft",
      dot: "bg-bw-amber",
    },
    {
      label: "Review signal",
      value: `${product.reviewRating} rating, ${compactReviewCount(product.reviewCount)} read`,
      tone: "bg-bw-blue-soft",
      dot: "bg-bw-blue",
    },
    {
      label: "Trust check",
      value: `${product.retailer} verified`,
      tone: "bg-bw-green-soft",
      dot: "bg-bw-green",
    },
  ] as const;
}

export function HomeExperience() {
  const scopeRef = useRef<HTMLElement>(null);
  const navShellRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const navHiddenRef = useRef(false);
  const router = useRouter();
  const scrollTo = useLenisScroll();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState(demoProduct.name);
  const [selectedMode, setSelectedMode] = useState<(typeof inputModes)[number]["label"]>("Link");
  const [activeSignal, setActiveSignal] = useState(0);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const matchedProduct = findBestProduct(deferredSearchQuery);
  const proof = getProof(matchedProduct);
  const heroInsights = getHeroInsights(matchedProduct);
  const liveSignals = getLiveSignals(matchedProduct);
  const signalCount = liveSignals.length;
  const alternative = matchedProduct.alternatives[0];
  const verdict = verdictTheme[matchedProduct.verdict];

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % signalCount);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion, signalCount]);

  useEffect(() => {
    const navShell = navShellRef.current;
    if (!navShell) return;
    const hideDuration = shouldReduceMotion ? 0 : 0.24;
    const showDuration = shouldReduceMotion ? 0 : 0.82;

    const showHeader = () => {
      if (!navHiddenRef.current) return;
      navHiddenRef.current = false;
      navShell.style.pointerEvents = "auto";
      gsap.to(navShell, {
        autoAlpha: 1,
        duration: showDuration,
        ease: "expo.out",
        overwrite: "auto",
        y: 0,
      });
    };

    const hideHeader = () => {
      if (navHiddenRef.current) return;
      navHiddenRef.current = true;
      navShell.style.pointerEvents = "none";
      gsap.to(navShell, {
        autoAlpha: 0,
        duration: hideDuration,
        ease: "power3.out",
        overwrite: "auto",
        y: -112,
      });
    };

    const onLenisScroll = ({ direction, scroll }: LenisScrollPayload) => {
      if (direction === 1 && scroll > 120) hideHeader();
      if (direction === -1 || scroll < 80) showHeader();
      lastScrollYRef.current = Math.max(scroll, 0);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const previousY = lastScrollYRef.current;

      if (currentY > previousY + 8 && currentY > 120) hideHeader();
      if (currentY < previousY - 4 || currentY < 80) showHeader();

      lastScrollYRef.current = Math.max(currentY, 0);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 8 && window.scrollY > 80) hideHeader();
      if (event.deltaY < -4) showHeader();
    };

    const lenis = (window as HomeWindow).__buywiseLenis;
    lenis?.on?.("scroll", onLenisScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      lenis?.off?.("scroll", onLenisScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      gsap.killTweensOf(navShell);
    };
  }, [shouldReduceMotion]);

  function onHeroSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/product/${matchedProduct.slug}`);
  }

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      gsap
        .timeline({ defaults: { duration: 0.55, ease: "power3.out" } })
        .from("[data-nav-shell]", { y: -14, autoAlpha: 0 })
        .from("[data-hero-copy]", { y: 24, autoAlpha: 0, stagger: 0.06 }, "-=0.18")
        .from("[data-product-stage]", { y: 26, autoAlpha: 0 }, "-=0.26")
        .from("[data-soft-card]", { y: 16, autoAlpha: 0, stagger: 0.05 }, "-=0.22");
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <main ref={scopeRef} className="text-bw-ink min-h-screen">
      <header
        data-nav
        className="fixed top-7 left-1/2 z-50 w-[min(calc(100%-2rem),62rem)] -translate-x-1/2"
      >
        <motion.div
          ref={navShellRef}
          data-nav-shell
          className="border-bw-border flex h-[4.75rem] items-center justify-between rounded-full border bg-white/94 px-3 shadow-[0_18px_50px_rgba(44,37,24,0.12)] backdrop-blur-xl will-change-transform md:px-5"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link className="flex items-center gap-3" href="/">
            <span className="bg-bw-amber flex size-10 items-center justify-center rounded-full text-bw-ink">
              <Sparkles className="size-4 fill-current" />
            </span>
            <span className="font-display text-xl font-black tracking-[-0.04em]">IsItABuy</span>
          </Link>

          <nav className="text-bw-ink hidden items-center gap-7 text-sm font-black md:flex">
            {[
              ["How it works", "#simple"],
              ["Products", "#products"],
              ["Pricing", "#pricing"],
            ].map(([label, target]) => (
              <button
                key={target}
                className="transition hover:text-bw-green"
                type="button"
                onClick={() => scrollTo(target)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="bg-bw-fog text-bw-ink hidden h-12 items-center rounded-full px-6 text-sm font-black transition hover:bg-bw-border sm:inline-flex"
              href="/watchlist"
            >
              Login
            </Link>
            <button
              className="bg-bw-amber text-bw-ink inline-flex h-12 items-center gap-3 rounded-full px-6 text-sm font-black shadow-[0_12px_28px_rgba(244,169,27,0.24)] transition hover:-translate-y-0.5 hover:bg-bw-amber/90"
              type="button"
              onClick={() => scrollTo("#checker")}
            >
              Get started
              <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </header>

      <section className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col items-center overflow-x-clip px-4 pt-36 pb-10 text-center md:pt-44 md:pb-12">
        <div
          data-hero-copy
          className="border-bw-border text-bw-muted inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-black shadow-sm backdrop-blur"
        >
          <ShieldCheck className="text-bw-green size-4" />
          Product checks stay free to start
        </div>

        <h1
          data-hero-copy
          className="font-display text-bw-ink mt-8 max-w-6xl text-5xl leading-[0.98] font-black tracking-[-0.06em] md:text-7xl xl:text-[5.8rem]"
        >
          Know what to buy from{" "}
          <span className="font-serif font-normal tracking-[-0.08em] italic">
            one product link.
          </span>
        </h1>

        <p
          data-hero-copy
          className="text-bw-muted mt-7 max-w-3xl text-base leading-8 font-medium md:text-lg"
        >
          IsItABuy reads price history, review quality, retailer trust, and alternatives before
          checkout. Search naturally, paste a link, or start with a product photo.
        </p>

        <form
          data-hero-copy
          className="border-bw-amber/50 mt-9 grid w-full max-w-[46rem] grid-cols-[1fr_auto] items-center rounded-full border bg-white p-2 shadow-[0_18px_45px_rgba(44,37,24,0.1)]"
          onSubmit={onHeroSearch}
        >
          <label className="relative min-w-0">
            <Camera className="text-bw-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              className="text-bw-ink placeholder:text-bw-muted/70 h-12 w-full rounded-full bg-transparent pr-3 pl-12 text-sm font-bold outline-none md:text-base"
              name="q"
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setSelectedMode("Search")}
              placeholder="Paste a product link or search iPhone, headphones, shoes..."
              value={searchQuery}
            />
          </label>
          <button
            className="bg-bw-amber text-bw-ink inline-flex h-12 items-center justify-center gap-3 rounded-full px-5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-bw-amber/90 md:px-7"
            type="submit"
          >
            Check for free
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p data-hero-copy className="text-bw-muted mt-7 text-sm font-medium">
          Trusted for <span className="font-black">{compactReviewCount(matchedProduct.reviewCount)}</span>{" "}
          review signals, commission-neutral verdicts, and no-login basic checks.
        </p>

        <div
          data-hero-fan
          data-hero-copy
          className="relative mt-9 h-[26rem] w-full max-w-6xl overflow-visible md:h-[28rem]"
        >
          {productCatalog.slice(0, 3).map((product, index) => {
            const theme = verdictTheme[product.verdict];

            return (
              <motion.article
                key={product.slug}
                className={cn(
                  "border-bw-border absolute w-[17rem] overflow-hidden rounded-[2rem] border bg-white p-3 text-left shadow-[0_30px_80px_rgba(44,37,24,0.16)] md:w-[21rem]",
                  heroFanStyles[index]
                )}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { y: index === 1 ? [0, -8, 0] : [0, 6, 0] }
                }
                transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative h-48 overflow-hidden rounded-[1.45rem] bg-bw-fog md:h-60">
                  <Image
                    alt={product.name}
                    className="h-full w-full object-cover"
                    height={420}
                    priority={index === 1}
                    src={product.imageUrl}
                    width={520}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent p-4 text-white">
                    <p className="text-[0.65rem] font-black tracking-[0.18em] uppercase opacity-80">
                      Product check
                    </p>
                    <h2 className="font-display mt-1 line-clamp-2 text-xl leading-tight font-black">
                      {product.name}
                    </h2>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-black", theme.soft)}>
                    {product.verdict}
                  </span>
                  <span className="font-display text-bw-ink text-2xl font-black">
                    {product.aiBuyScore}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="checker" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_18px_50px_rgba(44,37,24,0.08)] md:p-7">
            <p className="text-primary text-sm font-black">Get started</p>
            <h2 className="font-display text-bw-ink mt-3 text-4xl leading-tight font-black md:text-5xl">
              Search once. Get the cleanest buying decision.
            </h2>
            <p className="text-bw-muted mt-4 text-base leading-7 font-medium">
              The hero search supports fuzzy matching. Typing “iphone”, “sony”, or “nike” switches
              the demo report instantly before opening the full product page.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {inputModes.map((mode) => {
                const Icon = mode.icon;
                const active = selectedMode === mode.label;

                return (
                  <motion.button
                    key={mode.label}
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-black transition",
                      active
                        ? "border-primary/40 text-primary bg-bw-blue-soft shadow-sm"
                        : "border-bw-border text-bw-muted hover:text-bw-ink bg-white"
                    )}
                    onClick={() => setSelectedMode(mode.label)}
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                    transition={spring}
                  >
                    <Icon className="size-4" />
                    {mode.label}
                  </motion.button>
                );
              })}
            </div>

            <form className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={onHeroSearch}>
              <label className="relative">
                <Search className="text-bw-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
                <input
                  className="border-bw-border text-bw-ink placeholder:text-bw-muted/70 focus:border-primary focus:ring-primary/10 h-[3.75rem] w-full rounded-full border bg-white pr-4 pl-12 text-base font-bold transition outline-none focus:ring-4"
                  name="checker-search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setSelectedMode("Search")}
                  placeholder="Try iPhone, Sony headphones, Nike shoes"
                  value={searchQuery}
                />
              </label>
              <button
                className="bg-primary inline-flex h-[3.75rem] items-center justify-center gap-2 rounded-full px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(40,103,232,0.22)] transition hover:-translate-y-0.5 hover:bg-primary/90"
                type="submit"
              >
                Analyze
                <Zap className="size-4 text-white" />
              </button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {proof.map((item) => (
                <div key={item.label} className="border-bw-border rounded-[1.35rem] border bg-bw-paper p-4">
                  <p className="text-bw-muted text-xs font-black">{item.label}</p>
                  <p className="font-display text-bw-ink mt-1 text-2xl font-black">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              {heroInsights.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "border-bw-border flex items-center justify-between gap-4 rounded-full border px-4 py-3 shadow-sm",
                    item.tone
                  )}
                >
                  <span className="text-bw-muted text-xs font-black">{item.label}</span>
                  <span className="text-bw-ink text-sm font-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            data-product-stage
            className="border-bw-border overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,#f8fbff,#ecfff4)] p-4 shadow-[0_18px_50px_rgba(44,37,24,0.08)]"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
              <Link
                data-soft-card
                className="border-bw-border group relative block h-full overflow-hidden rounded-[1.5rem] border bg-white p-3"
                href={`/product/${matchedProduct.slug}`}
              >
                <div className="relative h-full min-h-[23rem] overflow-hidden rounded-[1.15rem] bg-bw-fog md:min-h-[24rem]">
                  <Image
                    alt={matchedProduct.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    height={580}
                    loading="eager"
                    src={matchedProduct.imageUrl}
                    width={760}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent p-5 text-white">
                    <p className="text-xs font-black tracking-[0.18em] uppercase opacity-80">
                      Matched product
                    </p>
                    <h2 className="font-display mt-2 max-w-md text-3xl leading-tight font-black">
                      {matchedProduct.name}
                    </h2>
                  </div>
                </div>
              </Link>

              <div className="grid gap-4">
                <div data-soft-card className="border-bw-border rounded-[1.5rem] border bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-bw-muted text-xs font-black">AI score</p>
                      <p className="font-display text-bw-ink mt-1 text-5xl font-black">
                        {matchedProduct.aiBuyScore}
                      </p>
                    </div>
                    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black", verdict.soft)}>
                      {matchedProduct.verdict}
                    </span>
                  </div>
                  <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">
                    {matchedProduct.verdictReason}
                  </p>
                </div>

                <div
                  data-soft-card
                  className={cn(
                    "overflow-hidden rounded-[1.5rem] border p-3",
                    alternative
                      ? "border-bw-green/20 bg-bw-green-soft"
                      : "border-bw-border bg-white"
                  )}
                >
                  <div className="flex items-stretch gap-3">
                    <div className="border-bw-border relative h-28 w-28 shrink-0 overflow-hidden rounded-[1rem] border bg-white">
                      <Image
                        alt={alternative?.name ?? matchedProduct.name}
                        className="h-full w-full object-cover"
                        height={240}
                        src={alternative?.imageUrl ?? matchedProduct.imageUrl}
                        width={240}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="text-bw-green size-5 shrink-0" />
                        <p className="text-bw-ink font-black">
                          {alternative ? "Alternative found" : "No better alternative"}
                        </p>
                      </div>
                      <p className="text-bw-muted mt-1 text-sm leading-5 font-medium">
                        {alternative
                          ? `${alternative.name} at ${formatPrice(alternative.price, matchedProduct.currency)}.`
                          : "Current product is the best demo match for this search."}
                      </p>
                      {alternative ? (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-full bg-white/75 px-3 py-1.5">
                          <span className="text-bw-muted text-xs font-black">Alt score</span>
                          <span className="font-display text-bw-green text-lg font-black">
                            {alternative.aiBuyScore}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div data-soft-card className="border-bw-border rounded-[1.5rem] border bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="text-bw-amber size-5" />
                      <p className="text-bw-ink font-black">Signal breakdown</p>
                    </div>
                    <span className="text-bw-muted text-xs font-black">
                      {matchedProduct.confidenceScore}% confidence
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {matchedProduct.scores.slice(0, 3).map((score) => (
                      <div key={score.id} className="rounded-[1rem] bg-bw-paper p-2.5">
                        <p className="text-bw-muted text-xs font-black">
                          {shortHeroScore(score.label)}
                        </p>
                        <p className="font-display text-bw-ink mt-1 text-xl font-black">
                          {score.score}
                        </p>
                        <div className="bg-bw-border mt-2 h-1 overflow-hidden rounded-full">
                          <div
                            className="bg-bw-green h-full rounded-full"
                            style={{ width: `${score.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-soft-card className="border-bw-border bg-bw-blue-soft rounded-[1.5rem] border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-primary text-xs font-black">Review read</p>
                      <p className="text-bw-ink mt-1 text-sm leading-5 font-black">
                        {matchedProduct.reviewInsights[0]?.source ?? matchedProduct.retailer} says{" "}
                        {matchedProduct.reviewInsights[0]?.sentiment.toLowerCase() ?? "positive"}.
                      </p>
                    </div>
                    <span className="font-display text-primary text-2xl font-black">
                      {matchedProduct.reviewRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {liveSignals.map((signal, index) => (
                <button
                  key={signal.label}
                  className={cn(
                    "rounded-[1.25rem] border px-4 py-3 text-left transition",
                    activeSignal === index
                      ? `${signal.tone} border-bw-border bw-live-slide`
                      : "border-white/80 bg-white/70"
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
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {offerCards.map((card) => (
          <motion.article
            key={card.title}
            className={cn("border-bw-border rounded-[2rem] border p-6", card.tone)}
            transition={spring}
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
          >
            <p className="text-bw-muted text-sm font-black">{card.eyebrow}</p>
            <h2 className="font-display text-bw-ink mt-3 text-5xl font-black">{card.title}</h2>
            <p className="text-bw-muted mt-5 text-base leading-7 font-medium">{card.body}</p>
            <div className="border-bw-border mt-6 border-t pt-4">
              <p className="text-bw-ink text-sm font-black">
                Ranked by price, trust, reviews, and timing.
              </p>
            </div>
          </motion.article>
        ))}
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-10">
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
                    className="bg-primary mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-[0_10px_24px_rgba(40,103,232,0.18)] transition hover:-translate-y-0.5 hover:bg-primary/90"
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

      <section id="simple" className="border-bw-border border-y bg-white py-14">
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

      <section id="verdicts" className="mx-auto max-w-7xl px-4 py-14">
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

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14">
        <div className="border-bw-border rounded-[2.25rem] border bg-white p-5 shadow-[0_18px_50px_rgba(44,37,24,0.06)] md:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-primary text-sm font-black">Pricing</p>
              <h2 className="font-display text-bw-ink mt-3 text-4xl leading-tight font-black md:text-5xl">
                Free checks first. Login only when saving value.
              </h2>
            </div>
            <p className="text-bw-muted text-base leading-7 font-medium">
              Basic verdicts stay open so shoppers can check products before checkout. Accounts are
              only needed for watchlists, alerts, receipts, and personalization.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Free checks", "Paste links, search products, and open basic verdicts without login."],
              ["Saved alerts", "Login only when you want watchlists, receipts, price drops, and saved products."],
              ["Neutral ranking", "Affiliate disclosure stays visible, and commission never changes the recommendation."],
            ].map(([title, body]) => (
              <article key={title} className="bg-bw-paper rounded-[1.75rem] p-5">
                <p className="font-display text-bw-ink text-2xl font-black">{title}</p>
                <p className="text-bw-muted mt-4 text-sm leading-6 font-medium">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-7xl px-4 pb-16">
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

function shortHeroScore(label: string) {
  return label.replace("Review Trust Score", "Trust").replace(" Score", "");
}
