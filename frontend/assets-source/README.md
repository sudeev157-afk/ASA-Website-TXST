# Source assets

Original, full-resolution assets. **Nothing in this folder is shipped** — it
sits outside `public/`, so `next build` does not copy it into `out/`.

Files in `public/` are the delivery copies, pre-sized to the box they render
in, because `output: "export"` means there is no server to optimise images on
demand.

| Source | Delivered as | Why |
| --- | --- | --- |
| `default_except_landing.png` (5.8 MB, 2752×1536) | `public/hero-placeholder.jpg` (210 KB, 1800×1004) | Placeholder hero art. Renders at ~45vw, so 1800px covers a 2× display. |
| `Video_Backfround.mp4` (33 MB) | — not used — | The hero background is now an SVG scatter plot and its least-squares fit (see `app/landing/landing.tsx`), which is a few KB and needs no decode. |

`public/Logo_ASA_transparent.png` is the 1254px master of the ASA seal and is
left in place untouched. `public/Logo_ASA_transparent-256.png` is the same
artwork resized for the 76px header — no recolouring, cropping, or filtering.

## Restoring anything

Every file here is tracked in git, so a move back is all it takes:

```sh
git mv assets-source/Video_Backfround.mp4 public/
```

If the video comes back, transcode it first — 33 MB is roughly 150× the weight
of everything else on the page combined. Target an H.264/VP9 pair around
2–4 MB at 1080p, add a `poster` still, and keep it off the mobile breakpoint.
