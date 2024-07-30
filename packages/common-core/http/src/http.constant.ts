import { HttpSendOption } from './http.dto'

export const CANCEL_FLAG = '__CANCEL_TOKEN_FLAG__'

export const HTTP_DEFAULT_CONFIG: HttpSendOption = {
  baseURL: '',
  url: '',
  headers: {},
  params: {},
  method: 'GET',
  bodyType: 'RAW_JSON',
  mock: {
    enable: process.env.NODE_ENV === 'development',
    delay: 1800,
    log: process.env.NODE_ENV === 'development',
    force: false,
    copy: true,
  },
}
