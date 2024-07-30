import { TableAdapter } from './table.adapter'
import { computed, ComputedRef } from 'vue'

interface UseTableOpt {
  attrs: ComputedRef<TableAdapter>
}

export const useTable = ({ attrs }: UseTableOpt) => {
  const output = computed(() => ({}))
  return { output }
}
