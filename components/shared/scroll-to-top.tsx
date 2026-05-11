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
        "fixed bottom-6 right-6 z-50 size-12 rounded-xl border border-bw-border bg-white text-bw-ink shadow-lg transition-all hover:bg-bw-fog",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
      size="icon"
      onClick={() => scrollTo(0)}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
