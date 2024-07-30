import { DescriptionsAdapter } from '../../ant-design/descriptions/descriptions.adapter'
import { DescriptionsItemAdapter } from '../../ant-design/descriptions-item/descriptions-item.adapter'
export function getDescriptionItemByProp(
  itemProp: string,
  description: DescriptionsAdapter
): DescriptionsItemAdapter | undefined {
  const items = description.items || []
  return items.find((item) => item?.prop === itemProp)
}
