import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Charity/',   // <— repo name
  plugins: [react()],
})
