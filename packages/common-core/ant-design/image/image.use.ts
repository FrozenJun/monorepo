import { ImageAdapter } from './image.adapter'
import { computed, ComputedRef } from 'vue'

interface UseImageOpt {
  attrs: ComputedRef<ImageAdapter>
}

export const useImage = ({ attrs }: UseImageOpt) => {
  const output = computed(() => ({}))
  return { output }
}
