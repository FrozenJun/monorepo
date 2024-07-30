import { InputNumberProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type InputNumberSlots = 'addonAfter' | 'addonBefore' | 'prefix'
export const inputNumberSlots = ['addonAfter', 'addonBefore', 'prefix']

export const InputNumberBindsOmitKeys: (keyof InputNumberAdapter)[] = []
export interface InputNumberAdapter
  extends Partial<
    InputNumberProps &
      ElFormCtrlCommonAdapter<InputNumberAdapter, InputNumberOutput, InputNumberSlots>
  > {
  modelValue?: number
}

export interface InputNumberOutput {}

export const INPUT_NUMBER_DEFAULT: InputNumberAdapter = {}
