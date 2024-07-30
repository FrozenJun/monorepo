import { AutoCompleteAdapter } from './auto-complete.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseAutoCompleteOpt {
  attrs: ComputedRef<AutoCompleteAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useAutoComplete = ({ attrs, ctx, props }: UseAutoCompleteOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
