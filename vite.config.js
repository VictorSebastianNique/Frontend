import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para GitHub Pages en el repo "Frontend"
export default defineConfig({
  plugins: [react()],
  base: '/Frontend/', 
})
