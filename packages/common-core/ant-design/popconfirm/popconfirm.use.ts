import { PopconfirmAdapter } from './popconfirm.adapter'
import { computed, ComputedRef } from 'vue'

interface UsePopconfirmOpt {
  attrs: ComputedRef<PopconfirmAdapter>
}

export const usePopconfirm = ({ attrs }: UsePopconfirmOpt) => {
  const output = computed(() => ({}))
  return { output }
}
