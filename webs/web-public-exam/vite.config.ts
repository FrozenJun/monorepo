import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unocss()],
  build: {
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
