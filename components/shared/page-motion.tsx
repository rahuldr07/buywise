"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { motion, useReducedMotion } from "motion/react";

gsap.registerPlugin(useGSAP);

export function PageMotion({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (shouldReduceMotion) return;

      gsap
        .timeline({ defaults: { duration: 0.58, ease: "power3.out" } })
        .from("[data-page-nav]", { autoAlpha: 0, y: -18 })
        .from("[data-page-hero]", { autoAlpha: 0, y: 24 }, "-=0.2")
        .from("[data-flow-card]", { autoAlpha: 0, stagger: 0.055, y: 18 }, "-=0.22")
        .from("[data-page-content]", { autoAlpha: 0, y: 22 }, "-=0.24");
    },
    { scope: scopeRef, dependencies: [shouldReduceMotion] }
  );

  return (
    <motion.main
      ref={scopeRef}
      className="min-h-screen px-4 py-5"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.28 }}
    >
      {children}
    </motion.main>
  );
}
