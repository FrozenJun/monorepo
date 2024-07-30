import { COMPONENT_TYPE } from '../../utils/constants/component'
import { SliderAdapter } from './slider.adapter'
import Slider from './slider.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

Slider.install = (app: App, opt: SliderAdapter) => {
  setComponentConfig(COMPONENT_TYPE.slider, opt)
  app.component(Slider.name, Slider)
}

export { Slider }
