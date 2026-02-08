
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, // Enforce port 3000 to match standard redirect URLs
    strictPort: false, // If 3000 is taken, it will try 3001, but we prefer 3000
  }
})
