import { CommonProps, DatePickerProps } from 'ant-design-vue/lib/date-picker/generatePicker/props'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'
import type { Dayjs } from 'dayjs'

export type DatePickerSlots =
  | 'dateRender'
  | 'prevIcon'
  | 'nextIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'renderExtraFooter'
  | 'monthCellRender'
export const datePickerSlots = [
  'dateRender',
  'prevIcon',
  'nextIcon',
  'superNextIcon',
  'superPrevIcon',
  'renderExtraFooter',
  'monthCellRender',
]

export const DatePickerBindsOmitKeys: (keyof DatePickerAdapter)[] = []
export interface DatePickerAdapter
  extends Partial<
    CommonProps<any> &
      DatePickerProps<any> &
      ElFormCtrlCommonAdapter<DatePickerAdapter, DatePickerOutput, DatePickerSlots>
  > {
  modelValue?: string | Dayjs
}

export interface DatePickerOutput {}

export const DATE_PICKER_DEFAULT: DatePickerAdapter = {
}
