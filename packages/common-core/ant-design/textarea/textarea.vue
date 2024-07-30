<template>
  <Textarea :class="className" :ref="$options.name" v-bind="binds" v-model:value="attrs.modelValue">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Textarea>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  TextareaAdapter,
  TextareaBindsOmitKeys,
  TEXTAREA_DEFAULT,
  textareaSlots,
} from './textarea.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTextarea } from './textarea.use'
import { Textarea } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.textarea,
  inheritAttrs: false,
  components: { Textarea },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<TextareaAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.textarea
    const className = dasherize(COMPONENT_NAME.textarea)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TextareaAdapter>({
      props,
      defaultOption: TEXTAREA_DEFAULT,
      type,
      omitKeys: TextareaBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTextarea({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: textareaSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
