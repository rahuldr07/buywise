"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLenisScroll } from "@/providers/lenis-provider";

export function ScrollToTop() {
  const scrollTo = useLenisScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      aria-label="Scroll to top"
      className={cn(
        "text-bw-ink border-bw-border hover:bg-bw-fog fixed right-6 bottom-6 z-50 size-12 rounded-2xl border bg-white shadow-[0_10px_30px_rgba(44,37,24,0.12)] transition-all",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      size="icon"
      onClick={() => scrollTo(0)}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
