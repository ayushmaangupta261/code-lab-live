import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  optimizeDeps: {
    include: ["xterm"],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // allows using @/ for src
    },
  },
})
