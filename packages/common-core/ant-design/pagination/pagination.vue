<template>
  <Pagination :class="className" :ref="$options.name" v-bind="binds">
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Pagination>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  PaginationAdapter,
  PaginationBindsOmitKeys,
  PAGINATION_DEFAULT,
  paginationSlots,
} from './pagination.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { usePagination } from './pagination.use'
import { Pagination } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.pagination,
  inheritAttrs: false,
  components: { Pagination },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<PaginationAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.pagination
    const className = dasherize(COMPONENT_NAME.pagination)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<PaginationAdapter>({
      props,
      defaultOption: PAGINATION_DEFAULT,
      type,
      omitKeys: PaginationBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = usePagination({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: paginationSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
