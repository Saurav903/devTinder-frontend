import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendTarget = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:7777'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/signup': backendTarget,
      '/login': backendTarget,
      '/logout': backendTarget,
      '/profile': backendTarget,
      '/request': backendTarget,
      '/user': backendTarget,
      '/feed': backendTarget,
    },
  },
})
