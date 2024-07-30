import { InputProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type InputSlots = 'addonAfter' | 'addonBefore' | 'prefix' | 'suffix'
export const inputSlots = ['addonAfter', 'addonBefore', 'prefix', 'suffix']

export const InputBindsOmitKeys: (keyof InputAdapter)[] = ['modelValue']
export interface InputAdapter
  extends Partial<InputProps & ElFormCtrlCommonAdapter<InputAdapter, InputOutput, InputSlots>> {
  modelValue?: string
}

export interface InputOutput {
  focus(): unknown
  blur(): unknown
  select(): unknown
}

export const INPUT_DEFAULT: InputAdapter = {}
