import { TextareaAdapter } from './textarea.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseTextareaOpt {
  attrs: ComputedRef<TextareaAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useTextarea = ({ attrs, props, ctx }: UseTextareaOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
