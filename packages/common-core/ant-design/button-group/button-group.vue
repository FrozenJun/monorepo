<template>
  <ButtonGroup :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </ButtonGroup>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  ButtonGroupAdapter,
  ButtonGroupBindsOmitKeys,
  BUTTON_GROUP_DEFAULT,
} from './button-group.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useButtonGroup } from './button-group.use'
import { ButtonGroup } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.buttonGroup,
  inheritAttrs: false,
  components: { ButtonGroup },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<ButtonGroupAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.buttonGroup
    const className = dasherize(COMPONENT_NAME.buttonGroup)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<ButtonGroupAdapter>({
      props,
      defaultOption: BUTTON_GROUP_DEFAULT,
      type,
      omitKeys: ButtonGroupBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useButtonGroup({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({ attrs, output })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
