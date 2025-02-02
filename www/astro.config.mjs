// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import robotsTxt from "astro-robots-txt";

import sitemap from "astro-sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://link-shortener.jfa.dev/",
  adapter: cloudflare({
    imageService: "passthrough",
  }),

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ["path"].map((i) => `node:${i}`),
    },
  },

  integrations: [
    robotsTxt({
      host: "link-shortener.jfa.dev",
      sitemap: ["https://link-shortener.jfa.dev/sitemap-index.xml"],
      policy: [
        {
          userAgent: "*",
          allow: "/",
          crawlDelay: 10,
        },
      ],
    }),
    sitemap(),
    mdx(),
  ],
});
