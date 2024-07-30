import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CheckboxAdapter } from './checkbox.adapter'
import Checkbox from './checkbox.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Checkbox.install = (app: App, opt: CheckboxAdapter) => {
  setComponentConfig(COMPONENT_TYPE.checkbox, opt)
  app.component(Checkbox.name, Checkbox)
}

export { Checkbox }
