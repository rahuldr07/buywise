# BuyWise AI Coding Rules

- Keep Phase 1 web-only unless explicitly asked to add another platform.
- Use Next.js App Router server components by default.
- Use client components only for interactivity.
- Use Tailwind CSS v4 CSS-first tokens from `app/globals.css`.
- Use shadcn/ui components from `components/ui`.
- Add `data-lenis-prevent` to scrollable Radix modal/popover/drawer content.
- Basic product checks must not require login.
- Login is required only for saved products, watchlists, alerts, receipts, and personalization.
- Recommendation ranking must remain commission-neutral.
- Always show affiliate disclosure near recommendation/buy flows.
