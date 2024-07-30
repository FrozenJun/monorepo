import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CascaderAdapter } from './cascader.adapter'
import Cascader from './cascader.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Cascader.install = (app: App, opt: CascaderAdapter) => {
  setComponentConfig(COMPONENT_TYPE.cascader, opt)
  app.component(Cascader.name, Cascader)
}

export { Cascader }
