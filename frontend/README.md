# Frontend — ASA at Texas State

The whole website. A Next.js (App Router) application shipped as a **static
export**: `next build` writes a folder of plain HTML/CSS/JS to `out/`, which
GitHub Pages serves. There is no server, no API, and no data fetching at
runtime.

For what the site *is* and who maintains it, see the [root README](../README.md).
This file is about how the code works.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site -> out/
npm run lint
```

Requires Node 22 (what CI builds with). Imports resolve through the `@/` alias
rooted at this folder — `@/components/ui/ActionButton`, `@/lib/links`.

---

## Layout of the code

```
app/
├── layout.tsx              root layout: fonts, site metadata, MotionProvider
├── globals.css             design tokens, the two tones, base reset
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
├── graphics/   Icons, Motifs, Ridgeline    (inline SVG artwork)
└── providers/  MotionProvider

lib/            asset.ts, links.ts, meeting.ts, random.ts
public/         logos and images, pre-sized (images are unoptimized under export)
assets-source/  originals, deliberately outside public/ so they are not shipped
```

## The page pattern

Every route is exactly two files plus a stylesheet:

- **`page.tsx`** — a server component. Exports `metadata`, renders the view,
  and does nothing else.
- **`*View.tsx`** — a `"use client"` component holding the page's markup and
  animation, paired with a colocated **`*View.module.css`**.

The split exists because almost everything on these pages animates on scroll,
which needs the client — but page metadata and the route shell should not. The
`(site)` route group wraps all four pages in the same `Header` / `Footer`
without contributing a URL segment.

A view is written as a stack of full-height `<section>` "stages", each one
making a single point.

## Styling: tokens and two tones

There is no per-component colour anywhere. [app/globals.css](app/globals.css)
defines the palette once, and the site speaks in two registers:

| Class | Register |
| --- | --- |
| `tone-pine` | Deep evergreen ground with gold — ASA itself, the club |
| `tone-paper` | Maroon on off-white — Texas State, the university it belongs to |

A section declares one of the two classes, and everything inside reads its
colour from the variables that class sets: four steps of text (`--ink-1` …
`--ink-4`), `--accent` / `--on-accent`, `--surface`, and `--seam-fade` for the
gradient that joins one section to the next. That is what lets a single
component — a button, a bento tile, a motif — render correctly on either ground
without knowing which one it is on.

Type sizes are tokens too (`--type-display`, `--type-statement`, …), re-cut for
phones in one media query rather than scaled down per component. Fonts come from
`next/font` in [app/layout.tsx](app/layout.tsx), self-hosted at build time —
three faces: Fraunces (display), Inter Tight (body), IBM Plex Mono (labels and
figures).

Component styles are **CSS Modules** colocated with their component. Tailwind v4
is installed and its tokens are bridged through `@theme inline`, but layout work
is done in the modules.

## Motion

Framer Motion, with a small set of reusable primitives so pages don't hand-roll
animation:

- **`Reveal`** — content rises into view once and stays put.
- **`LineRise`** — headline lines slide up out of a clip box, one after the next.
- **`Bento`** — a grid whose tiles converge from the outside in; one observer on
  the grid drives every tile through variants.
- **`SectionLabel`**, **`Motifs`** — the same variant-driven contract.
- **`Ridgeline`** — an anime.js-driven ridgeline plot used as a section ground.
  It never repeats and never ends.

Two rules hold throughout:

1. **One observer per group.** A parent watches the viewport and drives its
   children through variants; children never watch for themselves.
2. **Reduced motion must never hide anything.** `MotionProvider` sets
   `reducedMotion="user"` at the root so JS animations resolve instantly to
   their final state, and the CSS reveals are written so that an unopened mask
   still leaves text visible.

Anything seeded and random (the Ridgeline field) uses `mulberry32` from
[lib/random.ts](lib/random.ts), so server-rendered markup and the hydrated
client agree exactly.

## The header knows what it is sitting on

`Header` is fixed, and it flips between light and dark as you scroll. Sections
opt in by setting `data-header-theme="dark" | "light"`; the header samples which
of those sits under its own bottom edge on every scroll and restyles itself,
falling back to the route (`/` is dark, everything else light) when no section
claims it. `MobileCta` puts the join button in thumb reach through the middle of
the page on phones, staying out of the way at the top and bottom where the hero
and closing sections have their own.

## `lib/` — the things that must not drift

| File | What it holds |
| --- | --- |
| [lib/links.ts](lib/links.ts) | Every outbound URL: join form, Instagram, LinkedIn, AMSTAT, contact email |
| [lib/meeting.ts](lib/meeting.ts) | The meeting's day, time, place, cadence, and its Google Calendar link |
| [lib/asset.ts](lib/asset.ts) | Prefixes a `public/` path with the deployment base path |
| [lib/random.ts](lib/random.ts) | Seeded PRNG for hydration-safe generated artwork |

**Editing meeting details or a social link is a one-line change in `lib/`** —
never in a view. That is the whole point of the folder.

## Static export and the base path

Two consequences of `output: "export"` in
[next.config.ts](next.config.ts) shape the code:

**Images are unoptimized.** There is no server to resize on demand, so files in
`public/` are pre-sized to the box they render in, and originals stay in
`assets-source/` (see [its README](assets-source/README.md)).

**Everything lives under `/<repo>/` on GitHub Pages.** CI passes
`NEXT_PUBLIC_BASE_PATH` into the build; `next/link` and `next/image` prefix
themselves from it. But `images: { unoptimized: true }` makes `next/image` pass
`src` through untouched — so **any raw path into `public/` must go through
`asset()`**, or it 404s in production while working perfectly in dev. `dev` and
local builds leave the variable unset and stay at the root.

`trailingSlash: true` emits `/about/index.html` rather than `/about.html`, which
is what static hosts resolve without rewrite rules.

## Adding a page

1. `app/(site)/<route>/page.tsx` — server component exporting `metadata`,
   rendering the view.
2. `app/(site)/<route>/<Name>View.tsx` — `"use client"`, plus
   `<Name>View.module.css`.
3. Build it from `tone-pine` / `tone-paper` sections and the existing `ui/`
   primitives; add `data-header-theme` to any section the header must adapt to.
4. Add the route to `NAV_LINKS` in
   [components/layout/Header.tsx](components/layout/Header.tsx).

## Deployment

Pushing to `main` triggers
[.github/workflows/nextjs.yml](../.github/workflows/nextjs.yml): install with
`npm ci`, build with the Pages base path injected, upload `frontend/out/`,
deploy. Nothing is deployed from a laptop, and `out/` is not the source of
truth — it is a build artifact.
