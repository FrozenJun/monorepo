<template>
  <!-- 插件BUG: 不要这里加as="div",会导致array-form的modelValue被内部item异常赋值的问题 -->
  <Field
    v-if="attrs.visible"
    :class="className"
    :name="fieldName"
    :rules="rules || ''"
    v-slot="{ errors }"
    v-model="modelValue"
  >
    <!-- TODO hidden字段未实现 -->
    <FormItem
      :class="{
        'c-form-item__item': true,
        [attrs.className || '']: true,
        'is-required': isRequired,
        'is-error': errors[0],
        [`is-content-${align}`]: align,
      }"
      :style="{ width: attrs.width || formAttrs.itemWidth }"
      :ref="$options.name"
      v-bind="binds"
      v-show="!attrs.hidden"
    >
      <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
        <template v-if="slots.type === 'default'">
          <!-- TYPE ITEM -->
          <Component
            v-if="!['empty', 'slot', 'input-number'].includes(attrs.type || '')"
            :is="attrs.type || 'input'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="modelValue"
            :key="attrs.control"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Component>
          <Component
            v-if="['input-number'].includes(attrs.type || '')"
            :is="attrs.type || 'input'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model.number="modelValue"
            :key="attrs.control"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Component>

          <template v-else-if="attrs.type === 'empty'"></template>

          <slot
            v-else-if="attrs.type === 'slot'"
            :name="slotConfig.name"
            :scope="slotConfig.scope"
          ></slot>
          <!-- Error And Tip  -->
          <span class="c-form-item__error">{{ errors[0] }}</span>
          <span v-if="!errors[0] && attrs.tip" class="c-form-item__tip gl-ellipsis-one">
            <a-tooltip :title="attrs.tip"> {{ attrs.tip }}</a-tooltip>
          </span>
        </template>
        <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
      </template>
    </FormItem>
  </Field>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import {
  FormItemAdapter,
  FormItemBindsOmitKeys,
  FORM_ITEM_DEFAULT,
  formItemSlots,
} from './form-item.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useFormItem } from './form-item.use'
import { FormItem } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import Input from '../input/input.vue'
import InputNumber from '../input-number/input-number.vue'
import { Field } from 'vee-validate'
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
import ArrayForm from '../array-form/array-form.vue'
import Slider from '../slider/slider.vue'
import { TableForm } from '../../combine/table-form'
import { NestedForm } from '../../combine/nested-form'

export default defineComponent({
  name: COMPONENT_NAME.formItem,
  inheritAttrs: false,
  components: {
    FormItem,
    Field,
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
    ArrayForm,
    TableForm,
    NestedForm,
    Slider,
  },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<Record<string, any>>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    // 当item位于forms数组时，index表示当前item所在的form在forms中的序号
    formIndex: {
      type: Number,
      default: undefined,
    },
    // 如果有modelValue,优先使用
    modelValue: {
      type: [Number, String, Boolean, Array, Object],
      default: undefined,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.formItem
    const className = dasherize(COMPONENT_NAME.formItem)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<FormItemAdapter>({
      props,
      defaultOption: FORM_ITEM_DEFAULT,
      type,
      omitKeys: FormItemBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, formAttrs, state, modelValue } = useFormItem({ attrs, props, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: formItemSlots,
    })
    return {
      className,
      attrs,
      binds,
      computedSlots,
      setInner,
      formAttrs,
      modelValue,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(form-item) {
  @include e(item) {
    @include when(content-left) {
      .el-form-item__content {
        text-align: left;
      }
    }
    @include when(content-mid) {
      .el-form-item__content {
        text-align: center;
      }
    }
    @include when(content-right) {
      .el-form-item__content {
        text-align: right;
        align-self: start;
      }
    }
    @include when(error) {
      .el-input__inner {
        border-color: #eb2828;
      }
    }
    @include when(required) {
      .ant-form-item-label label::before {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }

  @include e(error) {
    display: inline;
    position: absolute;
    bottom: -18px;
    left: 8px;
    width: 100%;
    color: red;
    font-size: 12px;
    line-height: 1;
    text-align: left;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @include e(tip) {
    display: inline;
    position: absolute;
    bottom: -15px;
    left: 8px;
    width: 100%;
    color: #aaa;
    font-size: 12px;
    line-height: 1;
    text-align: left;
  }
}
</style>
