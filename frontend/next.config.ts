import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
