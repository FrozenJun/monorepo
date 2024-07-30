import { COMPONENT_TYPE } from '../../utils/constants/component'
import { NestedFormAdapter } from './nested-form.adapter'
import NestedForm from './nested-form.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

NestedForm.install = (app: App, opt: NestedFormAdapter) => {
  setComponentConfig(COMPONENT_TYPE.nestedForm, opt)
  app.component(NestedForm.name, NestedForm)
}

export { NestedForm }
