import { COMPONENT_TYPE } from '../../utils/constants/component'
import { DescriptionsAdapter } from './descriptions.adapter'
import Descriptions from './descriptions.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Descriptions.install = (app: App, opt: DescriptionsAdapter) => {
  setComponentConfig(COMPONENT_TYPE.descriptions, opt)
  app.component(Descriptions.name, Descriptions)
}

export { Descriptions }
