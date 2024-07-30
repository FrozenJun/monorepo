import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CmfAdapter } from './cmf.adapter'
import Cmf from './cmf.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Cmf.install = (app: App, opt: CmfAdapter) => {
  setComponentConfig(COMPONENT_TYPE.cmf, opt)
  app.component(Cmf.name, Cmf)
}

export { Cmf }
