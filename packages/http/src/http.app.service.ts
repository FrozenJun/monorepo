import Request, { HttpResponse } from 'luch-request'
import { HTTP_DEFAULT_CONFIG } from './http.constant'
import { HttpAppSendOption, HttpReturnType, HTTP_METHODS } from './http.dto'
import { transformParamsAndHeaders, urlVariableReplace } from './utils'
import _ from 'lodash'
import qs from 'qs'

class HttpService {
  option: HttpAppSendOption = {}

  /**
   * 需要获取cancel的方法时预先调用
   */
  preSend(option: HttpAppSendOption) {
    this.option = option
    const httpSend = this.send.bind(this)
    return {
      httpSend,
    }
  }
  /**
   * 发送请求
   */
  async send<T = any>(option: HttpAppSendOption = {}): Promise<HttpReturnType<T>> {
    let config = _.cloneDeep(
      _.defaultsDeep(option, this.option, HTTP_DEFAULT_CONFIG)
    ) as HttpAppSendOption

    /**
     * onRequest、urlVariableReplace可能会改变params，为防止用户传入对象被改变，这里深拷贝一下
     */
    if (config.params) config.params = _.cloneDeep(config.params)

    /**
     * 执行onRequest函数钩子
     */
    if (config.onRequest) {
      config = await config.onRequest(config)
    }

    urlVariableReplace(config)
    /**
     * 开始发送
     */
    try {
      const res = await this.sendByHttpMethod(config)
      // 延迟操作
      if (config.delay) {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(666)
          }, config.delay * 1000)
        })
      }
      return config.onResponse
        ? await config.onResponse(res, config)
        : {
            e: false,
            response: res,
            httpStatus: 200,
          }
    } catch (e: any) {
      // 如果请求被cancel，不做任何处理
      if (!e.__CANCEL__ && config.onError && e.response) {
        await config.onError(e.response.data, config, e.response.status)
      }

      // 可能不是http错误请求，也有可能是代码，配置导致的错误
      return {
        e: true,
        error: e as Error,
        httpStatus: e.response && e.response.status,
        response: e.response,
      }
    }
  }

  private async sendByHttpMethod(httpSendOption: HttpAppSendOption) {
    const { method = 'GET' } = httpSendOption

    const SIMPLE_METHODS: HTTP_METHODS[] = ['GET', 'HEAD', 'DELETE', 'OPTIONS']
    if (!SIMPLE_METHODS.includes(method)) transformParamsAndHeaders(httpSendOption)
    if (SIMPLE_METHODS.includes(method)) {
      httpSendOption.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    const http = new Request()
    const res: HttpResponse<Record<string, any>> = await http.request(httpSendOption)
    return res
  }
}

const HttpAppSend = <T>(
  HttpOption: HttpAppSendOption
): HttpReturnType<T> | Promise<HttpReturnType<T>> => {
  const { httpSend } = new HttpService().preSend(HttpOption)
  return httpSend(HttpOption)
}

const HttpAppConfig = (UserConfig: HttpAppSendOption) => {
  _.assign(UserConfig.mock, HTTP_DEFAULT_CONFIG.mock)
  _.assign(HTTP_DEFAULT_CONFIG, UserConfig)
}

export { HttpAppSend, HttpAppConfig }
