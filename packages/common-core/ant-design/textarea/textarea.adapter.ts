import { TextAreaProps } from 'ant-design-vue/lib/input/inputProps'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type TextareaSlots = 'default'
export const textareaSlots = ['default']

export const TextareaBindsOmitKeys: (keyof TextareaAdapter)[] = []
export interface TextareaAdapter
  extends Partial<
    TextAreaProps & ElFormCtrlCommonAdapter<TextareaAdapter, TextareaOutput, TextareaSlots>
  > {
  modelValue?: string
}

export interface TextareaOutput {}

export const TEXTAREA_DEFAULT: TextareaAdapter = {}
