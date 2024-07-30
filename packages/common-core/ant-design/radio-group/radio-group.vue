<template>
  <RadioGroup
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </RadioGroup>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  RadioGroupAdapter,
  RadioGroupBindsOmitKeys,
  RADIO_GROUP_DEFAULT,
  radioGroupSlots,
  radioGroupProps,
} from './radio-group.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useRadioGroup } from './radio-group.use'
import { RadioGroup } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.radioGroup,
  inheritAttrs: false,
  components: { RadioGroup },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<RadioGroupAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
    ...radioGroupProps,
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.radioGroup
    const className = dasherize(COMPONENT_NAME.radioGroup)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<RadioGroupAdapter>({
      props,
      defaultOption: RADIO_GROUP_DEFAULT,
      type,
      omitKeys: RadioGroupBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useRadioGroup({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: radioGroupSlots,
    })
    return { className, attrs, binds, computedSlots }
  },
})
</script>
