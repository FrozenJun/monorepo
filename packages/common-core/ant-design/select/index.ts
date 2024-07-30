import { COMPONENT_TYPE } from '../../utils/constants/component'
import { SelectAdapter } from './select.adapter'
import Select from './select.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Select.install = (app: App, opt: SelectAdapter) => {
  setComponentConfig(COMPONENT_TYPE.select, opt)
  app.component(Select.name, Select)
}

export { Select }
