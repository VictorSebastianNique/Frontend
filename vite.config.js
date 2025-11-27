import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración para Producción (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: '/Frontend/',  // <--- ESTA LÍNEA ES OBLIGATORIA EN GITHUB
})
