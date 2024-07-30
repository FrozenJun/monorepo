import { CheckboxProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type CheckboxSlots = 'default'
export const checkboxSlots = ['default']

export const CheckboxBindsOmitKeys: (keyof CheckboxAdapter)[] = []
export interface CheckboxAdapter
  extends Partial<
    CheckboxProps & ElFormCtrlCommonAdapter<CheckboxAdapter, CheckboxOutput, CheckboxSlots>
  > {
  modelValue?: boolean
}

export interface CheckboxOutput {}

export const CHECKBOX_DEFAULT: CheckboxAdapter = {}
