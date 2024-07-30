<template>
  <RangePicker
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </RangePicker>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  RangePickerAdapter,
  RangePickerBindsOmitKeys,
  RANGE_PICKER_DEFAULT,
  rangePickerSlots,
} from './range-picker.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useRangePicker } from './range-picker.use'
import { RangePicker } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import type { Dayjs } from 'dayjs'

export default defineComponent({
  name: COMPONENT_NAME.rangePicker,
  inheritAttrs: false,
  components: { RangePicker },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<RangePickerAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array] as PropType<string[] | Dayjs[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.rangePicker
    const className = dasherize(COMPONENT_NAME.rangePicker)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<RangePickerAdapter>({
      props,
      defaultOption: RANGE_PICKER_DEFAULT,
      type,
      omitKeys: RangePickerBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useRangePicker({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: rangePickerSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
