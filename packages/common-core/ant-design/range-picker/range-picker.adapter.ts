import { CommonProps, RangePickerProps } from 'ant-design-vue/lib/date-picker/generatePicker/props'
import { ElCommonAdapter } from '../../utils/dtos'
import type { Dayjs } from 'dayjs'

export type RangePickerSlots =
  | 'dateRender'
  | 'prevIcon'
  | 'nextIcon'
  | 'superNextIcon'
  | 'superPrevIcon'
  | 'renderExtraFooter'
  | 'dateRender'
  | 'separator'
export const rangePickerSlots = [
  'dateRender',
  'prevIcon',
  'nextIcon',
  'superNextIcon',
  'superPrevIcon',
  'renderExtraFooter',
  'dateRender',
  'separator',
]

export const RangePickerBindsOmitKeys: (keyof RangePickerAdapter)[] = ['modelValue']
export interface RangePickerAdapter
  extends Partial<
    CommonProps<any> &
      RangePickerProps<any> &
      ElCommonAdapter<RangePickerAdapter, RangePickerOutput, RangePickerSlots>
  > {
  modelValue?: [string, string] | [Dayjs, Dayjs]
}

export interface RangePickerOutput {}

export const RANGE_PICKER_DEFAULT: RangePickerAdapter = {}
