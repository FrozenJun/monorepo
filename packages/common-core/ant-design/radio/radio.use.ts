import { RadioAdapter } from './radio.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseRadioOpt {
  attrs: ComputedRef<RadioAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useRadio = ({ attrs, props, ctx }: UseRadioOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
