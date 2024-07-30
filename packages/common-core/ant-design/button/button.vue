<template>
  <Button v-if="attrs.visible" :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <template v-if="slots.type === 'default'">
        <span>{{ attrs.text || '' }}</span>
      </template>
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Button>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { ButtonAdapter, ButtonOmitBindsKeys, BUTTON_DEFAULT, buttonSlots } from './button.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useButton } from './button.use'
import { Button } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.button,
  inheritAttrs: false,
  components: { Button },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<ButtonAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.button
    const className = dasherize(COMPONENT_NAME.button)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<ButtonAdapter>({
      props,
      defaultOption: BUTTON_DEFAULT,
      type,
      omitKeys: ButtonOmitBindsKeys,
    })

    /** 组件输出 */
    const output = useButton({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: buttonSlots,
    })
    return { className, attrs, binds, computedSlots }
  },
})
</script>
