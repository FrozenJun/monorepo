import { COMPONENT_TYPE } from '../../utils/constants/component'
import { ImageAdapter } from './image.adapter'
import Image from './image.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Image.install = (app: App, opt: ImageAdapter) => {
  setComponentConfig(COMPONENT_TYPE.image, opt)
  app.component(Image.name, Image)
}

export { Image }
