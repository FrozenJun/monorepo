import { InputSearchAdapter } from './input-search.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseInputSearchOpt {
  attrs: ComputedRef<InputSearchAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useInputSearch = ({ attrs, props, ctx }: UseInputSearchOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
