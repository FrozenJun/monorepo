<template>
  <DatePicker
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </DatePicker>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import {
  DatePickerAdapter,
  DatePickerBindsOmitKeys,
  DATE_PICKER_DEFAULT,
  datePickerSlots,
} from './date-picker.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useDatePicker } from './date-picker.use'
import { DatePicker } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import type { Dayjs } from 'dayjs'

export default defineComponent({
  name: COMPONENT_NAME.datePicker,
  inheritAttrs: false,
  components: { DatePicker },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<DatePickerAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [String, Object] as PropType<string | Dayjs>,
      default: () => ref<Dayjs>(),
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.datePicker
    const className = dasherize(COMPONENT_NAME.datePicker)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<DatePickerAdapter>({
      props,
      defaultOption: DATE_PICKER_DEFAULT,
      type,
      omitKeys: DatePickerBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useDatePicker({ attrs, props, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: datePickerSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
