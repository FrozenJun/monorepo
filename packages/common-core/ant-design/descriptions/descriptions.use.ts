import { DescriptionsItemAdapter } from '../descriptions-item/descriptions-item.adapter'
import { DescriptionsAdapter } from './descriptions.adapter'
import { computed, ComputedRef, provide } from 'vue'
import _ from 'lodash'

interface UseDescriptionsOpt {
  attrs: ComputedRef<DescriptionsAdapter>
}

export const useDescriptions = ({ attrs }: UseDescriptionsOpt) => {
  provide('descriptionsAttrs', attrs)

  const items: ComputedRef<DescriptionsItemAdapter[]> = computed(() => {
    const originalItems = (attrs.value.items || []).filter((item) => !!item)
    return isDescriptionsItemArray(originalItems) ? originalItems : []
  })

  const output = computed(() => ({}))
  return { output, items }
}

function isDescriptionsItemArray(
  items: (DescriptionsItemAdapter | undefined)[]
): items is DescriptionsItemAdapter[] {
  return !items.some((i) => _.isUndefined(i))
}
