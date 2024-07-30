import { AxiosRequestConfig, AxiosResponse } from 'axios'
export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
export type HTTP_BODY_TYPES = 'RAW_JSON' | 'FORM_DATA' | 'X_WWW_FORM_URLENCODED' | 'CUSTOM'

export interface HttpReturnType<T = any> {
  e: boolean
  error?: Error
  // 请求成功后直接可用的数据
  data?: T
  response?: any
  httpStatus?: number

  /** 自定义设置 */
  extra?: Record<string, any>
}

export interface HttpMockType {
  /** 是否开启Mock */
  enable?: boolean
  /** 请求延迟，单位：毫秒，默认：`300` */
  delay?: number
  log?: boolean
  force?: boolean
  copy?: boolean
  data?: Record<string, any>
}

export interface HttpSendOption extends AxiosRequestConfig {
  method?: HTTP_METHODS
  bodyType?: HTTP_BODY_TYPES

  onResponse?(
    res: AxiosResponse<Record<string, any>>,
    option: HttpSendOption
  ): HttpReturnType | Promise<HttpReturnType>
  onError?: (
    res: Record<string, any>,
    option: HttpSendOption,
    httpStatus: number
  ) => void | Promise<void>
  onRequest?(options: HttpSendOption): HttpSendOption | Promise<HttpSendOption>

  /** MOCK相关 */
  mock?: HttpMockType

  /** 自定义设置 */
  extra?: Record<string, any>

  // 延迟操作(秒)
  delay?: number

  // 路径参数对象，仅在存在请求体并且请求体是数组时需要
  pathParams?: Record<string, any>
}
