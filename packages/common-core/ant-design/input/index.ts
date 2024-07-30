import { COMPONENT_TYPE } from '../../utils/constants/component'
import { InputAdapter } from './input.adapter'
import Input from './input.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Input.install = (app: App, opt: InputAdapter) => {
  setComponentConfig(COMPONENT_TYPE.input, opt)
  app.component(Input.name, Input)
}

export { Input }
