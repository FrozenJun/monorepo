import { UploadAdapter } from './upload.adapter'
import { computed, ComputedRef, reactive, SetupContext } from 'vue'
import { useModelValue } from '../../utils/hooks/useModelValue'
import _ from 'lodash'

interface UseUploadOpt {
  attrs: ComputedRef<UploadAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useUpload = ({ attrs, ctx, props }: UseUploadOpt) => {
  useModelValue({ props, attrs, ctx })
  if (!attrs.value.previewModal) {
    attrs.value.previewModal = reactive({})
  }
  if (!attrs.value.previewImage) {
    attrs.value.previewImage = reactive({})
  }

  const output = computed(() => ({}))
  return { output }
}
