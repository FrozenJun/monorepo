import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TableAdapter } from './table.adapter'
import Table from './table.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Table.install = (app: App, opt: TableAdapter) => {
  setComponentConfig(COMPONENT_TYPE.table, opt)
  app.component(Table.name, Table)
}

export { Table }
