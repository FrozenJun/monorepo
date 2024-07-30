<template>
  <Modal
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:visible="attrs.visible"
    :style="{ minWidth: attrs.minWidth }"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import {
  ModalAdapter,
  ModalBindsOmitKeys,
  MODAL_DEFAULT,
  modalSlots,
  modalProps,
} from './modal.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useModal } from './modal.use'
import { Modal } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'

export default defineComponent({
  name: COMPONENT_NAME.modal,
  inheritAttrs: false,
  components: { Modal },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<ModalAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    ...modalProps(),
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.modal
    const className = dasherize(COMPONENT_NAME.modal)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<ModalAdapter>({
      props,
      defaultOption: MODAL_DEFAULT,
      type,
      omitKeys: ModalBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useModal({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: modalSlots,
    })

    return { className, attrs, binds, computedSlots }
  },
})
</script>
