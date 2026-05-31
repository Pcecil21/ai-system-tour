import { defineConfig } from 'vitest/config'

// Guards and other motion helpers probe browser APIs (matchMedia, canvas, navigator),
// so tests run in a jsdom environment rather than bare Node.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
  },
})
