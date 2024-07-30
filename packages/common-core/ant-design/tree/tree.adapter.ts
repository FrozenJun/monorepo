import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'
import { TreeProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type TreeSlots = 'default' | 'title'
export const treeSlots = ['default', 'title']

export const TreeBindsOmitKeys: (keyof TreeAdapter)[] = [
  'checkedKeys',
  'selectedKeys',
  'expandedKeys',
]
export interface TreeAdapter
  extends Partial<TreeProps & ElCommonAdapter<TreeAdapter, TreeOutput, TreeSlots>> {
  treeDataAsync?: AsyncDataAdapter
  checkedKeysAsync?: AsyncDataAdapter
}

export interface TreeOutput {}

export const TREE_DEFAULT: TreeAdapter = {}
