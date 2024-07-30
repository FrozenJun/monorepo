import { InputNumberAdapter } from './input-number.adapter'
import { computed, ComputedRef, SetupContext, watch } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseInputNumberOpt {
  attrs: ComputedRef<InputNumberAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useInputNumber = ({ attrs, props, ctx }: UseInputNumberOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
