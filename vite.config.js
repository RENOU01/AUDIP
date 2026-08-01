import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: "base" debe coincidir con el nombre de tu repositorio de GitHub.
// Tu repo se llama "AUDIP", así que se publica en
// https://renou01.github.io/AUDIP/
export default defineConfig({
  plugins: [react()],
  base: '/AUDIP/',
})
