<template>
  <Image :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Image>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { ImageAdapter, ImageBindsOmitKeys, IMAGE_DEFAULT, imageSlots } from './image.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useImage } from './image.use'
import { Image } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.image,
  inheritAttrs: false,
  components: { Image },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<ImageAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.image
    const className = dasherize(COMPONENT_NAME.image)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<ImageAdapter>({
      props,
      defaultOption: IMAGE_DEFAULT,
      type,
      omitKeys: ImageBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useImage({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: imageSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
