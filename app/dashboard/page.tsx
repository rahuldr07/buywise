import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, EyeOff, HeartHandshake, Settings2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import {
  AppPageShell,
  LoginGateCard,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { dashboardPreferences } from "@/lib/buywise-demo-data";

export default function DashboardPage() {
  return (
    <AppPageShell
      eyebrow="Preferences"
      title="Personalize recommendations without changing commission-neutral ranking."
      description="Dashboard preferences are staged for signed-in users: budgets, retailers, blocked brands, categories, beauty profile, future dietary restrictions, alerts, and privacy settings."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/account">Account settings</Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <SectionHeader
            eyebrow="Recommendation controls"
            title="Tell BuyWise what matters before checkout."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <PreferencePanel icon={<SlidersHorizontal className="size-5" />} title="Preferred budgets" items={dashboardPreferences.budgets} />
            <PreferencePanel icon={<HeartHandshake className="size-5" />} title="Preferred retailers" items={dashboardPreferences.retailers} />
            <PreferencePanel icon={<EyeOff className="size-5" />} title="Blocked brands" items={dashboardPreferences.blockedBrands} />
            <PreferencePanel icon={<Settings2 className="size-5" />} title="Shopping categories" items={dashboardPreferences.categories} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-bw-border rounded-[2rem] border bg-white p-5">
              <p className="font-display text-2xl font-black text-bw-ink">Beauty profile</p>
              <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                Skin type and sensitivity preferences can later improve beauty recommendations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Dry skin", "Fragrance-free", "Sensitive"].map((item) => (
                  <span key={item} className="rounded-full border border-bw-border bg-white px-3 py-2 text-sm font-black text-bw-violet">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-bw-border rounded-[2rem] border bg-white p-5">
              <p className="font-display text-2xl font-black text-bw-ink">Dietary restrictions</p>
              <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                Placeholder for later food, grocery, and supplement recommendation logic.
              </p>
              <span className="mt-4 inline-flex rounded-full border border-bw-border bg-white px-3 py-2 text-sm font-black text-bw-amber">
                Coming later
              </span>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <LoginGateCard
            title="Preferences require login"
            description="Personalization needs an account, but basic product checks stay open."
          />
          <PreferencePanel icon={<Bell className="size-5" />} title="Alert settings" items={["Email only", "Weekly digest", "No hidden alerts"]} />
          <PreferencePanel icon={<ShieldCheck className="size-5" />} title="Privacy settings" items={dashboardPreferences.privacy} />
          <TrustNotice>
            Preferences tune the user experience; they must not override product evidence or paid placement neutrality.
          </TrustNotice>
        </aside>
      </div>
    </AppPageShell>
  );
}

function PreferencePanel({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="border-bw-border rounded-[2rem] border bg-white p-5 shadow-[0_10px_30px_rgba(44,37,24,0.045)]">
      <span className="bg-bw-paper flex size-11 items-center justify-center rounded-full text-primary">
        {icon}
      </span>
      <p className="mt-4 font-display text-2xl font-black text-bw-ink">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-bw-border bg-bw-paper px-3 py-2 text-sm font-black text-bw-muted"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
