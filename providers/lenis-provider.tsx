"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

type BuyWiseWindow = Window &
  typeof globalThis & {
    __buywiseLenis?: Lenis;
  };

export function LenisProvider({ children }: { children: ReactNode }) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.18,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      prevent: (node) =>
        node.hasAttribute("data-lenis-prevent") ||
        node.classList.contains("lenis-prevent"),
    });

    const win = window as BuyWiseWindow;
    win.__buywiseLenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      lenis.destroy();
      delete win.__buywiseLenis;
    };
  }, []);

  return <>{children}</>;
}

export function useLenisScroll() {
  return (target: string | number | HTMLElement = 0) => {
    if (typeof window === "undefined") return;

    const lenis = (window as BuyWiseWindow).__buywiseLenis;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.18 });
      return;
    }

    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };
}