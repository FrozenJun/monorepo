import { SelectOptionAdapter } from './select-option.adapter'
import { computed, ComputedRef } from 'vue'

interface UseSelectOptionOpt {
  attrs: ComputedRef<SelectOptionAdapter>
}

export const useSelectOption = ({ attrs }: UseSelectOptionOpt) => {
  const output = computed(() => ({}))
  return { output }
}
