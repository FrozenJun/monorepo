import { PopconfirmProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type PopconfirmSlots =
  | 'default'
  | 'cancelButton'
  | 'cancelText'
  | 'okButton'
  | 'okText'
  | 'title'
export const popconfirmSlots = [
  'default',
  'cancelButton',
  'cancelText',
  'okButton',
  'okText',
  'title',
]

export const PopconfirmBindsOmitKeys: (keyof PopconfirmAdapter)[] = []
export type PopconfirmAdapter = Partial<
  PopconfirmProps & ElCommonAdapter<PopconfirmAdapter, PopconfirmOutput, PopconfirmSlots>
>

export interface PopconfirmOutput {}

export const POPCONFIRM_DEFAULT: PopconfirmAdapter = {}
