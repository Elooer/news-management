import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ali.testops.top:9200',
        // target: 'http://localhost:9200',
        changeOrigin: true,
        rewrite: (path: string) => {
          // console.log('http://ali.testops.top:9199' + path.replace(/^\/api/, ''));
          return path.replace(/^\/api/, '')
        },
      },
    },
  },
})
