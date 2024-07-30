import { COMPONENT_TYPE } from '../../utils/constants/component'
import { FormAdapter } from './form.adapter'
import Form from './form.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Form.install = (app: App, opt: FormAdapter) => {
  setComponentConfig(COMPONENT_TYPE.form, opt)
  app.component(Form.name, Form)
}

export { Form }
