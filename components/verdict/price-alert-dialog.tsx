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
  const [targetPrice, setTargetPrice] = useState(String(Math.max(1, Math.round(currentPrice - 30))));
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
          <Button className="h-12 rounded-xl border border-bw-border bg-white px-5 text-bw-ink hover:bg-bw-fog">
            <Bell className="mr-2 size-4" />
            Track price
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-xl border border-bw-border bg-white p-0 text-bw-ink shadow-2xl sm:max-w-lg" data-lenis-prevent>
        <DialogHeader>
          <div className="border-b border-bw-border bg-bw-fog px-6 py-6">
            <Badge className="mb-3 w-fit rounded-lg border border-bw-border bg-white px-3 py-1 text-primary">
              Login required to save alerts
            </Badge>
            <DialogTitle className="font-display text-2xl font-black text-bw-ink">
              Track this product
            </DialogTitle>
            <DialogDescription className="mt-2 max-w-md text-sm leading-6 text-bw-muted">
              Set a target price for {productName}. Alerts need an account so BuyWise can save the
              product and send updates.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-5 px-6 pb-6 pt-5" onSubmit={onSubmit}>
          <div className="rounded-xl border border-bw-border bg-bw-paper p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-bw-muted">Current price</span>
              <span className="font-display text-xl font-black text-bw-ink">
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
              className="h-12 rounded-xl border-bw-border bg-white text-bw-ink"
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
              className="h-12 rounded-xl border-bw-border bg-white text-bw-ink"
            />
          </div>

          <Separator />

          <div className="flex items-start gap-3 rounded-xl bg-bw-green-soft p-4 text-sm text-bw-muted">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-bw-green" />
            <p>
              We may earn a commission from some links. AI scores and recommendations are not based
              on commission.
            </p>
          </div>

          <DialogFooter className="-mx-0 -mb-0 border-0 bg-transparent p-0">
            <Button className="h-12 w-full rounded-xl bg-primary text-primary-foreground" type="submit">
              Continue to login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
