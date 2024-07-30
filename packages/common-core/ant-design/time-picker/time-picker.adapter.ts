import { TimePickerProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'
import type { Dayjs } from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

export type TimePickerSlots = 'default'
export const timePickerSlots = ['default']

export const TimePickerBindsOmitKeys: (keyof TimePickerAdapter)[] = []
export interface TimePickerAdapter
  extends Partial<
    TimePickerProps & ElFormCtrlCommonAdapter<TimePickerAdapter, TimePickerOutput, TimePickerSlots>
  > {
  modelValue?: Dayjs
}

export interface TimePickerOutput {}

export const TIME_PICKER_DEFAULT: TimePickerAdapter = {
  locale,
}
