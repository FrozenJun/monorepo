import { TreeSelectAdapter } from './tree-select.adapter'
import { computed, ComputedRef, SetupContext, watch } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'
import { useAsyncData } from '../../utils/hooks/useAsyncData'

interface UseTreeSelectOpt {
  attrs: ComputedRef<TreeSelectAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useTreeSelect = ({ attrs, props, ctx }: UseTreeSelectOpt) => {
  /** 异步options */
  const { data, send } = useAsyncData(attrs.value.treeDataAsync)
  if (attrs.value.treeDataAsync && attrs.value.treeDataAsync.api) {
    watch(
      () => data.value,
      (v) => (attrs.value.treeData = v || [])
    )
    watch(
      () => attrs.value.treeDataAsync!.loading,
      (v) => (attrs.value.loading = v)
    )
  }
  if (attrs.value.treeDataAsync && attrs.value.treeDataAsync.api) {
    const fn = attrs.value.onDropdownVisibleChange
    attrs.value.onDropdownVisibleChange = (open) => {
      fn && fn(open)
      open && send()
    }
    const modelFn = attrs.value.onModelChange
    attrs.value.onModelChange = (v, oldv, data) => {
      modelFn && modelFn(v, oldv, data)
      if (v && v.length && !oldv) {
        send()
      }
    }
  }

  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({
    data: attrs.value,
  }))
  return { output }
}
