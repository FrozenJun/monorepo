import { CascaderAdapter, CascaderOutput } from './cascader.adapter'
import { computed, ComputedRef, reactive, SetupContext, watch } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'
import { useAsyncData } from '../../utils/hooks/useAsyncData'

interface UseCascaderOpt {
  attrs: ComputedRef<CascaderAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}
interface CascaderState {}

export const useCascader = ({ attrs, props, ctx }: UseCascaderOpt) => {
  const state = reactive<CascaderState>({})

  /** 异步options */
  const { data, send } = useAsyncData(attrs.value.optionsAsync)
  if (attrs.value.optionsAsync && attrs.value.optionsAsync.api) {
    watch(
      () => data.value,
      (v) => (attrs.value.options = v || [])
    )
    watch(
      () => attrs.value.optionsAsync!.loading,
      (v) => (attrs.value.loading = v)
    )
  }
  if (attrs.value.optionsAsync && attrs.value.optionsAsync.api) {
    const mode = attrs.value.asyncSendMode
    if (mode === 'both' || mode === 'dropdown') {
      const fn = attrs.value.onDropdownVisibleChange
      attrs.value.onDropdownVisibleChange = (open) => {
        fn && fn(open)
        open && send()
      }
    }
    if (mode === 'both' || mode === 'modelChange') {
      const modelFn = attrs.value.onModelChange
      attrs.value.onModelChange = (v, oldv, data) => {
        modelFn && modelFn(v, oldv, data)
        if (v && v.length && !oldv) {
          send()
        }
      }
    }
  }

  useModelValue({ props, attrs, ctx })
  const output = computed<CascaderOutput>(() => ({}))
  return { output, state }
}
