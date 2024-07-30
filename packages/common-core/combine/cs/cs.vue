<template>
  <Form
    :class="className"
    :ref="$options.name"
    :c="setInner(attrs.form)"
    @output-change="onOutputChange('formOutput', $event)"
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
    <template #csSearchButton>
      <div class="cs__operate">
        <Button :c="searchButton"></Button>
        <Button :c="resetButton"></Button>
      </div>
    </template>
  </Form>
  <slot name="csAppend"></slot>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import { CsAdapter, CsBindsOmitKeys, CS_DEFAULT, csSlots } from './cs.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCs } from './cs.use'
import { dasherize } from 'common-base/pipe/string'
import Form from '../../ant-design/form/form.vue'
import Button from '../../ant-design/button/button.vue'

export default defineComponent({
  name: COMPONENT_NAME.cs,
  inheritAttrs: false,
  components: { Form, Button },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<Record<string, any>>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.cs
    const className = dasherize(COMPONENT_NAME.cs)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CsAdapter>({
      props,
      defaultOption: CS_DEFAULT,
      type,
      omitKeys: CsBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, state, onOutputChange } = useCs({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: csSlots,
    })
    return {
      className,
      attrs,
      computedSlots,
      onOutputChange,
      setInner,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

@include b(cs) {
  padding: 10px 10px 0;

  .c-form-item__item {
    margin-bottom: 10px;
    margin-right: 0;
    padding-right: 16px;
  }

  @include e(operate) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .c-button {
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
