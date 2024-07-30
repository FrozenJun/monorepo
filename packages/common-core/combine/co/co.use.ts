import { OperateItem } from '../ct/ct.adapter'
import { CoAdapter } from './co.adapter'
import { computed, ComputedRef, ref } from 'vue'
interface UseCoOpt {
  attrs: ComputedRef<CoAdapter>
}
const MAX_VISIBLE_BUTTON_NUMBER = 3
export const useCo = ({ attrs }: UseCoOpt) => {
  const output = computed(() => ({}))
  //操作按钮
  const operateButtons = ref<OperateItem[]>([])
  //操作更多下拉中的按钮
  const operateMoreButtons = ref<OperateItem[]>([])
  //所有可见按钮
  const visibleButtons = attrs.value.operateButtons?.filter((item) => item.button?.visible)
  // 限制数量
  const max = attrs.value.maxVisibleButtonNumber||MAX_VISIBLE_BUTTON_NUMBER
  if (visibleButtons) {
    visibleButtons.forEach((item, index) => {
      if (index < max) {
        operateButtons.value.push(item)
      } else {
        operateMoreButtons.value.push(item)
      }
    })
    operateMoreButtons.value = operateMoreButtons.value.map((item) => {
      item.button!.type = 'text'
      return item
    })
  }
  return { output, operateButtons, operateMoreButtons }
}
