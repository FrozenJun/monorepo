import { HttpSendOption } from '../http.dto'

export interface MockRule {
  method: string
  url: string
  res: Record<string, any> | string | number | ((option: HttpSendOption) => any)
}
