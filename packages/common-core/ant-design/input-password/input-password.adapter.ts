import { InputProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type InputPasswordSlots = 'default'
export const inputPasswordSlots = ['default']

export const InputPasswordBindsOmitKeys: (keyof InputPasswordAdapter)[] = ['modelValue']
export interface InputPasswordAdapter
  extends Partial<
    InputProps & ElCommonAdapter<InputPasswordAdapter, InputPasswordOutput, InputPasswordSlots>
  > {
  modelValue?: string

  /**
   * 官方属性
   */
  visibilityToggle?: boolean
}

export interface InputPasswordOutput {}

export const INPUT_PASSWORD_DEFAULT: InputPasswordAdapter = {}
