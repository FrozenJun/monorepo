import { RadioGroupProps } from 'ant-design-vue'
import { RadioGroupChildOption } from 'ant-design-vue/lib/radio/Group'
import { PropType } from 'vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type RadioGroupSlots = 'default'
export const radioGroupSlots = ['default']

export const RadioGroupBindsOmitKeys: (keyof RadioGroupAdapter)[] = []
export interface RadioGroupAdapter
  extends Partial<
    RadioGroupProps & ElFormCtrlCommonAdapter<RadioGroupAdapter, RadioGroupOutput, RadioGroupSlots>
  > {
  modelValue?: any
}

export interface RadioGroupOutput {}

export const RADIO_GROUP_DEFAULT: RadioGroupAdapter = {}

export let radioGroupProps: {
  prefixCls: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  }
  value: import('vue-types').VueTypeValidableDef<any>
  size: import('vue-types').VueTypeDef<'default' | 'small' | 'large'> & {
    default: 'default' | 'small' | 'large'
  }
  options: {
    type: PropType<(string | RadioGroupChildOption)[]>
  }
  disabled: import('vue-types').VueTypeValidableDef<boolean>
  name: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  }
  buttonStyle: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  } & {
    default: string
  }
  id: import('vue-types').VueTypeValidableDef<string> & {
    default: string
  }
  optionType: import('vue-types').VueTypeDef<'default' | 'button'> & {
    default: 'default' | 'button'
  }
}
