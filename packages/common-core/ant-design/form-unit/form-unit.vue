<template>
  <Component
    :class="className"
    :ref="$options.name"
    :is="attrs.type || 'input'"
    :c="setInner(attrs.control)"
    v-model="modelValue"
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
  </Component>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  FormUnitAdapter,
  FormUnitBindsOmitKeys,
  FORM_UNIT_DEFAULT,
  formUnitSlots,
} from './form-unit.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useFormUnit } from './form-unit.use'
import { dasherize } from 'common-base/pipe/string'
import Input from '../input/input.vue'
import InputNumber from '../input-number/input-number.vue'
import DatePicker from '../date-picker/date-picker.vue'
import Select from '../select/select.vue'
import RangePicker from '../range-picker/range-picker.vue'
import TimePicker from '../time-picker/time-picker.vue'
import TimeRangePicker from '../time-range-picker/time-range-picker.vue'
import Checkbox from '../checkbox/checkbox.vue'
import CheckboxGroup from '../checkbox-group/checkbox-group.vue'
import Radio from '../radio/radio.vue'
import RadioGroup from '../radio-group/radio-group.vue'
import Cascader from '../cascader/cascader.vue'
import Upload from '../upload/upload.vue'
import InputSearch from '../input-search/input-search.vue'
import Switch from '../switch/switch.vue'
import TreeSelect from '../tree-select/tree-select.vue'
import Textarea from '../textarea/textarea.vue'
import InputPassword from '../input-password/input-password.vue'
import AutoComplete from '../auto-complete/auto-complete.vue'
import InputNumberRange from '../input-number-range/input-number-range.vue'
import Slider from '../slider/slider.vue'

export default defineComponent({
  name: COMPONENT_NAME.formUnit,
  inheritAttrs: false,
  components: {
    Input,
    InputNumber,
    DatePicker,
    Select,
    RangePicker,
    TimePicker,
    TimeRangePicker,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Cascader,
    Upload,
    InputSearch,
    Switch,
    TreeSelect,
    Textarea,
    InputPassword,
    AutoComplete,
    InputNumberRange,
    Slider,
  },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<FormUnitAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [String, Number, Array, Boolean, Object],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.formUnit
    const className = dasherize(COMPONENT_NAME.formUnit)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<FormUnitAdapter>({
      props,
      defaultOption: FORM_UNIT_DEFAULT,
      type,
      omitKeys: FormUnitBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, modelValue } = useFormUnit({ attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: formUnitSlots,
    })

    return { className, attrs, binds, computedSlots, setInner, modelValue }
  },
})
</script>
