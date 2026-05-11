"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Bell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface PriceAlertDialogProps {
  productName: string;
  currentPrice: number;
  currency?: string;
  trigger?: ReactNode;
}

export function PriceAlertDialog({
  productName,
  currentPrice,
  currency = "USD",
  trigger,
}: PriceAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    String(Math.max(1, Math.round(currentPrice - 30)))
  );
  const [email, setEmail] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.info("Login required to save this alert", {
      description: "Basic checks stay open; saved alerts require sign-in.",
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="border-bw-border text-bw-ink hover:bg-bw-fog h-[3.25rem] rounded-2xl border bg-white px-5 shadow-sm">
            <Bell className="mr-2 size-4" />
            Track price
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="text-bw-ink overflow-hidden rounded-[2rem] border border-white/85 bg-white p-0 shadow-[0_34px_120px_rgba(44,37,24,0.18)] sm:max-w-lg"
        data-lenis-prevent
      >
        <DialogHeader>
          <div className="border-bw-border border-b bg-[linear-gradient(135deg,#fff4d8,#eef6ff_52%,#eafaf1)] px-6 py-6">
            <Badge className="text-primary mb-3 w-fit rounded-2xl border border-white/80 bg-white/82 px-4 py-2 shadow-sm">
              Login required to save alerts
            </Badge>
            <DialogTitle className="font-display text-bw-ink text-2xl font-black">
              Track this product
            </DialogTitle>
            <DialogDescription className="text-bw-muted mt-2 max-w-md text-sm leading-6">
              Set a target price for {productName}. Alerts need an account so IsItABuy can save the
              product and send updates.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-5 px-6 pt-5 pb-6" onSubmit={onSubmit}>
          <div className="border-bw-border bg-bw-fog rounded-[1.5rem] border p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-bw-muted text-sm font-medium">Current price</span>
              <span className="font-display text-bw-ink text-xl font-black">
                {formatPrice(currentPrice, currency)}
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-bw-ink" htmlFor="target-price">
              Alert me when price drops below
            </Label>
            <Input
              id="target-price"
              inputMode="decimal"
              value={targetPrice}
              onChange={(event) => setTargetPrice(event.target.value)}
              placeholder="299"
              className="border-bw-border text-bw-ink h-12 rounded-2xl bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-bw-ink" htmlFor="alert-email">
              Email for alert
            </Label>
            <Input
              id="alert-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="border-bw-border text-bw-ink h-12 rounded-2xl bg-white"
            />
          </div>

          <Separator />

          <div className="bg-bw-green-soft text-bw-muted flex items-start gap-3 rounded-[1.5rem] p-4 text-sm">
            <ShieldCheck className="text-bw-green mt-0.5 size-5 shrink-0" />
            <p>
              We may earn a commission from some links. AI scores and recommendations are not based
              on commission.
            </p>
          </div>

          <DialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0">
            <Button
              className="text-primary-foreground h-12 w-full rounded-2xl bg-[linear-gradient(135deg,var(--bw-ink),var(--bw-blue)_58%,var(--bw-green))]"
              type="submit"
            >
              Continue to login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
