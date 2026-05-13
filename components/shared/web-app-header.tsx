"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useLenisScroll } from "@/providers/lenis-provider";

type HeaderVariant = "fixed" | "sticky";

type HeaderLink = {
  href: string;
  label: string;
};

const webLinks: HeaderLink[] = [
  { href: "/search", label: "Search" },
  { href: "/deals", label: "Deals" },
  { href: "/compare", label: "Compare" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/alerts", label: "Alerts" },
];

type LenisScrollPayload = {
  direction: -1 | 0 | 1;
  scroll: number;
};

type LenisScrollEmitter = {
  off?: (event: "scroll", callback: (payload: LenisScrollPayload) => void) => void;
  on?: (event: "scroll", callback: (payload: LenisScrollPayload) => void) => void;
};

type HeaderWindow = Window &
  typeof globalThis & {
    __buywiseLenis?: LenisScrollEmitter;
  };

export function WebAppHeader({
  ctaHref = "/search",
  ctaLabel = "Check product",
  links = webLinks,
  variant = "sticky",
}: {
  ctaHref?: string;
  ctaLabel?: string;
  links?: HeaderLink[];
  variant?: HeaderVariant;
}) {
  const navShellRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);
  const navHiddenRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const scrollTo = useLenisScroll();

  useEffect(() => {
    const navShell = navShellRef.current;
    if (!navShell) return;

    const hideDuration = shouldReduceMotion ? 0 : 0.24;
    const showDuration = shouldReduceMotion ? 0 : 0.72;

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

    const lenis = (window as HeaderWindow).__buywiseLenis;
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

  function renderHeaderLink(link: HeaderLink) {
    if (link.href.startsWith("#")) {
      return (
        <button
          key={link.href}
          className="transition hover:text-primary"
          type="button"
          onClick={() => scrollTo(link.href)}
        >
          {link.label}
        </button>
      );
    }

    return (
      <Link key={link.href} className="transition hover:text-primary" href={link.href}>
        {link.label}
      </Link>
    );
  }

  const headerContent = (
    <motion.div
      ref={navShellRef}
      data-web-header-shell
      className="border-bw-border flex h-[4.75rem] items-center justify-between gap-3 rounded-full border bg-white/94 px-3 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl will-change-transform md:px-5"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link className="flex items-center gap-3" href="/">
        <span className="bg-bw-amber text-bw-ink flex size-10 items-center justify-center rounded-full">
          <Sparkles className="size-4 fill-current" />
        </span>
        <span className="font-display text-lg font-black tracking-[-0.04em] md:text-xl">
          IsItABuy
        </span>
      </Link>

      <nav className="text-bw-ink hidden items-center gap-5 text-sm font-black lg:flex">
        {links.map(renderHeaderLink)}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          className="bg-bw-fog text-bw-ink hidden h-12 items-center rounded-full px-5 text-sm font-black transition hover:bg-bw-border sm:inline-flex"
          href="/account"
        >
          Sign in
        </Link>
        <Link
          className="bg-primary inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(47,111,218,0.22)] transition hover:-translate-y-0.5 hover:bg-primary/90"
          href={ctaHref}
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <header
      data-page-nav
      className={cn(
        "z-50",
        variant === "fixed"
          ? "fixed top-7 left-1/2 w-[min(calc(100%-2rem),68rem)] -translate-x-1/2"
          : "sticky top-4"
      )}
    >
      {headerContent}
    </header>
  );
}
