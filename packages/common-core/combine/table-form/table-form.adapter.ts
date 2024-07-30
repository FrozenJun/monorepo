import { FormItemAdapter } from '../../ant-design/form-item/form-item.adapter'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type TableFormSlots = 'default'
export const tableFormSlots = ['default']

export const TableFormBindsOmitKeys: (keyof TableFormAdapter)[] = []
export interface TableFormAdapter
  extends Partial<ElFormCtrlCommonAdapter<TableFormAdapter, TableFormOutput, TableFormSlots>> {
  modelValue?: Record<string, any>[]
  dataSource?: Record<string, any>[]
  formItems?: FormItemAdapter[]

  min?: number
  max?: number
  sort?: boolean

  /**
   * table中每行的key，默认为id
   */
  rowKey?: string
}

export interface TableFormOutput {}

export const TABLE_FORM_DEFAULT: TableFormAdapter = {}
