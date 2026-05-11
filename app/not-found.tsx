import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-5 py-16">
      <section className="grid w-full gap-8 rounded-xl border border-bw-border bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase text-primary">404</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-bw-ink md:text-6xl">
            Product not found
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-bw-muted">
            Try a different product name or go back to the homepage and run another check. The
            cleanest demo path today is still the Sony report.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-xl bg-primary px-5 text-primary-foreground">
              <Link href="/">
                <Search className="mr-2 size-4" />
                Check another product
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-xl border border-bw-border bg-white px-5 text-bw-ink hover:bg-bw-fog"
            >
              <Link href="/product/sony-wh-1000xm5">
                <Compass className="mr-2 size-4" />
                Open demo report
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-bw-border bg-bw-paper p-5">
          <p className="text-xs font-black uppercase text-bw-muted">Suggested recovery</p>
          <div className="mt-5 grid gap-3 text-sm font-medium text-bw-muted">
            <div className="rounded-lg border border-bw-border bg-white p-4">
              Try a cleaner product title or retailer link.
            </div>
            <div className="rounded-lg border border-bw-border bg-white p-4">
              Use the homepage checker to re-enter the flow.
            </div>
            <div className="rounded-lg border border-bw-border bg-white p-4">
              Open the demo report to inspect the intended end-state experience.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
