import { ButtonAdapter } from '../../ant-design/button/button.adapter'
import { ElCommonAdapter } from '../../utils/dtos'
import { OperateItem } from '../ct/ct.adapter'

export type CoSlots = 'default'
export const coSlots = ['default']

export const CoBindsOmitKeys: (keyof CoAdapter)[] = []
export interface CoAdapter extends Partial<ElCommonAdapter<CoAdapter, CoOutput, CoSlots>> {
  selectButtons?: ButtonAdapter[]
  operateButtons?: OperateItem[]
  operateRightButtons?: OperateItem[]
  maxVisibleButtonNumber?: number
}

export interface CoOutput {}

export const CO_DEFAULT: CoAdapter = {}
