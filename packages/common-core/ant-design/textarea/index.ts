import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TextareaAdapter } from './textarea.adapter'
import Textarea from './textarea.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Textarea.install = (app: App, opt: TextareaAdapter) => {
  setComponentConfig(COMPONENT_TYPE.textarea, opt)
  app.component(Textarea.name, Textarea)
}

export { Textarea }
