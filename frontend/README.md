# ASA — Association for Statistics and Analytics

Website for the Association for Statistics and Analytics at Texas State University.
Next.js App Router, shipped as a static export (`next build` emits `out/`).

```bash
npm run dev     # http://localhost:3000
npm run build   # static site -> out/
npm run lint
```

## Structure

```
app/
├── layout.tsx              root layout: fonts, site metadata, MotionProvider
├── globals.css             tokens + base styles
└── (site)/                 route group — shared chrome, adds nothing to URLs
    ├── layout.tsx          Header + Footer, applied to every page below
    ├── page.tsx            /             -> HomeView
    ├── HomeView.tsx
    ├── about/page.tsx      /about        -> AboutView
    ├── events/page.tsx     /events       -> EventsView
    └── membership/page.tsx /membership   -> MembershipView

components/
├── layout/     Header, Footer, MobileCta   (site chrome)
├── ui/         ActionButton, Bento, SectionLabel, LineRise, Reveal
├── graphics/   Icons, Motifs               (inline SVG artwork)
└── providers/  MotionProvider

lib/            links.ts, meeting.ts, random.ts
public/         logos and images, pre-sized (images are unoptimized under export)
assets-source/  original assets, not shipped
```

Each route folder holds a `page.tsx` and its view:

- **`page.tsx`** — server component. Exports `metadata`, renders the view. Nothing else.
- **`*View.tsx`** — the `"use client"` component with the page's markup and animation,
  paired with a colocated `*View.module.css`.

Imports resolve through the `@/` alias from the `frontend/` root — `@/components/ui/ActionButton`,
`@/lib/links`.
