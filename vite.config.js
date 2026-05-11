import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev proxy: forward /bff/* to local BFF to avoid CORS and keep frontend calls simple
      '/bff': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
