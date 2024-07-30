<template>
  <Upload
    :class="className"
    :ref="$options.name"
    v-bind="binds"
    v-model:file-list="attrs.modelValue"
  >
    <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
      <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
    </template>
  </Upload>
  <Modal :c="attrs.previewModal">
    <Image class="c-upload__modal-image" :c="attrs.previewImage"></Image>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { UploadAdapter, UploadBindsOmitKeys, UPLOAD_DEFAULT, uploadSlots } from './upload.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useUpload } from './upload.use'
import { Upload } from 'ant-design-vue'
import { UploadFile } from 'ant-design-vue'
import { dasherize } from 'common-base/pipe/string'
import Modal from '../../ant-design/modal/modal.vue'
import { useProvider } from '../../utils/hooks/useProvider'
import Image from '../../ant-design/image/image.vue'

export default defineComponent({
  name: COMPONENT_NAME.upload,
  inheritAttrs: false,
  components: { Upload, Modal, Image },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<UploadAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Array as PropType<UploadFile<any>[]>,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.upload
    const className = dasherize(COMPONENT_NAME.upload)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<UploadAdapter>({
      props,
      defaultOption: UPLOAD_DEFAULT,
      type,
      omitKeys: UploadBindsOmitKeys,
    })

    /** 组件输出 */
    const { output } = useUpload({ attrs, ctx, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots } = useCommonSetup({
      attrs,
      output,
      slotTypes: uploadSlots,
    })
    return { className, attrs, binds, computedSlots }
  },
})
</script>

<style lang="scss">
@import '../../styles/export.scss';

$namespace: 'c';

@include b(upload) {
  @include e(modal-image) {
    object-fit: contain;
  }
}
</style>
../modal/modal.vue../image/image.vue