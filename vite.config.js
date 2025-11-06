import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.MAIN_SERVICE_BASE_URL': JSON.stringify(env.MAIN_SERVICE_BASE_URL),
      'import.meta.env.USE_MOCK': JSON.stringify(env.USE_MOCK),
    },
  }
})
