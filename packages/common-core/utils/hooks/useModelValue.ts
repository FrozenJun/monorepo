import { ComputedRef, SetupContext, watch } from 'vue'
import _ from 'lodash'

interface UseModelValueOpt {
  props: Record<string, any>
  attrs: ComputedRef<Record<string, any>>
  ctx: SetupContext<any>
}

export const useModelValue = ({ props, attrs, ctx }: UseModelValueOpt) => {
  watch(
    () => attrs.value.modelValue,
    (v, oldv) => {
      if (v === oldv) return
      ctx.emit('update:modelValue', v)
    },
    {
      immediate: true,
    }
  )
  watch(
    () => props.modelValue,
    (v, oldv) => {
      attrs.value.modelValue = v
      _.isFunction(attrs.value.onModelChange) && attrs.value.onModelChange(v, oldv)
    },
    { immediate: true }
  )
}
