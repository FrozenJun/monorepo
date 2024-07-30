import { PaginationProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type PaginationSlots = 'buildOptionText' | 'itemRender'
export const paginationSlots = ['buildOptionText', 'itemRender']

export const PaginationBindsOmitKeys: (keyof PaginationAdapter)[] = []
export type PaginationAdapter = Partial<
  PaginationProps & ElCommonAdapter<PaginationAdapter, PaginationOutput, PaginationSlots>
>

export interface PaginationOutput {}

export const PAGINATION_DEFAULT: PaginationAdapter = {}
