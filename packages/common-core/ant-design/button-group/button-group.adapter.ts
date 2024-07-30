import { ButtonGroupProps } from 'ant-design-vue/lib/button'
import { ElCommonAdapter } from '../../utils/dtos'

export type ButtonGroupSlots = 'default'

export const ButtonGroupBindsOmitKeys: (keyof ButtonGroupAdapter)[] = []
export type ButtonGroupAdapter = Partial<
  ButtonGroupProps & ElCommonAdapter<ButtonGroupAdapter, ButtonGroupOutput, ButtonGroupSlots>
>

export interface ButtonGroupOutput {}

export const BUTTON_GROUP_DEFAULT: ButtonGroupAdapter = {}
