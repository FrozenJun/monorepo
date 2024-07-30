import { COMPONENT_TYPE } from '../../utils/constants/component'
import { ArrayFormAdapter } from './array-form.adapter'
import ArrayForm from './array-form.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

ArrayForm.install = (app: App, opt: ArrayFormAdapter) => {
  setComponentConfig(COMPONENT_TYPE.arrayForm, opt)
  app.component(ArrayForm.name, ArrayForm)
}

export { ArrayForm }
