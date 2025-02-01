// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";
import sitemap from "astro-sitemap";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
const compilerConfig = {
  target: "19",
};

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://shortener.jfa.ovh",
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
    sitemap(),
    robotsTxt({
      host: "shortener.jfa.ovh",
      sitemap: ["https://shortener.jfa.ovh/sitemap-index.xml"],
      policy: [
        {
          userAgent: "*",
          allow: "/",
          crawlDelay: 10,
        },
      ],
    }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", compilerConfig]],
      },
    }),
  ],
});
