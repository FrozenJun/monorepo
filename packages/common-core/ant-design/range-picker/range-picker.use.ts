import { RangePickerAdapter } from './range-picker.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'

interface UseRangePickerOpt {
  attrs: ComputedRef<RangePickerAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useRangePicker = ({ attrs, props, ctx }: UseRangePickerOpt) => {
  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
