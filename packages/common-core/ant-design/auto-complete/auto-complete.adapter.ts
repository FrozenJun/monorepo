import { AutoCompleteProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type AutoCompleteSlots = 'default' | 'option'
export const autoCompleteSlots = ['default', 'option']

export const AutoCompleteBindsOmitKeys: (keyof AutoCompleteAdapter)[] = ['modelValue']
export interface AutoCompleteAdapter
  extends Partial<
    AutoCompleteProps &
      ElFormCtrlCommonAdapter<AutoCompleteAdapter, AutoCompleteOutput, AutoCompleteSlots>
  > {
  modelValue?: string
}

export interface AutoCompleteOutput {}

export const AUTO_COMPLETE_DEFAULT: AutoCompleteAdapter = {}
