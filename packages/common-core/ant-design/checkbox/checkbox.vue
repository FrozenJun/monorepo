<template>
  <Checkbox
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:checked="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Checkbox>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  CheckboxAdapter,
  CheckboxBindsOmitKeys,
  CHECKBOX_DEFAULT,
  checkboxSlots,
} from './checkbox.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCheckbox } from './checkbox.use'
import { Checkbox } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.checkbox,
  inheritAttrs: false,
  components: { Checkbox },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<CheckboxAdapter>,
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
    const type = COMPONENT_TYPE.checkbox
    const className = dasherize(COMPONENT_NAME.checkbox)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CheckboxAdapter>({
      props,
      defaultOption: CHECKBOX_DEFAULT,
      type,
      omitKeys: CheckboxBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useCheckbox({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: checkboxSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
