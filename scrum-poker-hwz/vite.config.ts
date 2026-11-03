import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Leitet alle Requests auf /api an das Backend weiter (Express, Port 3000).
    // Im Client daher immer relativ fetchen: fetch('/api/sessions')
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
