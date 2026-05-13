import Link from "next/link";
import { ArrowRight, Bell, BookmarkPlus, History, Mail, ShieldCheck, UserRound } from "lucide-react";
import {
  AppPageShell,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: BookmarkPlus, label: "Save products" },
  { icon: Bell, label: "Price alerts" },
  { icon: History, label: "Receipt history" },
  { icon: ShieldCheck, label: "Personalized recommendations" },
];

export default function AccountPage() {
  return (
    <AppPageShell
      eyebrow="Account"
      title="Sign in only when the product needs to remember something."
      description="Basic product checks stay open. Accounts unlock saved products, alerts, receipt history, and personalization."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black" variant="outline">
          <Link href="/search">
            Continue as guest
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="border-bw-border rounded-[2.5rem] border bg-white p-6 shadow-[0_14px_40px_rgba(44,37,24,0.06)] md:p-8">
          <SectionHeader
            eyebrow="Login or signup"
            title="Use email or social sign-in."
            description="Phase 1 UI only. No auth provider is wired in this pass."
          />
          <div className="mt-8 grid gap-3">
            <label>
              <span className="mb-2 block text-xs font-black text-bw-muted">Email</span>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-bw-muted" />
                <input
                  className="h-14 w-full rounded-full border border-bw-border bg-bw-paper pr-4 pl-12 text-base font-bold text-bw-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="you@example.com"
                />
              </div>
            </label>
            <Button className="h-14 rounded-full text-base font-black">
              Continue with email
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Continue with Google", "Continue with Apple"].map((label) => (
                <Button key={label} className="h-12 rounded-full font-black" variant="outline">
                  <UserRound className="mr-2 size-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            eyebrow="Account benefits"
            title="Save only the workflows that require memory."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.label} className="border-bw-border rounded-[2rem] border bg-white p-5">
                  <span className="bg-bw-paper flex size-11 items-center justify-center rounded-full text-bw-green">
                    <Icon className="size-5" />
                  </span>
                  <p className="mt-4 font-display text-2xl font-black text-bw-ink">
                    {benefit.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                    Requires an account because BuyWise needs to store user-specific data.
                  </p>
                </div>
              );
            })}
          </div>
          <TrustNotice>
            Continue as guest keeps search and product verdicts accessible without login.
          </TrustNotice>
        </section>
      </div>
    </AppPageShell>
  );
}
