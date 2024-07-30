import { ComputedRef, getCurrentInstance, reactive } from 'vue'

interface UseSlotOpt {
  attrs: ComputedRef<Record<string, any>>
  slotTypes: string[]
}

export const useSlot = ({ attrs, slotTypes }: UseSlotOpt) => {
  const instance = getCurrentInstance()

  /**
   * 计算自定义slot的名称
   *
   */
  const computedCustomSlotName = (slotName: string) => {
    const customSlotName = attrs.value.slotAlias && attrs.value.slotAlias[slotName]
    const hasCustomSlot = customSlotName && instance!.proxy!.$slots[customSlotName]
    return hasCustomSlot ? customSlotName : ''
  }

  return {
    computedSlots,
  }

  /**
   * 融合slotAlias中的自定义后的slots
   *
   * 这里写成方法而不是直接计算出来，因为直接计算只会计算一次，$slots可能会变化，但是watch无法监听出变化
   */
  type ComputedSlot = { type: string; names: string[] }
  function computedSlots($slots: Record<string, any>) {
    const slots: ComputedSlot[] = []
    slots.length = 0
    slotTypes.forEach((type) => {
      const computedSlot: ComputedSlot = { type, names: [] }
      Object.keys($slots).forEach((name) => {
        if (name === type) computedSlot.names.push(name)
        if (name === computedCustomSlotName(type)) computedSlot.names.push(name)
      })
      computedSlot.names.length && slots.push(computedSlot)
    })
    if (!slots.find((i) => i.type === 'default')) slots.push({ type: 'default', names: [] })

    return slots
  }
}
