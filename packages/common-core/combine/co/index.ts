import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CoAdapter } from './co.adapter'
import Co from './co.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Co.install = (app: App, opt: CoAdapter) => {
  setComponentConfig(COMPONENT_TYPE.co, opt)
  app.component(Co.name, Co)
}

export { Co }
