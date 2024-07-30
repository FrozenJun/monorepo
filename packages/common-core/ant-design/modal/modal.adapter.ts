import { ModalProps } from 'ant-design-vue'
import { ElCommonAdapter } from '../../utils/dtos'
import _vueTypes from 'ant-design-vue/lib/_util/vue-types'

export type ModalSlots = 'default' | 'title' | 'footer'
export const modalSlots = ['default', 'title', 'footer']

export const ModalBindsOmitKeys: (keyof ModalAdapter)[] = ['minWidth', 'preload']
export interface ModalAdapter
  extends Partial<ModalProps & ElCommonAdapter<ModalAdapter, ModalOutput, ModalSlots>> {
  preload?: any
  minWidth?: string

  style?: Record<string, any>
}

export interface ModalOutput {
  open(preload?: any): void
  close(preload?: any): void
  data: ModalAdapter
}

export const MODAL_DEFAULT: ModalAdapter = {}

export function modalProps() {
  return {
    prefixCls: String,
    visible: {
      type: Boolean,
      default: undefined,
    },
    confirmLoading: {
      type: Boolean,
      default: undefined,
    },
    title: _vueTypes.any,
    closable: {
      type: Boolean,
      default: undefined,
    },
    closeIcon: _vueTypes.any,
    onOk: Function,
    onCancel: Function,
    'onUpdate:visible': Function,
    onChange: Function,
    afterClose: Function,
    centered: {
      type: Boolean,
      default: undefined,
    },
    width: [String, Number],
    footer: _vueTypes.any,
    okText: _vueTypes.any,
    okType: String,
    cancelText: _vueTypes.any,
    icon: _vueTypes.any,
    maskClosable: {
      type: Boolean,
      default: undefined,
    },
    forceRender: {
      type: Boolean,
      default: undefined,
    },
    okButtonProps: Object,
    cancelButtonProps: Object,
    destroyOnClose: {
      type: Boolean,
      default: undefined,
    },
    wrapClassName: String,
    maskTransitionName: String,
    transitionName: String,
    getContainer: {
      type: [String, Function, Boolean, Object],
      default: undefined,
    },
    zIndex: Number,
    bodyStyle: Object,
    maskStyle: Object,
    mask: {
      type: Boolean,
      default: undefined,
    },
    keyboard: {
      type: Boolean,
      default: undefined,
    },
    wrapProps: Object,
    focusTriggerAfterClose: {
      type: Boolean,
      default: undefined,
    },
    modalRender: Function,
  }
}
