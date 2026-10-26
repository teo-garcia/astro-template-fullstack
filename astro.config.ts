import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { visualizer } from 'rollup-plugin-visualizer'

const isVercel = process.env.VERCEL === '1'
const shouldAnalyze = process.env.ANALYZE === 'true'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000',
  integrations: [react(), sitemap()],
  adapter: isVercel ? vercel() : undefined,
  output: isVercel ? 'server' : 'static',
  server: {
    port: 3000,
  },
  vite: {
    plugins: [
      babel({
        include: /\.[jt]sx?$/,
        plugins: ['babel-plugin-react-compiler'],
      }),
      tailwindcss(),
      shouldAnalyze &&
        visualizer({
          brotliSize: true,
          filename: 'dist/analyze/stats.html',
          gzipSize: true,
          open: false,
        }),
    ],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
})
