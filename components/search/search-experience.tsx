"use client";

import type { ReactNode } from "react";
import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, Clock, GitCompareArrows, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AppPageShell,
  EmptyState,
  FilterRail,
  ProductCard,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { productCatalog } from "@/lib/demo-product";
import { searchFacets } from "@/lib/buywise-demo-data";
import { cn } from "@/lib/utils";

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All");
  const [retailer, setRetailer] = useState("All");
  const [sort, setSort] = useState("Best value");
  const [selectedCompare, setSelectedCompare] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearch(deferredQuery);

  const results = productCatalog
    .filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        fuzzyScore(normalizedQuery, `${product.name} ${product.brand} ${product.category} ${product.retailer}`) > 0;
      const matchesCategory = category === "All" || product.category === category;
      const matchesRetailer = retailer === "All" || product.retailer === retailer;

      return matchesQuery && matchesCategory && matchesRetailer;
    })
    .sort((a, b) => {
      if (sort === "Most trusted reviews") return b.confidenceScore - a.confidenceScore;
      if (sort === "Lowest price") return a.currentPrice - b.currentPrice;
      if (sort === "Highest AI score") return b.aiBuyScore - a.aiBuyScore;
      return b.aiBuyScore + b.confidenceScore - (a.aiBuyScore + a.confidenceScore);
    });

  const compareHref =
    selectedCompare.length > 0 ? `/compare/${selectedCompare[0]}` : "/compare";

  function toggleCompare(slug: string, selected: boolean) {
    setSelectedCompare((current) => {
      if (!selected) return current.filter((item) => item !== slug);
      return [...new Set([...current, slug])].slice(0, 3);
    });
  }

  return (
    <AppPageShell
      eyebrow="Search and results"
      title="Search any product, then sort by value and trust."
      description="Phase 1 uses demo data with real-feeling controls: category, retailer, review trust, price score, compare selection, and AI analysis links."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <a href="#results">View results</a>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <FilterRail
          groups={[
            { label: "Category", options: ["All", ...searchFacets.categories], active: category },
            { label: "Retailer", options: ["All", ...searchFacets.retailers], active: retailer },
            { label: "Price", options: searchFacets.priceRanges },
            { label: "Reviews", options: searchFacets.ratings },
          ]}
        />

        <section className="space-y-5">
          <div className="border-bw-border rounded-[2rem] border bg-white p-4 shadow-[0_12px_36px_rgba(44,37,24,0.06)]">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-bw-muted" />
                <input
                  className="h-14 w-full rounded-full border border-bw-border bg-bw-paper pr-4 pl-12 text-base font-bold text-bw-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search any product or paste a product URL"
                  value={query}
                />
              </label>
              <Button className="h-14 rounded-full px-7 font-black">
                Search
                <Search className="ml-2 size-4" />
              </Button>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <FilterPicker label="Category" options={["All", ...searchFacets.categories]} value={category} onChange={setCategory} />
              <FilterPicker label="Retailer" options={["All", ...searchFacets.retailers]} value={retailer} onChange={setRetailer} />
              <FilterPicker label="Sort" options={searchFacets.sorts} value={sort} onChange={setSort} icon={<ArrowDownUp className="size-4" />} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {["sony headphones", "iphone", "nike shoes"].map((term) => (
              <button
                key={term}
                className="border-bw-border flex items-center gap-2 rounded-full border bg-white px-4 py-3 text-left text-sm font-black text-bw-muted transition hover:border-primary/30 hover:text-primary"
                onClick={() => setQuery(term)}
                type="button"
              >
                <Clock className="size-4" />
                {term}
              </button>
            ))}
          </div>

          <TrustNotice>Search and product verdicts stay free. Saved products, alerts, receipts, and personalization require login later.</TrustNotice>

          {selectedCompare.length > 0 ? (
            <div className="border-bw-border flex flex-col gap-3 rounded-[1.5rem] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-bw-blue-soft text-primary flex size-11 items-center justify-center rounded-full">
                  <GitCompareArrows className="size-5" />
                </span>
                <div>
                  <p className="font-display text-bw-ink text-xl font-black">
                    {selectedCompare.length} selected for compare
                  </p>
                  <p className="text-bw-muted text-sm font-medium">
                    Select up to 3 products, then open the comparison flow.
                  </p>
                </div>
              </div>
              <Button asChild className="h-11 rounded-full px-5 font-black">
                <Link href={compareHref}>Compare selected</Link>
              </Button>
            </div>
          ) : null}

          <div id="results" className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-primary">Results</p>
              <h2 className="font-display text-3xl font-black text-bw-ink">
                {results.length} matching products
              </h2>
            </div>
            <p className="hidden text-sm font-bold text-bw-muted sm:block">
              Sorted by {sort.toLowerCase()}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((product) => (
                <ProductCard
                  key={product.slug}
                  compare
                  compareSelected={selectedCompare.includes(product.slug)}
                  onCompareChange={(selected) => toggleCompare(product.slug, selected)}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/"
              actionLabel="Start from homepage"
              description="Try a broader term like iPhone, Sony, Nike, headphones, phones, or shoes."
              title="No products matched this search"
            />
          )}
        </section>
      </div>
    </AppPageShell>
  );
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function fuzzyScore(query: string, value: string) {
  const haystack = normalizeSearch(value);
  const tokens = query.split(" ").filter(Boolean);

  if (tokens.length === 0) return 1;

  return tokens.reduce((score, token) => {
    if (haystack.includes(token)) return score + token.length * 6;
    if (isSubsequence(token, haystack)) return score + token.length;
    return score;
  }, 0);
}

function isSubsequence(needle: string, haystack: string) {
  let cursor = 0;

  for (const char of haystack) {
    if (char === needle[cursor]) cursor += 1;
    if (cursor === needle.length) return true;
  }

  return false;
}

function FilterPicker({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black text-bw-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black transition",
              value === option
                ? "border-primary/35 bg-white text-primary shadow-sm"
                : "border-bw-border bg-white text-bw-muted hover:text-bw-ink"
            )}
            onClick={() => onChange(option)}
            type="button"
          >
            {icon}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
