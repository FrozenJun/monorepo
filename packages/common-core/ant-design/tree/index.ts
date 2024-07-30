import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TreeAdapter } from './tree.adapter'
import Tree from './tree.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Tree.install = (app: App, opt: TreeAdapter) => {
  setComponentConfig(COMPONENT_TYPE.tree, opt)
  app.component(Tree.name, Tree)
}

export { Tree }
