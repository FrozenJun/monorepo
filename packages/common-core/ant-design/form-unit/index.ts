import { COMPONENT_TYPE } from '../../utils/constants/component'
import { FormUnitAdapter } from './form-unit.adapter'
import FormUnit from './form-unit.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

FormUnit.install = (app: App, opt: FormUnitAdapter) => {
  setComponentConfig(COMPONENT_TYPE.formUnit, opt)
  app.component(FormUnit.name, FormUnit)
}

export { FormUnit }
