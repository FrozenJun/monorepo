import { createSSRApp } from 'vue'
import App from './App.vue'
import '@/app/config/http.config'
import { createPinia } from 'pinia'
import '@/app/style/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return {
    app,
  }
}
