import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TableFormAdapter } from './table-form.adapter'
import TableForm from './table-form.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

TableForm.install = (app: App, opt: TableFormAdapter) => {
  setComponentConfig(COMPONENT_TYPE.tableForm, opt)
  app.component(TableForm.name, TableForm)
}

export { TableForm }
