import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'
import { TreeSelectProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type TreeSelectSlots =
  | 'maxTagPlaceholder'
  | 'placeholder'
  | 'searchPlaceholder'
  | 'suffixIcon'
  | 'tagRender'
  | 'title'
export const treeSelectSlots = [
  'maxTagPlaceholder',
  'placeholder',
  'searchPlaceholder',
  'suffixIcon',
  'tagRender',
  'title',
]

export const TreeSelectBindsOmitKeys: (keyof TreeSelectAdapter)[] = []
export interface TreeSelectAdapter
  extends Partial<
    TreeSelectProps & ElFormCtrlCommonAdapter<TreeSelectAdapter, TreeSelectOutput, TreeSelectSlots>
  > {
  modelValue?: string[] | string

  treeDataAsync?: AsyncDataAdapter
}

export interface TreeSelectOutput {}

export const TREE_SELECT_DEFAULT: TreeSelectAdapter = {}
