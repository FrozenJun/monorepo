<template>
  <InputNumber
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value.number="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </InputNumber>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  InputNumberAdapter,
  InputNumberBindsOmitKeys,
  INPUT_NUMBER_DEFAULT,
  inputNumberSlots,
} from './input-number.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useInputNumber } from './input-number.use'
import { InputNumber } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.inputNumber,
  inheritAttrs: false,
  components: { InputNumber },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<InputNumberAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Number, String],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.inputNumber
    const className = dasherize(COMPONENT_NAME.inputNumber)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<InputNumberAdapter>({
      props,
      defaultOption: INPUT_NUMBER_DEFAULT,
      type,
      omitKeys: InputNumberBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useInputNumber({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: inputNumberSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
