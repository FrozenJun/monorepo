<template>
  <Popconfirm :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Popconfirm>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  PopconfirmAdapter,
  PopconfirmBindsOmitKeys,
  POPCONFIRM_DEFAULT,
  popconfirmSlots,
} from './popconfirm.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { usePopconfirm } from './popconfirm.use'
import { Popconfirm } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.popconfirm,
  inheritAttrs: false,
  components: { Popconfirm },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<PopconfirmAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.popconfirm
    const className = dasherize(COMPONENT_NAME.popconfirm)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<PopconfirmAdapter>({
      props,
      defaultOption: POPCONFIRM_DEFAULT,
      type,
      omitKeys: PopconfirmBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = usePopconfirm({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: popconfirmSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
