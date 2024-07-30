import { ComponentInternalInstance } from 'vue'

export interface CommonStates<T> {
  state: string
  states: { name: string; c: T }[]
}
export interface CommonAdapter<T, S extends string> {
  /** 组件名称，用于区分相同组件 */
  n?: string

  /** 组件的slot别名，用于精准的slot注入 */
  slotAlias?: Partial<Record<S, string>>

  states?: CommonStates<T>

  /** 自定义的字段存放的对象 */
  extra?: Record<string | symbol, any>

  /** 用于区分组件是否是内部组件 */
  __INNER__?: boolean
}
export interface ComponentCallbackInjectParam<T = Record<string, any>, M = Record<string, any>> {
  attrs: T
  output: M
  instance: ComponentInternalInstance
  preload?: any
}

export interface ElCommonAdapter<T, M, S extends string> extends CommonAdapter<T, S> {
  /** setup执行时的回调 */
  onSetup?(data: { attrs: T; output: M; instance: ComponentInternalInstance | null }): void
}

export interface ElFormCtrlCommonAdapter<T, M, S extends string> extends ElCommonAdapter<T, M, S> {
  onModelChange?(
    value: any,
    oldValue: any,
    componentData?: ComponentCallbackInjectParam<T, M>
  ): unknown
}

// export interface VeeValidateConfi
export interface ValidateResult {
  valid: boolean
  errors: Record<string, string>
}
