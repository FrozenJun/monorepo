import { COMPONENT_TYPE } from '../../utils/constants/component'
import { InputNumberRangeAdapter } from './input-number-range.adapter'
import InputNumberRange from './input-number-range.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

InputNumberRange.install = (app: App, opt: InputNumberRangeAdapter) => {
  setComponentConfig(COMPONENT_TYPE.inputNumberRange, opt)
  app.component(InputNumberRange.name, InputNumberRange)
}

export { InputNumberRange }
