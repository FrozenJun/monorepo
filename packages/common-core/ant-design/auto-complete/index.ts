import { COMPONENT_TYPE } from '../../utils/constants/component'
import { AutoCompleteAdapter } from './auto-complete.adapter'
import AutoComplete from './auto-complete.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

AutoComplete.install = (app: App, opt: AutoCompleteAdapter) => {
  setComponentConfig(COMPONENT_TYPE.autoComplete, opt)
  app.component(AutoComplete.name, AutoComplete)
}

export { AutoComplete }
