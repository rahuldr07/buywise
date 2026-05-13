import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Send, Sparkles, UserRound } from "lucide-react";
import {
  AffiliateDisclosure,
  AppPageShell,
  ProductCard,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";
import { chatPrompts } from "@/lib/buywise-demo-data";
import { productCatalog } from "@/lib/demo-product";
import { formatPrice } from "@/lib/utils";

export default function ChatPage() {
  const recommended = productCatalog[0];

  return (
    <AppPageShell
      eyebrow="AI shopping chat"
      title="Ask shopping questions and get source-backed product cards."
      description="The chat UI is static in Phase 1, but it shows the intended answer style: verdicts, citations, product cards, comparisons, and disclosure near recommendations."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="border-bw-border overflow-hidden rounded-[2rem] border bg-white shadow-[0_10px_30px_rgba(44,37,24,0.045)]">
          <div className="border-bw-border border-b bg-bw-paper p-5">
            <SectionHeader
              eyebrow="Suggested prompts"
              title="Start with a product, budget, or comparison."
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {chatPrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-bw-border bg-white px-3 py-2 text-sm font-black text-bw-muted"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-5 p-5">
            <ChatBubble role="user">
              Find me the best headphones for travel under $350, and tell me if the Sony XM5 is still worth it.
            </ChatBubble>
            <ChatBubble role="assistant">
              The XM5 is strong, but BuyWise flags a better-alternative state today because comfort and price stability are stronger on the Bose option.
            </ChatBubble>
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="border-bw-border rounded-[1.5rem] border bg-bw-paper p-4">
                <Image
                  alt={recommended.name}
                  className="h-48 w-full rounded-[1rem] object-cover"
                  height={320}
                  src={recommended.imageUrl}
                  width={520}
                />
                <p className="mt-4 font-display text-2xl font-black text-bw-ink">
                  {recommended.name}
                </p>
                <p className="mt-2 text-sm font-bold text-bw-muted">
                  Current price {formatPrice(recommended.currentPrice, recommended.currency)}
                </p>
              </div>
              <ProductCard product={recommended} />
            </div>
            <AffiliateDisclosure />

            <div className="border-t border-bw-border pt-5">
              <label className="relative block">
                <input
                  className="h-14 w-full rounded-full border border-bw-border bg-bw-paper pr-16 pl-5 text-base font-bold text-bw-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Ask about a product, category, budget, or comparison..."
                />
                <Button className="absolute top-1.5 right-1.5 size-11 rounded-full">
                  <Send className="size-4" />
                </Button>
              </label>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <Sparkles className="size-6 text-bw-violet" />
            <p className="mt-4 font-display text-2xl font-black text-bw-ink">Source-backed answers</p>
            <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
              Responses should cite retailer, review, expert, and price-history evidence.
            </p>
            <Button asChild className="mt-5 h-11 rounded-full px-5 font-black" variant="outline">
              <Link href="/search">
                Search instead
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          <TrustNotice>
            Chat can recommend products, but basic verdicts remain accessible outside chat.
          </TrustNotice>
        </aside>
      </div>
    </AppPageShell>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "justify-end"}`}>
      {isAssistant ? (
        <span className="bg-bw-paper flex size-10 shrink-0 items-center justify-center rounded-full text-primary">
          <Bot className="size-5" />
        </span>
      ) : null}
      <div
        className={`max-w-2xl rounded-[1.5rem] px-5 py-4 text-sm leading-6 font-bold ${
          isAssistant ? "bg-bw-paper text-bw-muted" : "bg-primary text-white"
        }`}
      >
        {children}
      </div>
      {!isAssistant ? (
        <span className="bg-bw-paper flex size-10 shrink-0 items-center justify-center rounded-full text-bw-green">
          <UserRound className="size-5" />
        </span>
      ) : null}
    </div>
  );
}
