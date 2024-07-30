<template>
  <TreeSelect
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:value="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </TreeSelect>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  TreeSelectAdapter,
  TreeSelectBindsOmitKeys,
  TREE_SELECT_DEFAULT,
  treeSelectSlots,
} from './tree-select.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTreeSelect } from './tree-select.use'
import { TreeSelect } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.treeSelect,
  inheritAttrs: false,
  components: { TreeSelect },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<TreeSelectAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: [Array, String] as PropType<string[] | string>,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.treeSelect
    const className = dasherize(COMPONENT_NAME.treeSelect)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TreeSelectAdapter>({
      props,
      defaultOption: TREE_SELECT_DEFAULT,
      type,
      omitKeys: TreeSelectBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTreeSelect({ props, attrs, ctx })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: treeSelectSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
