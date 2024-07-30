import { InputProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type InputSearchSlots = 'addonAfter' | 'addonBefore' | 'prefix' | 'suffix' | 'enterButton'
export const inputSearchSlots = ['addonAfter', 'addonBefore', 'prefix', 'suffix', 'enterButton']

export const InputSearchBindsOmitKeys: (keyof InputSearchAdapter)[] = []
export interface InputSearchAdapter
  extends Partial<
    InputProps & ElFormCtrlCommonAdapter<InputSearchAdapter, InputSearchOutput, InputSearchSlots>
  > {
  modelValue?: string

  /**
   * 	ant组件属性 - 是否有确认按钮，可设为按钮文字。该属性会与 addon 冲突。
   */
  enterButton?: boolean
}

export interface InputSearchOutput {}

export const INPUT_SEARCH_DEFAULT: InputSearchAdapter = {}
