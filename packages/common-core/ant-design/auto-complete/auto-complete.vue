<template>
  <AutoComplete
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </AutoComplete>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  AutoCompleteAdapter,
  AutoCompleteBindsOmitKeys,
  AUTO_COMPLETE_DEFAULT,
  autoCompleteSlots,
} from './auto-complete.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useAutoComplete } from './auto-complete.use'
import { AutoComplete } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.autoComplete,
  inheritAttrs: false,
  components: { AutoComplete },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<AutoCompleteAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.autoComplete
    const className = dasherize(COMPONENT_NAME.autoComplete)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<AutoCompleteAdapter>({
      props,
      defaultOption: AUTO_COMPLETE_DEFAULT,
      type,
      omitKeys: AutoCompleteBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useAutoComplete({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: autoCompleteSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
