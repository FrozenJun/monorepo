import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CsAdapter } from './cs.adapter'
import Cs from './cs.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Cs.install = (app: App, opt: CsAdapter) => {
  setComponentConfig(COMPONENT_TYPE.cs, opt)
  app.component(Cs.name, Cs)
}

export { Cs }
