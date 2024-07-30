import { TableProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type TableSlots =
  | 'bodyCell'
  | 'customFilterDropdown'
  | 'customFilterIcon'
  | 'emptyText'
  | 'headerCell'
  | 'summary'
  | 'title'
export const tableSlots = [
  'bodyCell',
  'customFilterDropdown',
  'customFilterIcon',
  'emptyText',
  'headerCell',
  'summary',
  'title',
]

export const TableBindsOmitKeys: (keyof TableAdapter)[] = []
export interface TableAdapter extends Partial<
  TableProps & ElCommonAdapter<TableAdapter, TableOutput, TableSlots>
> {}

export interface TableOutput {}

export const TABLE_DEFAULT: TableAdapter = {}
