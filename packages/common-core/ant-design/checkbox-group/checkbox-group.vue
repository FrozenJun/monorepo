<template>
  <CheckboxGroup
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
    <template #label="option">{{ option }}</template>
  </CheckboxGroup>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  CheckboxGroupAdapter,
  CheckboxGroupBindsOmitKeys,
  CHECKBOX_GROUP_DEFAULT,
  checkboxGroupSlots,
} from './checkbox-group.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCheckboxGroup } from './checkbox-group.use'
import { CheckboxGroup } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.checkboxGroup,
  inheritAttrs: false,
  components: { CheckboxGroup },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<CheckboxGroupAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array] as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.checkboxGroup
    const className = dasherize(COMPONENT_NAME.checkboxGroup)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CheckboxGroupAdapter>({
      props,
      defaultOption: CHECKBOX_GROUP_DEFAULT,
      type,
      omitKeys: CheckboxGroupBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useCheckboxGroup({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: checkboxGroupSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
