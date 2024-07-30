<template>
  <SelectOption :class="className" :ref="$options.name" v-bind="binds" v-model:value="attrs.value">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </SelectOption>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  SelectOptionAdapter,
  SelectOptionBindsOmitKeys,
  SELECT_OPTION_DEFAULT,
  selectOptionSlots,
  selectOptionProps,
} from './select-option.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useSelectOption } from './select-option.use'
import { SelectOption } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.selectOption,
  inheritAttrs: false,
  components: { SelectOption },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<SelectOptionAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    ...selectOptionProps,
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.selectOption
    const className = dasherize(COMPONENT_NAME.selectOption)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<SelectOptionAdapter>({
      props,
      defaultOption: SELECT_OPTION_DEFAULT,
      type,
      omitKeys: SelectOptionBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useSelectOption({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: selectOptionSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
