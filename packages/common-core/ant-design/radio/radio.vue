<template>
  <Radio :class="className" :ref="$options.name" v-bind="binds" v-model:checked="attrs.modelValue">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Radio>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { RadioAdapter, RadioBindsOmitKeys, RADIO_DEFAULT, radioSlots } from './radio.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useRadio } from './radio.use'
import { Radio } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.radio,
  inheritAttrs: false,
  components: { Radio },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<RadioAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.radio
    const className = dasherize(COMPONENT_NAME.radio)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<RadioAdapter>({
      props,
      defaultOption: RADIO_DEFAULT,
      type,
      omitKeys: RadioBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useRadio({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: radioSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
