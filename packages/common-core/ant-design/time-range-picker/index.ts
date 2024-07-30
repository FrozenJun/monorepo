import { COMPONENT_TYPE } from '../../utils/constants/component'
import { TimeRangePickerAdapter } from './time-range-picker.adapter'
import TimeRangePicker from './time-range-picker.vue'
import { App } from 'vue'
import { setComponentConfig } from '../../utils/config'

TimeRangePicker.install = (app: App, opt: TimeRangePickerAdapter) => {
  setComponentConfig(COMPONENT_TYPE.timeRangePicker, opt)
  app.component(TimeRangePicker.name, TimeRangePicker)
}

export { TimeRangePicker }
