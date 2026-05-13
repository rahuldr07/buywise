import Link from "next/link";
import { ArrowRight, FileImage, FileText, ShieldCheck, Upload } from "lucide-react";
import {
  AppPageShell,
  LoginGateCard,
  SectionHeader,
  TrustNotice,
} from "@/components/shared/buywise-ui";
import { Button } from "@/components/ui/button";

const retailers = ["Amazon", "Walmart", "Best Buy", "Target", "eBay"];

export default function ReceiptUploadPage() {
  return (
    <AppPageShell
      eyebrow="Receipt upload"
      title="Upload receipts to find missed savings and better alternatives."
      description="Receipt analysis is staged for signed-in users. The UI shows upload, consent, OCR status, manual correction, matched products, and savings recommendations."
      actions={
        <Button asChild className="h-12 rounded-full px-5 font-black">
          <Link href="/receipts/receipt-demo">
            View receipt demo
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-5">
          <div className="border-bw-border rounded-[2.5rem] border border-dashed bg-white p-8 text-center shadow-[0_10px_30px_rgba(44,37,24,0.045)]">
            <span className="bg-bw-paper mx-auto flex size-16 items-center justify-center rounded-full text-primary">
              <Upload className="size-7" />
            </span>
            <h2 className="font-display mt-5 text-3xl font-black text-bw-ink">
              Drop a receipt image or PDF
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 font-medium text-bw-muted">
              JPG, PNG, and PDF are represented in Phase 1. Actual OCR and storage are not wired yet.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button className="h-11 rounded-full px-5 font-black">
                <FileImage className="mr-2 size-4" />
                Upload image
              </Button>
              <Button className="h-11 rounded-full px-5 font-black" variant="outline">
                <FileText className="mr-2 size-4" />
                Upload PDF
              </Button>
            </div>
          </div>

          <SectionHeader
            eyebrow="Processing flow"
            title="OCR status, corrections, matches, and savings."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {["OCR processing", "Manual correction", "Matched products"].map((step, index) => (
              <div key={step} className="border-bw-border rounded-[2rem] border bg-white p-5">
                <span className="font-display text-3xl font-black text-primary">0{index + 1}</span>
                <p className="mt-4 font-black text-bw-ink">{step}</p>
                <p className="mt-2 text-sm leading-6 font-medium text-bw-muted">
                  Phase 1 shows the interface state without uploading or storing files.
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <LoginGateCard
            title="Receipt history requires login"
            description="Receipts contain purchase data, so upload history and matched items are account-gated."
          />
          <div className="border-bw-border rounded-[2rem] border bg-white p-5">
            <ShieldCheck className="size-6 text-bw-green" />
            <p className="mt-4 font-display text-2xl font-black text-bw-ink">Supported retailers</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {retailers.map((retailer) => (
                <span
                  key={retailer}
                  className="rounded-full border border-bw-border bg-bw-paper px-3 py-2 text-sm font-black text-bw-muted"
                >
                  {retailer}
                </span>
              ))}
            </div>
          </div>
          <TrustNotice>
            Receipt data should only be used for savings analysis and personalization after consent.
          </TrustNotice>
        </aside>
      </div>
    </AppPageShell>
  );
}
