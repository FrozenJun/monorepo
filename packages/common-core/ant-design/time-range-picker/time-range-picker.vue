<template>
  <TimeRangePicker
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </TimeRangePicker>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  TimeRangePickerAdapter,
  TimeRangePickerBindsOmitKeys,
  TIME_RANGE_PICKER_DEFAULT,
  timeRangePickerSlots,
} from './time-range-picker.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTimeRangePicker } from './time-range-picker.use'
import { TimeRangePicker } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import type { Dayjs } from 'dayjs'

export default defineComponent({
  name: COMPONENT_NAME.timeRangePicker,
  inheritAttrs: false,
  components: { TimeRangePicker },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<TimeRangePickerAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array] as PropType<Dayjs[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.timeRangePicker
    const className = dasherize(COMPONENT_NAME.timeRangePicker)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TimeRangePickerAdapter>({
      props,
      defaultOption: TIME_RANGE_PICKER_DEFAULT,
      type,
      omitKeys: TimeRangePickerBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTimeRangePicker({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: timeRangePickerSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
