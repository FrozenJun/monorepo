import { COMPONENT_TYPE } from '../../utils/constants/component'
import { CheckboxGroupAdapter } from './checkbox-group.adapter'
import CheckboxGroup from './checkbox-group.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

CheckboxGroup.install = (app: App, opt: CheckboxGroupAdapter) => {
  setComponentConfig(COMPONENT_TYPE.checkboxGroup, opt)
  app.component(CheckboxGroup.name, CheckboxGroup)
}

export { CheckboxGroup }
