<template>
  <!-- TODO 点击clearIcon，watch modelValue并没有触发，找不到问题先这么解决 -->
  <Select
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    :value="attrs.modelValue"
    @update:value="update"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Select>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { SelectAdapter, SelectBindsOmitKeys, SELECT_DEFAULT, selectSlots } from './select.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useSelect } from './select.use'
import { Select } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.select,
  inheritAttrs: false,
  components: { Select },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<SelectAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array, String, Number] as PropType<string[] | number[] | string | number>,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.select
    const className = dasherize(COMPONENT_NAME.select)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<SelectAdapter>({
      props,
      defaultOption: SELECT_DEFAULT,
      type,
      omitKeys: SelectBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useSelect({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: selectSlots,
    })
    /** BUG - TODO
     * attrs.value.modelValue为undefined会触发一次newValue为上次trigger旧值的trigger
     * 导致clear失败
     */
    const update = (v) => {
      if (v === undefined) {
        const isArrayValue = attrs.value.mode === 'multiple' || attrs.value.mode === 'tags'
        attrs.value.modelValue = isArrayValue ? [] : ''
      } else if (v.option && v.value) {
        attrs.value.modelValue = v.value
      } else {
        attrs.value.modelValue = v
      }
    }

    return { className, attrs, binds, computedSlots, update }
  },
})
</script>
