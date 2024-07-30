import { TimePickerAdapter } from './time-picker.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseTimePickerOpt {
  attrs: ComputedRef<TimePickerAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useTimePicker = ({ attrs, props, ctx }: UseTimePickerOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
