import { COMPONENT_TYPE } from '../../utils/constants/component'
import { SwitchAdapter } from './switch.adapter'
import Switch from './switch.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Switch.install = (app: App, opt: SwitchAdapter) => {
  setComponentConfig(COMPONENT_TYPE.switch, opt)
  app.component(Switch.name, Switch)
}

export { Switch }
