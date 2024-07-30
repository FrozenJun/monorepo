import { COMPONENT_TYPE } from '../../utils/constants/component'
import { FormItemAdapter } from './form-item.adapter'
import FormItem from './form-item.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

FormItem.install = (app: App, opt: FormItemAdapter) => {
  setComponentConfig(COMPONENT_TYPE.formItem, opt)
  app.component(FormItem.name, FormItem)
}

export { FormItem }
