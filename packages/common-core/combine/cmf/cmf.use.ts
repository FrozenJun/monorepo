import { ModalOutput } from '../../ant-design/modal/modal.adapter'
import { CmfAdapter, CmfOutput } from './cmf.adapter'
import { computed, ComputedRef, nextTick, reactive } from 'vue'
import { FormOutput } from '../../ant-design/form/form.adapter'
import { useOutputChange } from '../../utils/hooks/useOutputChange'
import _ from 'lodash'

interface UseCmfOpt {
  attrs: ComputedRef<CmfAdapter>
}

export interface CeState {
  modalOutput: Partial<ModalOutput>
  formOutput: Partial<FormOutput>
}
export const useCmf = ({ attrs }: UseCmfOpt) => {
  const state = reactive<CeState>({
    modalOutput: {},
    formOutput: {},
  })

  /** Modal 操作 */
  function modalOpen(preload?: any) {
    state.modalOutput.open && state.modalOutput.open(preload)
    if (attrs.value.form && _.isPlainObject(preload)) {
      /** 防止form models初始化有值 - 直接赋值form中models的watch不一定会检测到变化 */
      nextTick(() => _.assign(attrs.value.form!.models, preload))
    }
  }
  /** Form 操作 */
  function reset({ delay }: { delay?: number } = {}) {
    if (state.formOutput.reset) {
      delay ? setTimeout(state.formOutput.reset, delay) : state.formOutput.reset()
    }
  }
  const output = computed<CmfOutput>(() => {
    return {
      ...(state.modalOutput as ModalOutput),
      ...(state.formOutput as FormOutput),
      open: modalOpen,
      data: attrs.value,
    }
  })

  /** 关闭时重置表单 */
  if (!attrs.value.modal) attrs.value.modal = {}
  const closeFn = attrs.value.modal.onCancel
  attrs.value.modal.onCancel = (e) => {
    closeFn && closeFn(e)
    // 等关闭动画结束后再调用
    setTimeout(reset, 300)
  }

  const { onOutputChange } = useOutputChange(state)
  return { output, onOutputChange, state }
}
