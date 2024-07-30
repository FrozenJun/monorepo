<template>
  <Switch :class="className" :ref="$options.name" v-bind="binds" v-model:checked="attrs.modelValue">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Switch>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  SwitchAdapter,
  SwitchBindsOmitKeys,
  SWITCH_DEFAULT,
  switchSlots,
  switchProps,
} from './switch.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useSwitch } from './switch.use'
import { Switch } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.switch,
  inheritAttrs: false,
  components: { Switch },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<SwitchAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Boolean, Number, String],
    },
    ...switchProps,
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.switch
    const className = dasherize(COMPONENT_NAME.switch)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<SwitchAdapter>({
      props,
      defaultOption: SWITCH_DEFAULT,
      type,
      omitKeys: SwitchBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useSwitch({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: switchSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
