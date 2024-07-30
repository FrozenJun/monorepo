import { COMPONENT_TYPE } from '../../utils/constants/component'
import { SelectOptionAdapter } from './select-option.adapter'
import SelectOption from './select-option.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

SelectOption.install = (app: App, opt: SelectOptionAdapter) => {
  setComponentConfig(COMPONENT_TYPE.selectOption, opt)
  app.component(SelectOption.name, SelectOption)
}

export { SelectOption }
