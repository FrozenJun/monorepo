<template>
  <Ct :class="className" :ref="$options.name" :c="ct">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
  </Ct>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  TableFormAdapter,
  TableFormBindsOmitKeys,
  TABLE_FORM_DEFAULT,
  tableFormSlots,
} from './table-form.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useTableForm } from './table-form.use'
import { dasherize } from 'common-base/pipe/string'
import Ct from '../ct/ct.vue'

export default defineComponent({
  name: COMPONENT_NAME.tableForm,
  inheritAttrs: false,
  components: {
    Ct,
  }, // 解决循环引用问题 },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<TableFormAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Array,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.tableForm
    const className = dasherize(COMPONENT_NAME.tableForm)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<TableFormAdapter>({
      props,
      defaultOption: TABLE_FORM_DEFAULT,
      type,
      omitKeys: TableFormBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, ct } = useTableForm({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: tableFormSlots,
    })

    return { className, attrs, binds, computedSlots, ct }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(table-form) {
  .ant-table-content {
    @include scroll-bar();
  }
}
</style>
