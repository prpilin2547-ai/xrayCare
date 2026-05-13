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
      // สองแบบ: บางเบราว์เซอร์/ลิงก์อาจใช้ path เป็นตัวพิมพ์เล็ก — ถ้าไม่ตรง proxy จะได้ 404 จาก Vite
      '/api/Xraycare': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false
      },
      '/api/xraycare': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false
      }
    }
  }

})