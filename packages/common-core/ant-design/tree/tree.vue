<template>
  <Tree
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:checkedKeys="attrs.checkedKeys"
    v-model:expandedKeys="attrs.expandedKeys"
    v-model:selectedKeys="attrs.selectedKeys"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Tree>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { TreeAdapter, TreeBindsOmitKeys, TREE_DEFAULT, treeSlots } from './tree.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTree } from './tree.use'
import { Tree } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.tree,
  inheritAttrs: false,
  components: { Tree },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<TreeAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.tree
    const className = dasherize(COMPONENT_NAME.tree)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TreeAdapter>({
      props,
      defaultOption: TREE_DEFAULT,
      type,
      omitKeys: TreeBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTree({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: treeSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
