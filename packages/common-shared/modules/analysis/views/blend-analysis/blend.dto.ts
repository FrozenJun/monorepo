import { HttpReturnType } from 'common-core/http/src/http.dto'

export interface BlendOption {
  api(...args: any[]): Promise<HttpReturnType> | HttpReturnType
  paramsHandle?: (params?: Record<string, any>) => Record<string, any>
  dataHandle?(data: any): any | Promise<any>
}
