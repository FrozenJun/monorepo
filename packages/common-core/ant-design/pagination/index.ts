import { COMPONENT_TYPE } from '../../utils/constants/component'
import { PaginationAdapter } from './pagination.adapter'
import Pagination from './pagination.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Pagination.install = (app: App, opt: PaginationAdapter) => {
  setComponentConfig(COMPONENT_TYPE.pagination, opt)
  app.component(Pagination.name, Pagination)
}

export { Pagination }
