import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  GitCompareArrows,
  LockKeyhole,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PageMotion } from "@/components/shared/page-motion";
import { WebAppHeader } from "@/components/shared/web-app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { verdictTheme } from "@/lib/verdict-theme";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import type { ProductVerdict, Verdict } from "@/types/product";

const journeySteps = [
  {
    icon: Search,
    label: "Find",
    copy: "Paste, search, scan, or start from a product card.",
  },
  {
    icon: Radar,
    label: "Score",
    copy: "Price, reviews, trust, and alternatives are ranked together.",
  },
  {
    icon: GitCompareArrows,
    label: "Compare",
    copy: "Open the cleaner option when the evidence supports it.",
  },
  {
    icon: Bell,
    label: "Save",
    copy: "Login only for watchlists, alerts, receipts, and history.",
  },
] as const;

export function AppPageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <PageMotion>
      <div className="mx-auto max-w-7xl">
        <WebAppHeader />

        <section
          data-page-hero
          className="border-bw-border mt-6 overflow-hidden rounded-[2.75rem] border bg-[linear-gradient(135deg,#ffffff_0%,#fff8e7_46%,#eff7ff_100%)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
        >
          <Badge className="border-bw-border bg-bw-paper text-bw-muted rounded-full border px-4 py-2">
            {eyebrow}
          </Badge>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display max-w-5xl text-4xl leading-tight font-black tracking-[-0.055em] text-bw-ink md:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 font-medium text-bw-muted md:text-lg">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.label}
                  data-flow-card
                  className="border-bw-border bg-white/78 rounded-[1.5rem] border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-bw-amber-soft text-bw-amber flex size-10 items-center justify-center rounded-full">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-bw-muted text-[0.68rem] font-black tracking-[0.16em] uppercase">
                        Step {index + 1}
                      </p>
                      <p className="font-display text-bw-ink text-lg font-black">{step.label}</p>
                    </div>
                  </div>
                  <p className="text-bw-muted mt-3 text-sm leading-6 font-medium">{step.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div data-page-content className="py-6">
          {children}
        </div>
      </div>
    </PageMotion>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-sm font-black text-primary">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl leading-tight font-black tracking-[-0.045em] text-bw-ink md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 font-medium text-bw-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function VerdictBadge({
  verdict,
  variant = "soft",
  className,
}: {
  verdict: Verdict;
  variant?: "soft" | "badge";
  className?: string;
}) {
  const theme = verdictTheme[verdict];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1.5 text-xs font-black",
        variant === "badge" ? theme.badge : theme.soft,
        className
      )}
    >
      {verdict === "Better Alternative Available" ? "Better alternative" : verdict}
    </span>
  );
}

export function ScoreTile({
  label,
  value,
  tone = "blue",
  caption,
}: {
  label: string;
  value: string | number;
  tone?: "blue" | "green" | "amber" | "red" | "violet" | "neutral";
  caption?: string;
}) {
  const tones = {
    blue: "text-primary",
    green: "text-bw-green",
    amber: "text-bw-amber",
    red: "text-bw-red",
    violet: "text-bw-violet",
    neutral: "bg-white text-bw-ink",
  };

  return (
    <div className="border-bw-border rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-black text-bw-muted">{label}</p>
      <p className={cn("font-display mt-2 text-3xl font-black", tones[tone])}>{value}</p>
      {caption ? <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">{caption}</p> : null}
    </div>
  );
}

export function ProductCard({
  product,
  compare = false,
  compareSelected = false,
  onCompareChange,
  actionLabel = "View AI analysis",
}: {
  product: ProductVerdict;
  compare?: boolean;
  compareSelected?: boolean;
  onCompareChange?: (selected: boolean) => void;
  actionLabel?: string;
}) {
  const priceScore = product.scores.find((score) => score.id === "price")?.score ?? product.aiBuyScore;
  const trustScore = product.scores.find((score) => score.id === "trust")?.score ?? product.confidenceScore;

  return (
    <article className="border-bw-border overflow-hidden rounded-[2rem] border bg-white shadow-[0_14px_40px_rgba(15,23,42,0.055)]">
      <div className="relative h-56 bg-white">
        {compare ? (
          <label className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-bw-ink shadow-sm backdrop-blur">
            <input
              checked={compareSelected}
              className="accent-bw-blue"
              onChange={(event) => onCompareChange?.(event.target.checked)}
              type="checkbox"
            />
            Compare
          </label>
        ) : null}
        <Image
          alt={product.name}
          className="h-full w-full object-cover"
          height={440}
          src={product.imageUrl}
          width={680}
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <VerdictBadge verdict={product.verdict} />
          <span className="font-display text-3xl font-black text-bw-ink">{product.aiBuyScore}</span>
        </div>
        <h3 className="font-display mt-4 line-clamp-2 text-2xl leading-tight font-black text-bw-ink">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-bold text-bw-muted">
          {product.retailer} availability - {formatPrice(product.currentPrice, product.currency)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <MiniMetric label="Review trust" value={trustScore} />
          <MiniMetric label="Price score" value={priceScore} />
        </div>
        <Button asChild className="mt-5 h-11 w-full rounded-full font-black">
          <Link href={`/product/${product.slug}`}>
            {actionLabel}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1rem] border border-bw-border bg-bw-paper p-3">
      <p className="text-xs font-black text-bw-muted">{label}</p>
      <p className="font-display mt-1 text-2xl font-black text-bw-ink">{value}</p>
    </div>
  );
}

export function FilterRail({
  groups,
}: {
  groups: Array<{ label: string; options: string[]; active?: string }>;
}) {
  return (
    <aside className="border-bw-border rounded-[2rem] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2 text-bw-ink">
        <Search className="size-4 text-primary" />
        <p className="font-black">Filters</p>
      </div>
      <div className="mt-5 grid gap-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-bw-muted">
              {group.label}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 lg:grid">
              {group.options.map((option) => (
                <span
                  key={option}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-black",
                    group.active === option
                      ? "border-primary/35 bg-white text-primary shadow-sm"
                      : "border-bw-border bg-bw-paper text-bw-muted"
                  )}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function MockChart({
  points,
  color = "#2867e8",
}: {
  points: Array<{ label: string; value: number }>;
  color?: string;
}) {
  const width = 640;
  const height = 220;
  const min = Math.min(...points.map((point) => point.value));
  const max = Math.max(...points.map((point) => point.value));
  const range = Math.max(1, max - min);
  const coords = points.map((point, index) => {
    const x = 34 + (index / Math.max(1, points.length - 1)) * 572;
    const y = 32 + 118 - ((point.value - min) / range) * 118;
    return { ...point, x, y };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `34,176 ${line} 606,176`;

  return (
    <div className="border-bw-border overflow-hidden rounded-[1.5rem] border bg-bw-paper">
      <svg aria-label="Mock trend chart" className="h-64 w-full" viewBox={`0 0 ${width} ${height}`}>
        <polygon fill={color} opacity="0.1" points={area} />
        <polyline
          fill="none"
          points={line}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        {coords.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} fill="#fff" r="5" stroke={color} strokeWidth="2" />
            <text fill="#6d7169" fontSize="12" fontWeight="800" textAnchor="middle" x={point.x} y="198">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  return (
    <div className="border-bw-border flex gap-3 rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
      <div>
        <p className="text-xs font-black text-bw-ink">Affiliate disclosure</p>
        <p className={cn("mt-1 font-medium leading-6 text-bw-muted", compact ? "text-xs" : "text-sm")}>
          We may earn a commission from some retailer links. BuyWise scores, rankings, and verdicts
          remain commission-neutral.
        </p>
      </div>
    </div>
  );
}

export function TrustNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="border-bw-border flex gap-3 rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-bw-green" />
      <p className="text-sm leading-6 font-medium text-bw-muted">
        {children ?? "Basic checks stay open. Login is only required for saved products, alerts, receipts, and personalization."}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="border-bw-border rounded-[2rem] border bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-bw-paper text-primary">
        <Sparkles className="size-6" />
      </span>
      <h2 className="font-display mt-5 text-3xl font-black text-bw-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 font-medium text-bw-muted">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Button asChild className="mt-6 h-11 rounded-full px-5 font-black">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export function LoginGateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        <span className="bg-bw-paper flex size-11 shrink-0 items-center justify-center rounded-full text-primary">
          <LockKeyhole className="size-5" />
        </span>
        <div>
          <p className="font-display text-xl font-black text-bw-ink">{title}</p>
          <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">{description}</p>
        </div>
      </div>
      <Button asChild className="mt-5 h-11 rounded-full px-5 font-black">
        <Link href="/account">
          Sign in to save
          <Bell className="ml-2 size-4" />
        </Link>
      </Button>
    </div>
  );
}

export function ProductStatStrip({ product }: { product: ProductVerdict }) {
  const trust = product.scores.find((score) => score.id === "trust")?.score ?? product.confidenceScore;

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <ScoreTile label="AI Buy Score" value={product.aiBuyScore} tone="blue" />
      <ScoreTile label="Confidence" value={`${product.confidenceScore}%`} tone="green" />
      <ScoreTile label="Reviews" value={formatNumber(product.reviewCount)} tone="neutral" />
      <ScoreTile label="Trust Score" value={trust} tone="violet" />
    </div>
  );
}
