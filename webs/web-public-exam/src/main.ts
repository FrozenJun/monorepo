import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'common-core/utils/lodash'
import 'ant-design-vue/dist/antd.variable.css'
import '@/styles/index.scss'
import App from './App.vue'
import Antd from 'ant-design-vue'
import '@/config/http.config'
import cvue from 'common-core/index'
import { cvueOpt } from '@/config/core.config'
import 'virtual:uno.css'
import { flexible } from 'common-shared'
import router from './router'

flexible(window)
const app = createApp(App)
app.use(Antd).use(createPinia()).use(cvue, cvueOpt).use(router).mount('#app')

export default app
