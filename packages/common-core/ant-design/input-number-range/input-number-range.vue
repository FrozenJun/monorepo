<template>
  <div :class="className" :ref="$options.name">
    <InputNumber :c="setInner(attrs.startInputNumber)" v-model.number="sModelValue">
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </InputNumber>
    <span :class="[className + '__separate']"> - </span>
    <InputNumber :c="setInner(attrs.endInputNumber)" v-model.numberr="eModelValue">
      <template v-for="(_, slot) in $slots" #[slot]="scope">
        <slot :name="slot" v-bind="scope"></slot>
      </template>
    </InputNumber>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  InputNumberRangeAdapter,
  InputNumberRangeBindsOmitKeys,
  INPUT_NUMBER_RANGE_DEFAULT,
  inputNumberRangeSlots,
} from './input-number-range.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useInputNumberRange } from './input-number-range.use'
import { dasherize } from 'common-base/pipe/string'
import { InputNumber } from '../input-number'

export default defineComponent({
  name: COMPONENT_NAME.inputNumberRange,
  inheritAttrs: false,
  components: { InputNumber },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<InputNumberRangeAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array],
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.inputNumberRange
    const className = dasherize(COMPONENT_NAME.inputNumberRange)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<InputNumberRangeAdapter>({
      props,
      defaultOption: INPUT_NUMBER_RANGE_DEFAULT,
      type,
      omitKeys: InputNumberRangeBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, sModelValue, eModelValue } = useInputNumberRange({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: inputNumberRangeSlots,
    })

    return { className, attrs, binds, computedSlots, setInner, sModelValue, eModelValue }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(input-number-range) {
  @include e(separate) {
    display: inline-block;
    width: 10%;
    text-align: center;
  }
  .c-input-number {
    width: 45%;
  }
}
</style>
