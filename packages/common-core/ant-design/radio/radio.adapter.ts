import { RadioProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type RadioSlots = 'default'
export const radioSlots = ['default']

export const RadioBindsOmitKeys: (keyof RadioAdapter)[] = []
export interface RadioAdapter
  extends Partial<RadioProps & ElFormCtrlCommonAdapter<RadioAdapter, RadioOutput, RadioSlots>> {
  modelValue?: boolean
}

export interface RadioOutput {}

export const RADIO_DEFAULT: RadioAdapter = {}
