import { HttpConfig } from 'common-core/http'
import { message } from 'ant-design-vue'

HttpConfig({
  timeout: 60000,
  baseURL: import.meta.env.VITE_BASE_URL as string,
  onRequest(options) {
    return options
  },
  onResponse(res, option) {
    try {
      const data = res.data
      if (data.code === 200) {
        if (option.extra && option.extra.successText) {
          message.success(data.msg || option.extra.successText)
        }
        return {
          e: false,
          data: data.data,
          response: res,
          httpStatus: 200,
        }
      } else {
        if (!option.extra || !option.extra.noMessage) {
          message.error((option.extra && option.extra.errorText) || data.msg)
        }
        return {
          e: true,
          error: new Error(data.msg),
          response: res,
          httpStatus: 200,
        }
      }
    } catch (e: any) {
      console.error(e)
      message.error('服务器发生错误')
      return {
        e: true,
        error: e,
        response: res,
        httpStatus: 200,
      }
    }
  },
  onError(res = {}, option = {}) {
    const errorText = option.extra && option.extra.errorText
    message.error(errorText || res.msg || '服务器发生错误')
  },
})
