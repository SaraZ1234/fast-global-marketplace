# FAST Global Marketplace

A multi-page, responsive, animated Next.js website for a global B2B & B2C wholesale
marketplace — built in a black/white design system, inspired by the density and
category-driven structure of made-in-china.com.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling (custom black/white token system)
- **Framer Motion** for scroll reveals and micro-interactions
- **lucide-react** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
npm run build
npm run start
```

## Pages

| Route                    | Description                                    |
|---------------------------|-------------------------------------------------|
| `/`                        | Home — hero, ticker, industries, features, CTA  |
| `/industries`              | All 10 sourcing categories                      |
| `/industries/[slug]`       | Individual industry detail page                 |
| `/products`                | Product catalog with filters                    |
| `/suppliers`               | Verified supplier directory                     |
| `/services`                | Business services & advertising solutions       |
| `/logistics`               | Shipping modes & payment methods                |
| `/pricing`                 | Membership plans (Free / Professional / Enterprise) |
| `/sell`                    | Become a Seller landing page                    |
| `/about`                   | Company story, timeline, stats                  |
| `/faq`                     | Accordion FAQ                                   |
| `/contact`                 | RFQ / quotation request form                     |
| `/careers`, `/press`, `/investors`, `/legal` | Footer utility pages           |

## Design system

- **Colors:** ink `#0A0A0A`, paper `#FFFFFF`, bone `#F4F4F2`, line `#DEDEDA`, smoke `#8A8A85`, ash `#48484A`
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (data/labels) — loaded via Google Fonts in `globals.css`
- **Signature element:** the scrolling trade-stats ticker beneath the hero (`src/components/Ticker.tsx`)

## Content data

All copy for industries, features, plans, FAQs, etc. lives in `src/lib/data.ts` — edit
that file to update content across the whole site without touching page markup.

## Notes

- Sample suppliers and products are placeholder content — wire up a real API or CMS
  before launch.
- The contact form is client-side only (no backend submission wired up yet).
- Fonts are loaded via a CSS `@import` in `globals.css` (requires internet access at
  runtime in the browser, not at build time).
