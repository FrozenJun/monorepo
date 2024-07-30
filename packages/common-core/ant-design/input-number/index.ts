import { COMPONENT_TYPE } from '../../utils/constants/component'
import { InputNumberAdapter } from './input-number.adapter'
import InputNumber from './input-number.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

InputNumber.install = (app: App, opt: InputNumberAdapter) => {
  setComponentConfig(COMPONENT_TYPE.inputNumber, opt)
  app.component(InputNumber.name, InputNumber)
}

export { InputNumber }
