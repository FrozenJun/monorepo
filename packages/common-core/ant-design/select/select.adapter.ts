import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'
import { SelectProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type SelectSlots =
  | 'clearIcon'
  | 'dropdownRender'
  | 'maxTagPlaceholder'
  | 'menuItemSelectedIcon'
  | 'notFoundContent'
  | 'option'
  | 'placeholder'
  | 'removeIcon'
  | 'suffixIcon'
  | 'tagRender'
export const selectSlots = [
  'clearIcon',
  'dropdownRender',
  'maxTagPlaceholder',
  'menuItemSelectedIcon',
  'notFoundContent',
  'option',
  'placeholder',
  'removeIcon',
  'suffixIcon',
  'tagRender',
]

export const SelectBindsOmitKeys: (keyof SelectAdapter)[] = ['modelValue']
export interface SelectAdapter
  extends Partial<SelectProps & ElFormCtrlCommonAdapter<SelectAdapter, SelectOutput, SelectSlots>> {
  modelValue?: string | string[] | number | number[]

  optionsAsync?: AsyncDataAdapter

  useCustomValue?: boolean

  customValueType?: string
}

export interface SelectOutput {}

export const SELECT_DEFAULT: SelectAdapter = {
  modelValue: undefined,
}
