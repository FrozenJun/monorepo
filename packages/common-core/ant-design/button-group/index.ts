import { COMPONENT_TYPE } from '../../utils/constants/component'
import { ButtonGroupAdapter } from './button-group.adapter'
import ButtonGroup from './button-group.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

ButtonGroup.install = (app: App, opt: ButtonGroupAdapter) => {
  setComponentConfig(COMPONENT_TYPE.buttonGroup, opt)
  app.component(ButtonGroup.name, ButtonGroup)
}

export { ButtonGroup }
