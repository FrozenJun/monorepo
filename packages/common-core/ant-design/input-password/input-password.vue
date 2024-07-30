<template>
  <InputPassword
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </InputPassword>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  InputPasswordAdapter,
  InputPasswordBindsOmitKeys,
  INPUT_PASSWORD_DEFAULT,
  inputPasswordSlots,
} from './input-password.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useInputPassword } from './input-password.use'
import { InputPassword } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.inputPassword,
  inheritAttrs: false,
  components: { InputPassword },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<InputPasswordAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.inputPassword
    const className = dasherize(COMPONENT_NAME.inputPassword)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<InputPasswordAdapter>({
      props,
      defaultOption: INPUT_PASSWORD_DEFAULT,
      type,
      omitKeys: InputPasswordBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useInputPassword({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: inputPasswordSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
