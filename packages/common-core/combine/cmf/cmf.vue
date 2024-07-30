<template>
  <Modal
    :class="className"
    :ref="$options.name"
    @output-change="onOutputChange('modalOutput', $event)"
    :c="setInner(attrs.modal)"
  >
    <a-spin :spinning="attrs.loading">
      <Form
        class="cmf__form"
        @output-change="onOutputChange('formOutput', $event)"
        :c="setInner(attrs.form)"
      >
        <template v-for="(_, slot) in $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope"></slot>
        </template>
      </Form>
      <slot name="cmf-append"></slot>
    </a-spin>
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import { CmfAdapter, CmfBindsOmitKeys, CMF_DEFAULT, cmfSlots } from './cmf.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCmf } from './cmf.use'
import { dasherize } from 'common-base/pipe/string'
import Modal from '../../ant-design/modal/modal.vue'
import Form from '../../ant-design/form/form.vue'

export default defineComponent({
  name: COMPONENT_NAME.cmf,
  inheritAttrs: false,
  components: { Modal, Form },
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
    const type = COMPONENT_TYPE.cmf
    const className = dasherize(COMPONENT_NAME.cmf)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CmfAdapter>({
      props,
      defaultOption: CMF_DEFAULT,
      type,
      omitKeys: CmfBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, onOutputChange, state } = useCmf({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: cmfSlots,
    })

    return {
      className,
      attrs,
      binds,
      computedSlots,
      setInner,
      onOutputChange,
      ...toRefs(state),
    }
  },
})
</script>
