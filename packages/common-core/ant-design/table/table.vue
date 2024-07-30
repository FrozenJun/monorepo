<template>
  <Table :class="className" :ref="$options.name" v-bind="binds" >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
    <template #emptyText>
      <a-empty :image="simpleImage" />
    </template>
  </Table>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { TableAdapter, TableBindsOmitKeys, TABLE_DEFAULT, tableSlots } from './table.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTable } from './table.use'
import { Table } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import { Empty } from 'ant-design-vue'
export default defineComponent({
  name: COMPONENT_NAME.table,
  inheritAttrs: false,
  components: { Table },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<TableAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.table
    const className = dasherize(COMPONENT_NAME.table)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TableAdapter>({
      props,
      defaultOption: TABLE_DEFAULT,
      type,
      omitKeys: TableBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useTable({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: tableSlots,
    })

    return { className, attrs, binds, computedSlots, simpleImage: Empty.PRESENTED_IMAGE_SIMPLE }
  },
})
</script>
