import { CheckboxGroupAdapter } from './checkbox-group.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseCheckboxGroupOpt {
  attrs: ComputedRef<CheckboxGroupAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useCheckboxGroup = ({ attrs, props, ctx }: UseCheckboxGroupOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
