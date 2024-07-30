import { COMPONENT_TYPE } from '../../utils/constants/component'
import { RadioGroupAdapter } from './radio-group.adapter'
import RadioGroup from './radio-group.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

RadioGroup.install = (app: App, opt: RadioGroupAdapter) => {
  setComponentConfig(COMPONENT_TYPE.radioGroup, opt)
  app.component(RadioGroup.name, RadioGroup)
}

export { RadioGroup }
