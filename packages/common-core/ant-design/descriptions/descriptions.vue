<template>
  <Descriptions :class="className" :ref="$options.name" v-bind="binds">
    <!-- TODO - 处理descriptions slot -->
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <template v-if="slots.type === 'default'">
        <template v-for="(item, index) in items" :key="index">
          <DescriptionsItem v-bind="item" v-if="item.visible !== false">
            <template
              v-for="slots in computedSlots($slots)"
              #[slots.type]="scope"
              :key="slots.type"
            >
              <template v-if="slots.type === 'default'">
                <template v-if="!item.type || item.type === 'text'">
                  <!-- 枚举 item -->
                  <template v-if="item.enumTypes && item.enumTypes.length">{{
                    (
                      item.enumTypes.find((i: any) => i.value === attrs!.data![item.prop || '']) ||
                      {}
                    ).label
                  }}</template>
                  <!-- 时间 item -->
                  <template v-else-if="item.format">{{
                    attrs!.data![item.prop || '']
                      ? dayjs(new Date(attrs!.data![item.prop || ''])).format(item.format)
                      : ''
                  }}</template>
                  <!-- html item -->
                  <template v-else-if="item.htmlHandler">
                    <span v-html="item.htmlHandler(attrs!.data![item.prop || ''])"></span>
                  </template>
                  <span v-else>{{ attrs!.data![item.prop || ''] }}</span>
                </template>

                <template v-else-if="item.type === 'image' && attrs!.data![item.prop || '']">
                  <Image
                    class="c-descriptions__image"
                    :c="setInner({ src: attrs!.data![item.prop || ''], ...(item.image || {}) })"
                  ></Image>
                </template>
                <template v-else-if="item.type === 'images'">
                  <ImagePreviewGroup>
                    <template v-for="(src, index) in attrs!.data![item.prop || '']" :key="index">
                      <template v-if="!item.onlyShowFirstImage || index === 0">
                        <Image
                          class="c-descriptions__image"
                          :c="setInner({ src, ...(item.image || {}) })"
                        ></Image>
                      </template>
                    </template>
                  </ImagePreviewGroup>
                </template>
                <template v-else-if="item.type === 'slot'">
                  <slot
                    :name="item.slotName"
                    v-bind="{ data: attrs!.data![item.prop || ''] }"
                  ></slot>
                </template>
              </template>
              <template>
                <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
              </template>
            </template>
          </DescriptionsItem>
        </template>
      </template>
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Descriptions>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  DescriptionsAdapter,
  DescriptionsBindsOmitKeys,
  DESCRIPTIONS_DEFAULT,
  descriptionsSlots,
} from './descriptions.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useDescriptions } from './descriptions.use'
import { Descriptions } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import { DescriptionsItem } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ImagePreviewGroup } from 'ant-design-vue'
import Image from '../../ant-design/image/image.vue'
// import DescriptionsItem from '../descriptions-item/descriptions-item.vue'

export default defineComponent({
  name: COMPONENT_NAME.descriptions,
  inheritAttrs: false,
  components: { Descriptions, DescriptionsItem, Image, ImagePreviewGroup },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<Record<string, any>>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.descriptions
    const className = dasherize(COMPONENT_NAME.descriptions)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<DescriptionsAdapter>({
      props,
      defaultOption: DESCRIPTIONS_DEFAULT,
      type,
      omitKeys: DescriptionsBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, items } = useDescriptions({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: descriptionsSlots,
    })
    return { className, attrs, binds, computedSlots, setInner, dayjs, items }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(descriptions) {
  @include e(image) {
    cursor: pointer;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    object-fit: contain;
  }
}
</style>
../image/image.vue