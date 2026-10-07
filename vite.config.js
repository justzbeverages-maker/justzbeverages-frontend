import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [react(), imagetools()],
  // Pins an empty PostCSS config so Vite never picks up a stray postcss.config.js from a parent folder.
  css: { postcss: { plugins: [] } },
})