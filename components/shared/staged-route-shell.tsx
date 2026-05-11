import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StagedRouteShellProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  note?: string;
  children?: ReactNode;
}

export function StagedRouteShell({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref = "/",
  secondaryLabel = "Back home",
  note,
  children,
}: StagedRouteShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-16">
      <section className="premium-shell premium-noise grid w-full gap-8 rounded-[2.75rem] border border-white/85 p-4 shadow-[0_34px_120px_rgba(44,37,24,0.12)] md:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Badge className="text-primary rounded-2xl border border-white/80 bg-white px-4 py-2 shadow-sm">
            {eyebrow}
          </Badge>
          <h1 className="font-display text-bw-ink mt-6 max-w-3xl text-4xl leading-tight font-black md:text-6xl">
            {title}
          </h1>
          <p className="text-bw-muted mt-5 max-w-2xl text-base leading-8 font-medium md:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="text-primary-foreground inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--bw-ink),var(--bw-blue)_58%,var(--bw-green))] px-5 text-sm font-black shadow-[0_16px_42px_rgba(40,103,232,0.2)] transition hover:-translate-y-0.5"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="text-bw-ink hover:bg-bw-fog inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white px-5 text-sm font-black shadow-sm transition hover:-translate-y-0.5"
            >
              <ArrowLeft className="size-4" />
              {secondaryLabel}
            </Link>
          </div>

          {note ? <p className="text-bw-muted mt-5 text-sm leading-6 font-medium">{note}</p> : null}
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_12px_36px_rgba(44,37,24,0.08)] md:p-6">
          {children}
        </div>
      </section>
    </main>
  );
}
