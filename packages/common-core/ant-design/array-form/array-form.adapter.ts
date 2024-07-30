import { FormItemAdapter } from '../form-item/form-item.adapter'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type ArrayFormSlots = 'default'
export const arrayFormSlots = ['default']

export const ArrayFormBindsOmitKeys: (keyof ArrayFormAdapter)[] = ['modelValue']
export interface ArrayFormAdapter
  extends Partial<ElFormCtrlCommonAdapter<ArrayFormAdapter, ArrayFormOutput, ArrayFormSlots>> {
  modelValue?: Record<string, any>[]

  formItems?: FormItemAdapter[]
  models?: Record<string, any>

  min?: number
  max?: number
  sort?: boolean

  // 国际化按钮名称
  locale?: {
    more: string
  }
}

export interface ArrayFormOutput {}

export const ARRAY_FORM_DEFAULT: ArrayFormAdapter = {}
