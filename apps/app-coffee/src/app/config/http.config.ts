import { useAuthStore } from '@/store/auth'
import Toast from '@/wxcomponents/toast/toast'
import { HttpAppConfig } from 'common-core/http'
import { BASE_URL } from '../constant/global'
import { useLogStore } from '@/store/log'

HttpAppConfig({
  timeout: 60000,
  baseURL: BASE_URL,
  onRequest(options) {
    const token = useAuthStore().getToken()
    if (token) {
      options.header = {
        ...options.header,
        Authorization: 'Bearer ' + token,
      }
    }
    return options
  },
  onResponse(res, option) {
    const logStore = useLogStore()
    logStore.setLog(option.url + res.data.code + JSON.stringify(res.data.msg))
    try {
      const data = res.data
      if (data.code === 200) {
        if (option.extra && option.extra.successText) {
          Toast.success(option.extra.successText)
        }
        return {
          e: false,
          data: data.data,
          response: res,
          httpStatus: 200,
        }
      } else if (data.code === 401) {
        return {
          e: true,
        }
      } else if (data.code > 200 && data.code < 500) {
        if (!option.extra || !option.extra.noMessage) {
          Toast((option.extra && option.extra.errorText) || data.msg)
        }
        return {
          e: true,
          error: new Error(data.msg),
          response: res,
          httpStatus: 200,
        }
      } else {
        if (!option.extra || !option.extra.noMessage) {
          Toast((option.extra && option.extra.errorText) || '服务器内部错误')
        }
        return {
          e: true,
          error: new Error(data.msg),
          response: res,
          httpStatus: 200,
        }
      }
    } catch (e: any) {
      Toast(e)
      return {
        e: true,
        error: e,
        response: res,
        httpStatus: 200,
      }
    }
  },
  onError(res = {}, option = {}, status) {
    const errorText = option.extra && option.extra.errorText
  },
})
