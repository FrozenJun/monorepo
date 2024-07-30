import { SwitchProps } from 'ant-design-vue'
import { PropType } from 'vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type SwitchSlots = 'checkedChildren' | 'unCheckedChildren'
export const switchSlots = ['checkedChildren', 'unCheckedChildren']

export const SwitchBindsOmitKeys: (keyof SwitchAdapter)[] = []
export interface SwitchAdapter
  extends Partial<SwitchProps & ElFormCtrlCommonAdapter<SwitchAdapter, SwitchOutput, SwitchSlots>> {
  modelValue?: boolean | number | string
}

export interface SwitchOutput {}

export const SWITCH_DEFAULT: SwitchAdapter = {}

type CheckedType = boolean | string | number
export let switchProps: {
  id: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  }
  prefixCls: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  }
  size: import('vue-types').VueTypeDef<'default' | 'small'>
  disabled: import('vue-types').VueTypeValidableDef<boolean>
  checkedChildren: import('vue-types').VueTypeValidableDef<any>
  unCheckedChildren: import('vue-types').VueTypeValidableDef<any>
  tabindex: import('vue-types').VueTypeDef<string | number>
  autofocus: import('vue-types').VueTypeValidableDef<boolean>
  loading: import('vue-types').VueTypeValidableDef<boolean>
  checked: import('vue-types').VueTypeDef<string | number | boolean>
  checkedValue: import('vue-types').VueTypeDef<string | number | boolean> & {
    default: string | number | boolean
  }
  unCheckedValue: import('vue-types').VueTypeDef<string | number | boolean> & {
    default: string | number | boolean
  }
  onChange: {
    type: PropType<(checked: CheckedType, e: Event) => void>
  }
  onClick: {
    type: PropType<(checked: CheckedType, e: Event) => void>
  }
  onKeydown: {
    type: PropType<(e: Event) => void>
  }
  onMouseup: {
    type: PropType<(e: Event) => void>
  }
  'onUpdate:checked': {
    type: PropType<(checked: CheckedType) => void>
  }
}
