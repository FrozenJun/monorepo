import { COMPONENT_TYPE } from '../../utils/constants/component'
import { FormGroupAdapter } from './form-group.adapter'
import FormGroup from './form-group.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

FormGroup.install = (app: App, opt: FormGroupAdapter) => {
  setComponentConfig(COMPONENT_TYPE.formGroup, opt)
  app.component(FormGroup.name, FormGroup)
}

export { FormGroup }
