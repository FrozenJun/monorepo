import { COMPONENT_TYPE } from '../../utils/constants/component'
import { PopconfirmAdapter } from './popconfirm.adapter'
import Popconfirm from './popconfirm.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Popconfirm.install = (app: App, opt: PopconfirmAdapter) => {
  setComponentConfig(COMPONENT_TYPE.popconfirm, opt)
  app.component(Popconfirm.name, Popconfirm)
}

export { Popconfirm }
