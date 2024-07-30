import { ButtonProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type ButtonSlots = 'default' | 'icon'
export const buttonSlots = ['default', 'icon']

export const ButtonOmitBindsKeys: (keyof ButtonAdapter)[] = ['text', 'visible']
export interface ButtonAdapter
  extends Partial<ButtonProps & ElCommonAdapter<ButtonAdapter, ButtonOutput, ButtonSlots>> {
  /** 按钮文字 */
  text?: string

  /** 是否展示 */
  visible?: boolean
}

export interface ButtonOutput {
  loading(boo?: boolean): unknown
}

export const BUTTON_DEFAULT: ButtonAdapter = {
  visible: true,
}
