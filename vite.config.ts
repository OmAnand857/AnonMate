import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'e690-2409-40e5-11a7-a38b-7f42-75c0-4062-f7ec.ngrok-free.app'
    ]
  }
})
