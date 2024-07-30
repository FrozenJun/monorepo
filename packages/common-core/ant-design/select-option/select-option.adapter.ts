import { PropType } from 'vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type SelectOptionSlots = 'default'
export const selectOptionSlots = ['default']

export declare type SelectOptionProps = {
  /**
   * Option 器类名
   */
  class: string

  /**
   * 是否禁用
   */
  disabled: boolean

  /**
   * 和 value 含义一致。如果 Vue 需要你设置此项，此项值与 value 的值相同，然后可以省略 value 设置
   */
  key: string

  /**
   * 选中该 Option 后，Select 的 title
   */
  title: string

  /**
   * 默认根据此属性值进行筛选
   */
  value: string | number
}
export const selectOptionProps = {
  class: {
    type: String,
  },
  disabled: {
    type: Boolean,
  },
  key: {
    type: String,
  },
  title: {
    type: String,
  },
  value: {
    type: [String, Number] as PropType<string | number>,
  },
}

export const SelectOptionBindsOmitKeys: (keyof SelectOptionAdapter)[] = []
export type SelectOptionAdapter = Partial<
  SelectOptionProps & ElCommonAdapter<SelectOptionAdapter, SelectOptionOutput, SelectOptionSlots>
>

export interface SelectOptionOutput {}

export const SELECT_OPTION_DEFAULT: SelectOptionAdapter = {}
