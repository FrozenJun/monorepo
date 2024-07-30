import { FormItemAdapter, FormItemAlign } from '../form-item/form-item.adapter'
import { FormProps } from 'ant-design-vue'
import { ComponentCallbackInjectParam, ElCommonAdapter, ValidateResult } from '../../utils/dtos'
import { AsyncDataAdapter } from '../../utils/hooks/useAsyncData'
import { HttpReturnType } from '../../http/src/http.dto'

export type FormSlots = 'default'
export const formSlots = ['default']

export const FormBindsOmitKeys: (keyof FormAdapter)[] = [
  'itemWidth',
  'itemAlign',
  'formItems',
  'models',
  'max',
]
export interface FormAdapter
  extends Partial<
    Omit<FormProps, 'onValidate'> & ElCommonAdapter<FormAdapter, FormOutput, FormSlots>
  > {
  itemWidth?: string
  itemAlign?: FormItemAlign
  formItems?: FormItemAdapter[]
  models?: Record<string, any>
  modelsHandler?: (models: Record<string, any>) => Record<string, any>
  modelsOutput?: Record<string, any> // 经过modelsHandler处理后的models

  /** 最多显示多少个formItem */
  max?: number

  onValidate?(validateResult: ValidateResult): unknown

  submit?: AsyncDataAdapter

  asyncModels?: AsyncDataAdapter<Record<string, any>>

  /** 当前form在form array中的index */
  formIndex?: number

  onModelsChange?(
    models: Record<string, any>,
    prevModels: Record<string, any>,
    componentData: ComponentCallbackInjectParam<FormAdapter, FormOutput>
  ): unknown
}

export interface FormOutput {
  validate(cb?: (validateResult: ValidateResult) => unknown): Promise<ValidateResult>
  reset(): unknown
  resetValidate(): unknown
  setOriginalModals(models: Record<string, any>): unknown
  setModels(
    models: Record<string, any> | ((models?: Record<string, any>) => Record<string, any>)
  ): unknown
  submit(cb?: (httpReturn: HttpReturnType) => unknown): Promise<HttpReturnType>
  initModelsAsync(cb?: (httpReturn: HttpReturnType) => unknown): Promise<HttpReturnType>
}

export const FORM_DEFAULT: FormAdapter = {
  models: {},
  submit: {
    immediate: false,
    mode: 'always',
  },
}
