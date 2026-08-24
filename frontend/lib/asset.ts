/**
 * Prefixes a path in public/ with the deployment's base path.
 *
 * next/link and most of next/image handle this themselves, but `images:
 * { unoptimized: true }` — which a static export requires — makes next/image
 * pass `src` straight through without the prefix. On GitHub Pages, where the
 * site lives under /<repo>/, an unprefixed "/logo.png" is a 404.
 *
 * Reads the same variable next.config.ts does. NEXT_PUBLIC_ so the value is
 * inlined into the client bundle rather than read at runtime, where it would
 * not exist.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function asset(path: string) {
  return `${basePath}${path}`;
}
