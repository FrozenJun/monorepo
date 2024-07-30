import { RadioGroupAdapter } from './radio-group.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseRadioGroupOpt {
  attrs: ComputedRef<RadioGroupAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useRadioGroup = ({ attrs, props, ctx }: UseRadioGroupOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
