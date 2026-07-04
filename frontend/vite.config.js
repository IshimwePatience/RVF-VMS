import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rift-valley/',
  server: {
    proxy: {
      '/rvf-api': 'http://localhost:3001'
    }
  }
})
