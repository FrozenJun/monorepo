import { COMPONENT_TYPE } from '../../utils/constants/component'
import { RangePickerAdapter } from './range-picker.adapter'
import RangePicker from './range-picker.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

RangePicker.install = (app: App, opt: RangePickerAdapter) => {
  setComponentConfig(COMPONENT_TYPE.rangePicker, opt)
  app.component(RangePicker.name, RangePicker)
}

export { RangePicker }
