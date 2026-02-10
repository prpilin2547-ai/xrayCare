import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), VueDevtools()],
  server: {
    port: 5173,
    host: '0.0.0.0', // use local IP: open http://<your-local-ip>:5173 from this machine or others on LAN
    strictPort: false,
    proxy: {
      '/api/Xraycare': {
        target: 'http://localhost:8001', // xraycare API server
        changeOrigin: true,
        secure: false
      }
    }
  }

})