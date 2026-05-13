"use client";

import { useDeferredValue, useRef, useState } from "react";
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
  LockKeyhole,
  Search,
  ShieldCheck,
  Star,
  WandSparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { popularCategories } from "@/lib/buywise-demo-data";
import { demoProduct, productCatalog } from "@/lib/demo-product";
import { cn, formatPrice } from "@/lib/utils";
import { verdictTheme } from "@/lib/verdict-theme";
import { useLenisScroll } from "@/providers/lenis-provider";
import { WebAppHeader } from "@/components/shared/web-app-header";
import type { ProductVerdict, Verdict } from "@/types/product";

gsap.registerPlugin(useGSAP);

const offerCards = [
  {
    eyebrow: "buy what you",
    title: "need",
    body: "Daily essentials, tech, appliances, home gear.",
    tone: "bg-white",
  },
  {
    eyebrow: "buy what you",
    title: "love",
    body: "Headphones, cameras, sneakers, beauty, hobbies.",
    tone: "bg-white",
  },
  {
    eyebrow: "skip what you",
    title: "shouldn't",
    body: "Bad timing, weak trust signals, and noisy hype.",
    tone: "bg-white",
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

const heroStackPositions = [
  "md:absolute md:left-[4%] md:top-[2.5rem] md:z-10 md:w-[16rem] lg:w-[18.5rem] xl:w-[20rem]",
  "md:absolute md:left-1/2 md:top-0 md:z-20 md:w-[19rem] md:-translate-x-1/2 lg:w-[21rem] xl:w-[23rem]",
  "md:absolute md:right-[4%] md:top-[2.5rem] md:z-10 md:w-[16rem] lg:w-[18.5rem] xl:w-[20rem]",
] as const;

const heroStackBaseRotation = [-7, 0, 7] as const;

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

export function HomeExperience() {
  const scopeRef = useRef<HTMLElement>(null);
  const heroStackRef = useRef<HTMLDivElement>(null);
  const heroCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const router = useRouter();
  const scrollTo = useLenisScroll();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState(demoProduct.name);
  const [hoveredHeroIndex, setHoveredHeroIndex] = useState<number | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const matchedProduct = findBestProduct(deferredSearchQuery);

  function onHeroSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/product/${matchedProduct.slug}`);
  }

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      const showcaseStage = heroStackRef.current;
      const showcaseCards = heroCardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null
      );

      showcaseCards.forEach((card, index) => {
        gsap.set(card, {
          rotate: heroStackBaseRotation[index as 0 | 1 | 2],
          transformOrigin: "50% 58%",
        });
      });

      gsap
        .timeline({ defaults: { duration: 0.55, ease: "power3.out" } })
        .from("[data-web-header-shell]", { y: -14, autoAlpha: 0 })
        .from("[data-hero-copy]", { y: 24, autoAlpha: 0, stagger: 0.06 }, "-=0.18")
        .from("[data-hero-stack]", { y: 28, autoAlpha: 0, scale: 0.985 }, "-=0.2")
        .from(
          showcaseCards,
          {
            y: (index) => (index === 1 ? 38 : 54),
            autoAlpha: 0,
            rotate: (index) => heroStackBaseRotation[index as 0 | 1 | 2],
            stagger: 0.08,
            duration: 0.78,
            ease: "power4.out",
          },
          "-=0.26"
        );

      gsap.to("[data-hero-stack-glow]", {
        opacity: 0.92,
        scale: 1.05,
        duration: 4.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      if (!showcaseStage || showcaseCards.length === 0) return;

      const xSetters = showcaseCards.map((card) =>
        gsap.quickTo(card, "x", { duration: 0.65, ease: "power3.out" })
      );
      const ySetters = showcaseCards.map((card) =>
        gsap.quickTo(card, "y", { duration: 0.65, ease: "power3.out" })
      );
      const rotateSetters = showcaseCards.map((card) =>
        gsap.quickTo(card, "rotate", { duration: 0.65, ease: "power3.out" })
      );
      const scaleSetters = showcaseCards.map((card) =>
        gsap.quickTo(card, "scale", { duration: 0.45, ease: "power3.out" })
      );

      const setShowcaseDepth = (activeIndex: number | null) => {
        showcaseCards.forEach((card, index) => {
          card.parentElement?.style.setProperty(
            "z-index",
            String(activeIndex === index ? 45 : index === 1 ? 20 : 10)
          );
        });
      };

      const onPointerMove = (event: PointerEvent) => {
        const bounds = showcaseStage.getBoundingClientRect();
        const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
        const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
        let activeIndex: number | null = null;

        showcaseCards.forEach((card, index) => {
          const depth = index === 1 ? 0.65 : 1;
          const cardBounds = card.getBoundingClientRect();
          const isPointerOnCard =
            event.clientX >= cardBounds.left - 12 &&
            event.clientX <= cardBounds.right + 12 &&
            event.clientY >= cardBounds.top - 12 &&
            event.clientY <= cardBounds.bottom + 12;

          if (isPointerOnCard) activeIndex = index;

          xSetters[index](offsetX * 26 * depth);
          ySetters[index](offsetY * 12 * depth + (isPointerOnCard ? -12 : 0));
          rotateSetters[index](heroStackBaseRotation[index as 0 | 1 | 2] + offsetX * 5 * depth);
          scaleSetters[index](isPointerOnCard ? (index === 1 ? 1.045 : 1.075) : 1);
        });

        setShowcaseDepth(activeIndex);
      };

      const onPointerLeave = () => {
        showcaseCards.forEach((_, index) => {
          xSetters[index](0);
          ySetters[index](0);
          rotateSetters[index](heroStackBaseRotation[index as 0 | 1 | 2]);
          scaleSetters[index](1);
        });
        setShowcaseDepth(null);
      };

      showcaseStage.addEventListener("pointermove", onPointerMove);
      showcaseStage.addEventListener("pointerleave", onPointerLeave);

      return () => {
        showcaseStage.removeEventListener("pointermove", onPointerMove);
        showcaseStage.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <main ref={scopeRef} className="text-bw-ink min-h-screen">
      <WebAppHeader ctaHref="/search" ctaLabel="Check product" variant="fixed" />

      <section className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col items-center overflow-x-clip px-4 pt-28 pb-8 text-center md:pt-30 md:pb-10">
        <div
          data-hero-copy
          className="border-bw-border text-bw-muted inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-black shadow-sm backdrop-blur"
        >
          <ShieldCheck className="text-bw-green size-4" />
          Product checks stay free to start
        </div>

        <h1
          data-hero-copy
          className="font-display text-bw-ink mt-5 max-w-6xl text-5xl leading-[0.98] font-black tracking-[-0.06em] md:text-[4.2rem] xl:text-[4.35rem]"
        >
          Know what to buy from{" "}
          <span className="font-serif font-normal tracking-[-0.08em] italic">
            one product link.
          </span>
        </h1>

        <p
          data-hero-copy
          className="text-bw-muted mt-4 max-w-3xl text-base leading-7 font-medium md:text-lg"
        >
          IsItABuy reads price history, review quality, retailer trust, and alternatives before
          checkout. Search naturally, paste a link, or start with a product photo.
        </p>

        <form
          data-hero-copy
          className="border-bw-border mt-5 grid w-full max-w-[46rem] grid-cols-[1fr_auto] items-center rounded-full border bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
          onSubmit={onHeroSearch}
        >
          <label className="relative min-w-0">
            <Camera className="text-bw-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <input
              className="text-bw-ink placeholder:text-bw-muted/70 h-12 w-full rounded-full bg-transparent pr-3 pl-12 text-sm font-bold outline-none md:text-base"
              name="q"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Paste a product link or search iPhone, headphones, shoes..."
              value={searchQuery}
            />
          </label>
          <button
            className="bg-primary inline-flex h-12 items-center justify-center gap-3 rounded-full px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-primary/90 md:px-7"
            type="submit"
          >
            Check for free
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div
          ref={heroStackRef}
          data-hero-stack
          className="relative mt-3 w-full max-w-[74rem] px-3 pb-4 md:h-[28rem] md:px-8"
        >
          <div
            data-hero-stack-glow
            className="pointer-events-none absolute inset-x-[12%] top-14 h-48 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.1),transparent_68%)] blur-3xl"
          />
          <div className="pointer-events-none absolute inset-x-[8%] top-8 h-px bg-gradient-to-r from-transparent via-bw-border/80 to-transparent" />

          {productCatalog.slice(0, 3).map((product, index) => {
            const theme = verdictTheme[product.verdict];

            return (
              <div
                key={product.slug}
                className={cn(
                  "relative mx-auto w-full max-w-sm",
                  heroStackPositions[index]
                )}
                style={{ zIndex: hoveredHeroIndex === index ? 40 : index === 1 ? 20 : 10 }}
              >
                <div
                  ref={(node) => {
                    heroCardRefs.current[index] = node;
                  }}
                  data-hero-showcase-card
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    className="group relative will-change-transform"
                    onMouseEnter={() => setHoveredHeroIndex(index)}
                    onMouseLeave={() => setHoveredHeroIndex(null)}
                    onMouseMove={() => setHoveredHeroIndex(index)}
                    onHoverEnd={() => setHoveredHeroIndex(null)}
                    onHoverStart={() => setHoveredHeroIndex(index)}
                    style={{ transformStyle: "preserve-3d" }}
                    transition={spring}
                  >
                    <Link
                      className="block"
                      href={`/product/${product.slug}`}
                      onBlur={() => setHoveredHeroIndex(null)}
                      onFocus={() => setHoveredHeroIndex(index)}
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-[2.35rem] bg-black transition-[box-shadow] duration-300",
                          hoveredHeroIndex === index
                            ? "shadow-[0_48px_120px_rgba(44,37,24,0.34)] ring-2 ring-bw-blue/35"
                            : "shadow-[0_28px_70px_rgba(44,37,24,0.2)] ring-1 ring-white/65"
                        )}
                      >
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/16 to-transparent" />
                        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-5">
                          <span className="rounded-full bg-white/[0.88] px-3 py-1 text-[0.65rem] font-black tracking-[0.2em] uppercase text-bw-ink backdrop-blur">
                            Product check
                          </span>
                          <span className="rounded-full bg-black/[0.18] px-3 py-1 text-[0.65rem] font-black tracking-[0.18em] uppercase text-white backdrop-blur">
                            {product.category}
                          </span>
                        </div>

                        <motion.div
                          className="relative h-[20rem] overflow-hidden md:h-[24rem]"
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.075 }}
                        >
                          <Image
                            alt={product.name}
                            className="h-full w-full object-cover"
                            height={620}
                            priority={index === 1}
                            src={product.imageUrl}
                            width={520}
                          />
                        </motion.div>

                        <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white">
                          <div className="flex items-end justify-between gap-4">
                            <div className="min-w-0">
                              <h2 className="font-display line-clamp-3 max-w-[14ch] text-[1.75rem] leading-[0.95] font-black tracking-[-0.055em] md:text-[2rem]">
                                {product.name}
                              </h2>
                              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black">
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-3 py-1.5 shadow-sm",
                                    theme.soft
                                  )}
                                >
                                  {shortHeroVerdict(product.verdict)}
                                </span>
                                <span className="rounded-full border border-white/[0.14] bg-white/10 px-3 py-1.5 text-white/[0.92] backdrop-blur">
                                  {formatPrice(product.currentPrice, product.currency)}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-[0.65rem] font-black tracking-[0.2em] uppercase text-white/70">
                                Score
                              </p>
                              <p className="font-display text-5xl leading-none font-black">
                                {product.aiBuyScore}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <p className="text-primary text-sm font-black">Core promise</p>
          <h2 className="font-display mt-3 text-3xl font-black text-bw-ink md:text-4xl">
            One clear verdict before checkout.
          </h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {verdictCards.map((card) => {
              const theme = verdictTheme[card.verdict];

              return (
                <div key={card.verdict} className="border-bw-border rounded-[1.25rem] border bg-white p-3">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-black", theme.badge)}>
                    {card.verdict === "Better Alternative Available" ? "Alternative" : card.verdict}
                  </span>
                  <p className="mt-3 text-sm leading-5 font-bold text-bw-muted">{card.body}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
          <p className="text-primary text-sm font-black">Chrome extension</p>
          <h2 className="font-display mt-3 text-3xl font-black text-bw-ink">
            Check products from the retailer page.
          </h2>
          <p className="mt-4 text-sm leading-6 font-medium text-bw-muted">
            Extension install is staged for Phase 1. The CTA shows where checkout-adjacent buying
            guidance will live.
          </p>
          <Link
            className="mt-5 inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(40,103,232,0.2)] transition hover:-translate-y-0.5"
            href="/account"
          >
            Join extension waitlist
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </article>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
          <p className="text-bw-green text-sm font-black">Commission-neutral trust</p>
          <p className="mt-3 text-base leading-7 font-medium text-bw-muted">
            BuyWise may earn from some affiliate links, but scores and rankings are based on price,
            trust, review quality, and alternatives, not commission.
          </p>
        </article>
        <div className="grid gap-3 sm:grid-cols-2">
          {popularCategories.map((category) => (
            <Link
              key={category.label}
              className="border-bw-border rounded-[1.5rem] border bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(15,23,42,0.07)]"
              href={category.href}
            >
              <p className="font-display text-xl font-black text-bw-ink">{category.label}</p>
              <p className="mt-2 text-sm font-bold text-bw-muted">{category.count}</p>
            </Link>
          ))}
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
                className="border-bw-border overflow-hidden rounded-[2rem] border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
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
                    {product.reviewRating} rating -{" "}
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
                className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
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
        <div className="border-bw-border rounded-[2.25rem] border bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-7">
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
        <div className="border-bw-border rounded-[2.25rem] border bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-8">
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
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
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

function shortHeroVerdict(verdict: Verdict) {
  return verdict === "Better Alternative Available" ? "Better alternative" : verdict;
}
