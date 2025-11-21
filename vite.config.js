import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), VueDevtools()],
  server: {
    port: 5173,
    proxy: {
      '/api/Xraycare': {
        target: 'http://localhost:8001', // xraycare API server
        changeOrigin: true,
        secure: false
      }
    }
  }

})