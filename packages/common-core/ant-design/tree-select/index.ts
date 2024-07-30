import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TreeSelectAdapter } from './tree-select.adapter'
import TreeSelect from './tree-select.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

TreeSelect.install = (app: App, opt: TreeSelectAdapter) => {
  setComponentConfig(COMPONENT_TYPE.treeSelect, opt)
  app.component(TreeSelect.name, TreeSelect)
}

export { TreeSelect }
