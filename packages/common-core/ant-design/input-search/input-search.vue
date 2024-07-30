<template>
  <InputSearch
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </InputSearch>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  InputSearchAdapter,
  InputSearchBindsOmitKeys,
  INPUT_SEARCH_DEFAULT,
  inputSearchSlots,
} from './input-search.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useInputSearch } from './input-search.use'
import { InputSearch } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.inputSearch,
  inheritAttrs: false,
  components: { InputSearch },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<InputSearchAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: String,
    },
    enterButton: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.inputSearch
    const className = dasherize(COMPONENT_NAME.inputSearch)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<InputSearchAdapter>({
      props,
      defaultOption: INPUT_SEARCH_DEFAULT,
      type,
      omitKeys: InputSearchBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useInputSearch({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: inputSearchSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
