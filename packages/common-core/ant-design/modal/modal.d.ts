import { LegacyButtonType } from 'ant-design-vue/lib/button/buttonTypes'
import { VueNode } from 'ant-design-vue/lib/_util/type'
import { CSSProperties, ExtractPropTypes, PropType } from 'vue'
type ButtonSize = 'small' | 'middle' | 'large' | undefined

declare type getContainerFunc = () => HTMLElement
export declare const modalProps: () => {
  prefixCls: StringConstructor
  visible: {
    type: BooleanConstructor
    default: any
  }
  confirmLoading: {
    type: BooleanConstructor
    default: any
  }
  title: import('vue-types').VueTypeValidableDef<any>
  closable: {
    type: BooleanConstructor
    default: any
  }
  closeIcon: import('vue-types').VueTypeValidableDef<any>
  onOk: PropType<(e: MouseEvent) => void>
  onCancel: PropType<(e: MouseEvent) => void>
  'onUpdate:visible': PropType<(visible: boolean) => void>
  onChange: PropType<(visible: boolean) => void>
  afterClose: PropType<() => void>
  centered: {
    type: BooleanConstructor
    default: any
  }
  width: (StringConstructor | NumberConstructor)[]
  footer: import('vue-types').VueTypeValidableDef<any>
  okText: import('vue-types').VueTypeValidableDef<any>
  okType: PropType<LegacyButtonType>
  cancelText: import('vue-types').VueTypeValidableDef<any>
  icon: import('vue-types').VueTypeValidableDef<any>
  maskClosable: {
    type: BooleanConstructor
    default: any
  }
  forceRender: {
    type: BooleanConstructor
    default: any
  }
  okButtonProps: PropType<
    Partial<
      ExtractPropTypes<{
        prefixCls: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        type: import('vue-types').VueTypeDef<
          'default' | 'link' | 'text' | 'dashed' | 'ghost' | 'primary'
        >
        htmlType: import('vue-types').VueTypeDef<'submit' | 'button' | 'reset'> & {
          default: 'submit' | 'button' | 'reset'
        }
        shape: import('vue-types').VueTypeDef<'default' | 'circle' | 'round'>
        size: {
          type: PropType<ButtonSize>
        }
        loading: {
          type: PropType<
            | boolean
            | {
                delay?: number
              }
          >
          default: () =>
            | boolean
            | {
                delay?: number
              }
        }
        disabled: import('vue-types').VueTypeValidableDef<boolean>
        ghost: import('vue-types').VueTypeValidableDef<boolean>
        block: import('vue-types').VueTypeValidableDef<boolean>
        danger: import('vue-types').VueTypeValidableDef<boolean>
        icon: import('vue-types').VueTypeValidableDef<any>
        href: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        target: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        title: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        onClick: {
          type: PropType<(event: MouseEvent) => void>
        }
      }>
    >
  >
  cancelButtonProps: PropType<
    Partial<
      ExtractPropTypes<{
        prefixCls: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        type: import('vue-types').VueTypeDef<
          'default' | 'link' | 'text' | 'dashed' | 'ghost' | 'primary'
        >
        htmlType: import('vue-types').VueTypeDef<'submit' | 'button' | 'reset'> & {
          default: 'submit' | 'button' | 'reset'
        }
        shape: import('vue-types').VueTypeDef<'default' | 'circle' | 'round'>
        size: {
          type: PropType<ButtonSize>
        }
        loading: {
          type: PropType<
            | boolean
            | {
                delay?: number
              }
          >
          default: () =>
            | boolean
            | {
                delay?: number
              }
        }
        disabled: import('vue-types').VueTypeValidableDef<boolean>
        ghost: import('vue-types').VueTypeValidableDef<boolean>
        block: import('vue-types').VueTypeValidableDef<boolean>
        danger: import('vue-types').VueTypeValidableDef<boolean>
        icon: import('vue-types').VueTypeValidableDef<any>
        href: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        target: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        title: import('vue-types').VueTypeValidableDef<string> & {
          default: string
        }
        onClick: {
          type: PropType<(event: MouseEvent) => void>
        }
      }>
    >
  >
  destroyOnClose: {
    type: BooleanConstructor
    default: any
  }
  wrapClassName: StringConstructor
  maskTransitionName: StringConstructor
  transitionName: StringConstructor
  getContainer: {
    type: PropType<string | false | HTMLElement | getContainerFunc>
    default: any
  }
  zIndex: NumberConstructor
  bodyStyle: PropType<CSSProperties>
  maskStyle: PropType<CSSProperties>
  mask: {
    type: BooleanConstructor
    default: any
  }
  keyboard: {
    type: BooleanConstructor
    default: any
  }
  wrapProps: ObjectConstructor
  focusTriggerAfterClose: {
    type: BooleanConstructor
    default: any
  }
  modalRender: PropType<(arg: { originVNode: VueNode }) => VueNode>
}
