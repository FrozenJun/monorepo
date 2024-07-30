import { FormItemAdapter } from '../../ant-design/form-item/form-item.adapter'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type NestedFormSlots = 'default'
export const nestedFormSlots = ['default']

export const NestedFormBindsOmitKeys: (keyof NestedFormAdapter)[] = []
export interface NestedFormAdapter
  extends Partial<ElFormCtrlCommonAdapter<NestedFormAdapter, NestedFormOutput, NestedFormSlots>> {
  /**
   * 参数同table-form
   */
  modelValue?: Record<string, any>[]

  formItems?: FormItemAdapter[]

  min?: number
  max?: number
  sort?: boolean

  /**
   * table中每行的key，默认为id
   */
  rowKey?: string
  onChange?: (value: Record<string, any>[]) => void
}

export interface NestedFormOutput {}

export const NESTED_FORM_DEFAULT: NestedFormAdapter = {}
