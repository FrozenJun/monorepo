import { useAuthStore } from '@/store/auth'
import { HttpAppConfig } from '@packages/http'
import { BASE_URL } from '../constant/global'
import { Toast } from '@/utils/toast'
// import { useLogStore } from '@/store/log'

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
    // const logStore = useLogStore()
    // logStore.setLog(option.url + res.data.code + JSON.stringify(res.data.msg))
    try {
      const data = res.data
      if (data.code === 200) {
        if (option.extra && option.extra.successText) {
          Toast(option.extra.successText)
        }
        return {
          e: false,
          data: data.data,
          response: res,
          httpStatus: 200,
        }
      } else if (data.code === 401) {
        useAuthStore().loginOut()
        // Toast('用户信息已过期，请重新登录')
        return {
          e: true,
        }
      } else if (data.code) {
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
