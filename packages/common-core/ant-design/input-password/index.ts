import { COMPONENT_TYPE } from '../../utils/constants/component'
import { InputPasswordAdapter } from './input-password.adapter'
import InputPassword from './input-password.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

InputPassword.install = (app: App, opt: InputPasswordAdapter) => {
  setComponentConfig(COMPONENT_TYPE.inputPassword, opt)
  app.component(InputPassword.name, InputPassword)
}

export { InputPassword }
