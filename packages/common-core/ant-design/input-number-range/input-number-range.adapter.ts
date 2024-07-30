import { InputNumberAdapter } from '../input-number/input-number.adapter'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type InputNumberRangeSlots = 'default'
export const inputNumberRangeSlots = ['default']

export const InputNumberRangeBindsOmitKeys: (keyof InputNumberRangeAdapter)[] = ['modelValue']
export interface InputNumberRangeAdapter
  extends Partial<
    ElFormCtrlCommonAdapter<InputNumberRangeAdapter, InputNumberRangeOutput, InputNumberRangeSlots>
  > {
  modelValue?: number[] | string[]

  startInputNumber?: InputNumberAdapter
  endInputNumber?: InputNumberAdapter
}

export interface InputNumberRangeOutput {}

export const INPUT_NUMBER_RANGE_DEFAULT: InputNumberRangeAdapter = {
  startInputNumber: {
    min: 0,
  },
  endInputNumber: {
    min: 0,
  },
}
