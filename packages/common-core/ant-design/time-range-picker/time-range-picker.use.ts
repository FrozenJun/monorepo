import { TimeRangePickerAdapter } from './time-range-picker.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseTimeRangePickerOpt {
  attrs: ComputedRef<TimeRangePickerAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useTimeRangePicker = ({ attrs, props, ctx }: UseTimeRangePickerOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
