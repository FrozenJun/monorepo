import { DescriptionsItemProp } from 'ant-design-vue/lib/descriptions'
import { ElCommonAdapter } from '../../utils/dtos'
import { ImageAdapter } from '../image/image.adapter'

type DescriptionsItemType = 'text' | 'image' | 'images' | 'slot'
export type DescriptionsItemSlots = 'default' | 'label'
export const descriptionsItemSlots = ['default', 'label']

export const DescriptionsItemBindsOmitKeys: (keyof DescriptionsItemAdapter)[] = [
  'prop',
  'type',
  'image',
  'onlyShowFirstImage',
]
export interface DescriptionsItemAdapter
  extends Partial<
    DescriptionsItemProp &
      ElCommonAdapter<DescriptionsItemAdapter, DescriptionsItemOutput, DescriptionsItemSlots>
  > {
  prop?: string
  visible?: boolean
  type?: DescriptionsItemType
  format?: string
  slotName?: string
  image?: ImageAdapter
  onlyShowFirstImage?: boolean
  enumTypes?: { label: string; value: string | number }[]
  htmlHandler?: (text: string) => string
}

export interface DescriptionsItemOutput {}

export const DESCRIPTIONS_ITEM_DEFAULT: DescriptionsItemAdapter = {
  //是否渲染
  visible: true,
}
