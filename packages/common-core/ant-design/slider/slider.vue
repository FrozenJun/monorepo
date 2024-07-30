<template>
  <div class="c-slider__container">
    <Slider :class="className" :ref="$options.name" v-bind="binds" v-model:value="attrs.modelValue">
      <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
        <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
      </template>
    </Slider>
    <p v-if="attrs.showValue && typeof attrs.modelValue === 'number'" class="c-slider__value">
      {{ `${attrs.modelValue}` + (attrs.valueUnit || '') }}
    </p>
    <p v-if="attrs.showValue && typeof attrs.modelValue === 'object'" class="c-slider__value">
      {{ `${attrs.modelValue[0]} ~ ${attrs.modelValue[1]}` + (attrs.valueUnit || '') }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { SliderAdapter, SliderBindsOmitKeys, SLIDER_DEFAULT, sliderSlots } from './slider.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useSlider } from './slider.use'
import { Slider } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.slider,
  inheritAttrs: false,
  components: { Slider },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<SliderAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Number, Array] as PropType<number | [number, number]>,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.slider
    const className = dasherize(COMPONENT_NAME.slider)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<SliderAdapter>({
      props,
      defaultOption: SLIDER_DEFAULT,
      type,
      omitKeys: SliderBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useSlider({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: sliderSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(slider) {
  width: 100%;
  @include e(container) {
    width: 100%;
    display: flex;
    align-items: center;
  }

  @include e(value) {
    margin-bottom: 18px;
    margin-left: 8px;

    color: #333;
    font-size: 12px;
    font-weight: 700;
  }
}
</style>
