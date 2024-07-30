import { DescriptionsItemAdapter } from '../descriptions-item/descriptions-item.adapter'
import { DescriptionsProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'

export type DescriptionsSlots = 'default' | 'extra' | 'title'
export const descriptionsSlots = ['default', 'extra', 'title']

export const DescriptionsBindsOmitKeys: (keyof DescriptionsAdapter)[] = ['data', 'items']
export interface DescriptionsAdapter
  extends Partial<
    DescriptionsProps & ElCommonAdapter<DescriptionsAdapter, DescriptionsOutput, DescriptionsSlots>
  > {
  items?: (DescriptionsItemAdapter | undefined)[]

  data?: Record<string, any>
}

export interface DescriptionsOutput {}

export const DESCRIPTIONS_DEFAULT: DescriptionsAdapter = {
  data: {},
}
