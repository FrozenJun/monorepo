import { DescriptionsAdapter } from '../descriptions/descriptions.adapter'
import { DescriptionsItemAdapter } from './descriptions-item.adapter'
import { computed, ComputedRef, inject } from 'vue'

interface UseDescriptionsItemOpt {
  attrs: ComputedRef<DescriptionsItemAdapter>
}

export const useDescriptionsItem = ({ attrs }: UseDescriptionsItemOpt) => {
  const descriptionsAttrs = inject<ComputedRef<DescriptionsAdapter>>(
    'descriptionsAttrs',
    computed(() => ({}))
  )

  const value = computed(() => {
    if (!attrs.value.prop) return ''
    return (descriptionsAttrs.value.data || {})[attrs.value.prop]
  })

  const output = computed(() => ({}))
  return { output, descriptionsAttrs, value }
}
