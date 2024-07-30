import { TimeRangePickerProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'
import type { Dayjs } from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'

export type TimeRangePickerSlots = 'default'
export const timeRangePickerSlots = ['default']

export const TimeRangePickerBindsOmitKeys: (keyof TimeRangePickerAdapter)[] = ['modelValue']
export interface TimeRangePickerAdapter
  extends Partial<
    TimeRangePickerProps &
      ElFormCtrlCommonAdapter<TimeRangePickerAdapter, TimeRangePickerOutput, TimeRangePickerSlots>
  > {
  modelValue?: [Dayjs, Dayjs]
}

export interface TimeRangePickerOutput {}

export const TIME_RANGE_PICKER_DEFAULT: TimeRangePickerAdapter = {
  locale,
}
