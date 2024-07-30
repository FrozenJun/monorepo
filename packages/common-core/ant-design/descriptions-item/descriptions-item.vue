<template>
  <DescriptionsItem :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <template v-if="slots.type === 'default'">
        <template v-if="!attrs.type || attrs.type === 'text'"
          ><span>{{ value }}</span></template
        >
        <template v-else-if="attrs.type === 'component'">
          <span></span>
        </template>
      </template>
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </DescriptionsItem>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  DescriptionsItemAdapter,
  DescriptionsItemBindsOmitKeys,
  DESCRIPTIONS_ITEM_DEFAULT,
  descriptionsItemSlots,
} from './descriptions-item.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useDescriptionsItem } from './descriptions-item.use'
import { DescriptionsItem } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.descriptionsItem,
  inheritAttrs: false,
  components: { DescriptionsItem },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<DescriptionsItemAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.descriptionsItem
    const className = dasherize(COMPONENT_NAME.descriptionsItem)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<DescriptionsItemAdapter>({
      props,
      defaultOption: DESCRIPTIONS_ITEM_DEFAULT,
      type,
      omitKeys: DescriptionsItemBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, descriptionsAttrs, value } = useDescriptionsItem({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: descriptionsItemSlots,
    })

    return { className, attrs, binds, computedSlots, descriptionsAttrs, value }
  },
})
</script>
