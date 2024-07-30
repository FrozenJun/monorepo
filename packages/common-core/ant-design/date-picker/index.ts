import { COMPONENT_TYPE } from '../../utils/constants/component'
import { DatePickerAdapter } from './date-picker.adapter'
import DatePicker from './date-picker.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

DatePicker.install = (app: App, opt: DatePickerAdapter) => {
  setComponentConfig(COMPONENT_TYPE.datePicker, opt)
  app.component(DatePicker.name, DatePicker)
}

export { DatePicker }
