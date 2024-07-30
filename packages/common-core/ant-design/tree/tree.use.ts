import { TreeAdapter } from './tree.adapter'
import { computed, ComputedRef, watch } from 'vue'
import { useAsyncData } from '../../utils/hooks/useAsyncData'

interface UseTreeOpt {
  attrs: ComputedRef<TreeAdapter>
}

export const useTree = ({ attrs }: UseTreeOpt) => {
  /** 异步options */
  const { data } = useAsyncData(attrs.value.treeDataAsync)
  if (attrs.value.treeDataAsync && attrs.value.treeDataAsync.api) {
    watch(
      () => data.value,
      (v) => (attrs.value.treeData = v || [])
    )
  }
  if (!attrs.value.checkedKeys) attrs.value.checkedKeys = []
  const { data: checkedKeys } = useAsyncData(attrs.value.checkedKeysAsync)
  if (attrs.value.checkedKeysAsync && attrs.value.checkedKeysAsync.api) {
    watch(
      () => checkedKeys.value,
      (v) => (attrs.value.checkedKeys = v || [])
    )
  }

  const output = computed(() => ({
    data: attrs.value,
  }))
  return { output }
}
