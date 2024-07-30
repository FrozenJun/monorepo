import { ButtonAdapter } from './button.adapter'
import { computed, ComputedRef } from 'vue'

interface UseButtonOpt {
  attrs: ComputedRef<ButtonAdapter>
}

export const useButton = ({ attrs }: UseButtonOpt) => {
  /**
   * LOADING
   */
  function loading(loading = true) {
    attrs.value.loading = loading
  }

  const output = computed(() => ({ loading, data: attrs.value }))
  return output
}
