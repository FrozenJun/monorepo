import { COMPONENT_TYPE } from '../../utils/constants/component'
import { DescriptionsItemAdapter } from './descriptions-item.adapter'
import DescriptionsItem from './descriptions-item.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

DescriptionsItem.install = (app: App, opt: DescriptionsItemAdapter) => {
  setComponentConfig(COMPONENT_TYPE.descriptionsItem, opt)
  app.component(DescriptionsItem.name, DescriptionsItem)
}

export { DescriptionsItem }
