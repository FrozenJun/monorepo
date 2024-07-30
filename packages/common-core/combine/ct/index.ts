import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CtAdapter } from './ct.adapter'
import Ct from './ct.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Ct.install = (app: App, opt: CtAdapter) => {
  setComponentConfig(COMPONENT_TYPE.ct, opt)
  app.component(Ct.name, Ct)
}

export { Ct }
