<template>
  <TimePicker
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </TimePicker>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  TimePickerAdapter,
  TimePickerBindsOmitKeys,
  TIME_PICKER_DEFAULT,
  timePickerSlots,
} from './time-picker.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTimePicker } from './time-picker.use'
import { TimePicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.timePicker,
  inheritAttrs: false,
  components: { TimePicker },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<TimePickerAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Object as PropType<Dayjs>,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.timePicker
    const className = dasherize(COMPONENT_NAME.timePicker)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TimePickerAdapter>({
      props,
      defaultOption: TIME_PICKER_DEFAULT,
      type,
      omitKeys: TimePickerBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTimePicker({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: timePickerSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
