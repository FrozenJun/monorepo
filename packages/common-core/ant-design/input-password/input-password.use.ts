import { InputPasswordAdapter } from './input-password.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseInputPasswordOpt {
  attrs: ComputedRef<InputPasswordAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useInputPassword = ({ attrs, ctx, props }: UseInputPasswordOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
