"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Filter, MessageSquareText } from "lucide-react";
import type { ReviewInsight } from "@/types/product";
import { cn } from "@/lib/utils";

interface ReviewSynthesisProps {
  reviews: ReviewInsight[];
}

export function ReviewSynthesis({ reviews }: ReviewSynthesisProps) {
  const [activeSource, setActiveSource] = useState<string>("All");
  const sources = useMemo(
    () => ["All", ...Array.from(new Set(reviews.map((review) => review.source)))],
    [reviews]
  );
  const filteredReviews =
    activeSource === "All" ? reviews : reviews.filter((review) => review.source === activeSource);

  return (
    <article className="border-bw-border rounded-[2rem] border bg-white p-6 shadow-[0_10px_30px_rgba(44,37,24,0.06)] md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-black">AI review synthesis</p>
          <h2 className="font-display text-bw-ink mt-2 text-3xl font-black">
            Filtered reviews from top sources
          </h2>
          <p className="text-bw-muted mt-3 max-w-2xl text-sm leading-6 font-medium">
            These are AI-generated summaries of review patterns grouped by source. They are demo
            summaries, not direct quotes.
          </p>
        </div>
        <span className="bg-bw-blue-soft text-primary flex size-12 items-center justify-center rounded-full">
          <Filter className="size-5" />
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {sources.map((source) => (
          <button
            key={source}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-black transition",
              activeSource === source
                ? "border-primary bg-primary text-white"
                : "border-bw-border bg-bw-paper text-bw-muted hover:text-bw-ink"
            )}
            type="button"
            onClick={() => setActiveSource(source)}
          >
            {source}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {filteredReviews.map((review) => (
          <div
            key={`${review.source}-${review.rating}`}
            className="border-bw-border bg-bw-paper rounded-[1.5rem] border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-bw-ink text-xl font-black">{review.source}</p>
                <p className="text-bw-muted mt-1 text-sm font-bold">{review.rating}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-black",
                  review.sentiment === "Positive" && "bg-bw-green-soft text-bw-green",
                  review.sentiment === "Mixed" && "bg-bw-amber-soft text-bw-amber",
                  review.sentiment === "Negative" && "bg-bw-red-soft text-bw-red"
                )}
              >
                {review.sentiment}
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              {review.sentiment === "Positive" ? (
                <BadgeCheck className="text-bw-green mt-0.5 size-5 shrink-0" />
              ) : (
                <MessageSquareText className="text-bw-amber mt-0.5 size-5 shrink-0" />
              )}
              <p className="text-bw-muted text-sm leading-6 font-medium">{review.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
