import { COMPONENT_TYPE } from '../../utils/constants/component'
import { InputSearchAdapter } from './input-search.adapter'
import InputSearch from './input-search.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

InputSearch.install = (app: App, opt: InputSearchAdapter) => {
  setComponentConfig(COMPONENT_TYPE.inputSearch, opt)
  app.component(InputSearch.name, InputSearch)
}

export { InputSearch }
