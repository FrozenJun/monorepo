import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TimePickerAdapter } from './time-picker.adapter'
import TimePicker from './time-picker.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

TimePicker.install = (app: App, opt: TimePickerAdapter) => {
  setComponentConfig(COMPONENT_TYPE.timePicker, opt)
  app.component(TimePicker.name, TimePicker)
}

export { TimePicker }
