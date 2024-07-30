import { SwitchAdapter } from './switch.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseSwitchOpt {
  attrs: ComputedRef<SwitchAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useSwitch = ({ attrs, props, ctx }: UseSwitchOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
