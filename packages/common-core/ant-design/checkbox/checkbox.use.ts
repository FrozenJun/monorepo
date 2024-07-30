import { CheckboxAdapter } from './checkbox.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseCheckboxOpt {
  attrs: ComputedRef<CheckboxAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useCheckbox = ({ attrs, props, ctx }: UseCheckboxOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
