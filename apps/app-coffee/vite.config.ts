import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://member.jiushengyuan.top', // 服务器
        // target: 'http://192.168.100.253:9999', // 服务器
        changeOrigin: true,
      },
    },
  },
})
