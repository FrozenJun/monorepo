import { ButtonGroupAdapter } from './button-group.adapter'
import { computed, ComputedRef } from 'vue'

interface UseButtonGroupOpt {
  attrs: ComputedRef<ButtonGroupAdapter>
}

export const useButtonGroup = ({ attrs }: UseButtonGroupOpt) => {
  const output = computed(() => ({}))
  return { output }
}
