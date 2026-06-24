import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure the automatic JSX runtime is used everywhere, including Vitest transforms.
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy vendors so the initial bundle stays lean.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase') || id.includes('@firebase')) return 'firebase'
            if (id.includes('react-big-calendar') || id.includes('date-fns')) return 'calendar'
            if (
              id.includes('react-router') ||
              id.includes('@tanstack') ||
              id.includes('/react/') ||
              id.includes('/react-dom/')
            ) {
              return 'vendor'
            }
          }
          return undefined
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
    // Playwright lives under src/tests/e2e and must not be run by Vitest
    exclude: ['**/node_modules/**', '**/dist/**', 'src/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/services/**', 'src/store/**', 'src/utils/**', 'src/hooks/**'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/tests/**'],
    },
  },
})
