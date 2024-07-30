<template>
  <Input :class="className" :ref="$options.name" v-bind="binds" v-model:value="attrs.modelValue">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Input>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { InputAdapter, InputBindsOmitKeys, INPUT_DEFAULT, inputSlots } from './input.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useInput } from './input.use'
import { Input } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.input,
  inheritAttrs: false,
  components: { Input },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<InputAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.input
    const className = dasherize(COMPONENT_NAME.input)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<InputAdapter>({
      props,
      defaultOption: INPUT_DEFAULT,
      type,
      omitKeys: InputBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useInput({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: inputSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
