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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-16">
      <section className="grid w-full gap-8 rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Badge className="rounded-lg border border-bw-border bg-bw-fog px-3 py-1 text-primary">
            {eyebrow}
          </Badge>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-black leading-tight text-bw-ink md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-bw-muted md:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground transition hover:-translate-y-0.5"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-bw-border bg-white px-5 text-sm font-black text-bw-ink transition hover:-translate-y-0.5 hover:bg-bw-fog"
            >
              <ArrowLeft className="size-4" />
              {secondaryLabel}
            </Link>
          </div>

          {note ? <p className="mt-5 text-sm font-medium leading-6 text-bw-muted">{note}</p> : null}
        </div>

        <div className="rounded-xl border border-bw-border bg-bw-paper p-5 md:p-6">{children}</div>
      </section>
    </main>
  );
}
