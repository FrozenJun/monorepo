import { COMPONENT_TYPE } from '../../utils/constants/component'
import { RadioAdapter } from './radio.adapter'
import Radio from './radio.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Radio.install = (app: App, opt: RadioAdapter) => {
  setComponentConfig(COMPONENT_TYPE.radio, opt)
  app.component(Radio.name, Radio)
}

export { Radio }
