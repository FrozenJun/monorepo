import { COMPONENT_TYPE } from '../../utils/constants/component'
import { ButtonAdapter } from './button.adapter'
import Button from './button.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Button.install = (app: App, opt: ButtonAdapter) => {
  setComponentConfig(COMPONENT_TYPE.button, opt)
  app.component(Button.name, Button)
}

export { Button }
