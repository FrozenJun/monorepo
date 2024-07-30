import { CheckboxGroupProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type CheckboxGroupSlots = 'default'
export const checkboxGroupSlots = ['default']

export const CheckboxGroupBindsOmitKeys: (keyof CheckboxGroupAdapter)[] = []
export interface CheckboxGroupAdapter
  extends Partial<
    CheckboxGroupProps &
      ElFormCtrlCommonAdapter<CheckboxGroupAdapter, CheckboxGroupOutput, CheckboxGroupSlots>
  > {
  modelValue?: string[]
}

export interface CheckboxGroupOutput {}

export const CHECKBOX_GROUP_DEFAULT: CheckboxGroupAdapter = {}
