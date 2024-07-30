import { ComputedRef } from 'vue'
import { CommonAdapter } from '../dtos'
import { useRewriteCb } from './useRewriteCb'
import { useSetupCb } from './useSetupCb'
import { useSlot } from './useSlot'

interface UseCommonSetupOpt {
  attrs: ComputedRef<Record<string, any>>
  output: ComputedRef<Record<string, any>>
  preload?: any
  slotTypes?: string[]
}

export const useCommonSetup = ({
  attrs,
  output,
  preload,
  slotTypes = ['default'],
}: UseCommonSetupOpt) => {
  useRewriteCb({ attrs, output, preload })

  useSetupCb({ attrs, output })

  const { computedSlots } = useSlot({ attrs, slotTypes })

  return { computedSlots, setInner }

  function setInner(innerAttrs: CommonAdapter<any, string> = {}): CommonAdapter<any, string> {
    innerAttrs.__INNER__ = true
    return innerAttrs
  }
}
