import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Multi-page static site. The two HTML files at the repo root are the entry points;
// everything in public/ (site.css, config.js, images, videos, robots/sitemap) is served
// from the root unchanged, so the existing root-absolute references (/site.css, /images/...,
// /videos/...) keep resolving exactly as they did on the old static setup.
export default defineConfig({
  // Pin the root explicitly so the build can never wander up into a parent directory.
  root: resolve(import.meta.dirname),
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        inventory: resolve(import.meta.dirname, 'inventory.html'),
      },
    },
  },
})
