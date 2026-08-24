import type { NextConfig } from "next";

/*
   GitHub Pages serves a project repository from https://<user>.github.io/<repo>/,
   so every asset and route needs that prefix — but only there. The CI build
   passes it in from the Pages configuration step; `npm run dev` and any local
   build leave it unset and stay at the root.

   Normalised because the value arrives from an external step: a bare "/" and a
   trailing slash both mean "no prefix" to us, and Next rejects either as a
   basePath.
*/
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");

const nextConfig: NextConfig = {
  /* Empty in dev and under a custom domain; "/ASA-Website-TXST" on Pages.
     next/image and next/link prefix themselves off these, which is why the
     three logo/photo references in the app need no change. */
  basePath,
  assetPrefix: basePath,

  /* Shipped as a static site: `next build` emits an `out/` folder that any
     static host can serve. */
  output: "export",

  /* No server, so there is nothing to optimise images on demand. Everything
     in public/ is pre-sized to the box it renders in instead. */
  images: {
    unoptimized: true,
  },

  /* Emit `/about/index.html` rather than `/about.html`, which is what static
     hosts resolve correctly without rewrite rules. */
  trailingSlash: true,
};

export default nextConfig;
