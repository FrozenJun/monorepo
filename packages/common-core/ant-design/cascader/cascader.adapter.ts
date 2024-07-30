import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'
import { CascaderProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type CascaderSlots = 'expandIcon' | 'maxTagPlaceholder' | 'notFoundContent' | 'suffixIcon'
export const cascaderSlots = ['expandIcon', 'maxTagPlaceholder', 'notFoundContent', 'suffixIcon']

export const CascaderBindsOmitKeys: (keyof CascaderAdapter)[] = ['modelValue']
export interface CascaderAdapter
  extends Partial<
    CascaderProps & ElFormCtrlCommonAdapter<CascaderAdapter, CascaderOutput, CascaderSlots>
  > {
  modelValue?: string[] | number[]

  optionsAsync?: AsyncDataAdapter

  asyncSendMode?: 'dropdown' | 'modelChange' | 'none' | 'both'
}

export interface CascaderOutput {}

export const CASCADER_DEFAULT: CascaderAdapter = {
  asyncSendMode: 'both',
}
