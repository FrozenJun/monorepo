import http, { AxiosResponse, CancelToken } from 'axios'
import { CANCEL_FLAG, HTTP_DEFAULT_CONFIG } from './http.constant'
import { HttpSendOption, HttpReturnType, HTTP_METHODS } from './http.dto'
import { MockService } from './mock/mock.service'
import { getCancelToken, transformParamsAndHeaders, urlVariableReplace } from './utils'
import _ from 'lodash'
import qs from 'qs'

class HttpService {
  // 用于关闭（abort）axios的接口
  cancelToken?: { cancelToken: CancelToken }

  option: HttpSendOption = {}

  /**
   * 需要获取cancel的方法时预先调用
   */
  preSend(option: HttpSendOption) {
    const { cancel, cancelToken } = getCancelToken()
    this.cancelToken = cancelToken
    this.option = option

    const httpSend = this.send.bind(this)
    const httpSendWidthParams = this.sendWidthParams.bind(this)
    let cancelReturn: HttpReturnType | undefined

    const paramsCancelFalg = option.params && option.params[CANCEL_FLAG]
    const dataCancelFalg = option.data && option.data[CANCEL_FLAG]
    if (paramsCancelFalg || dataCancelFalg) {
      cancelReturn = {
        e: false,
        extra: { httpSend: httpSendWidthParams, cancel },
      }
      Reflect.deleteProperty(paramsCancelFalg ? option.params : option.data, CANCEL_FLAG)
    }

    return {
      cancelReturn,
      httpSend,
    }
  }

  async sendWidthParams(params?: Record<string, any>) {
    if (params) this.option.params = params

    return await this.send(this.option)
  }

  /**
   * 发送请求
   */
  async send<T = any>(option: HttpSendOption = {}): Promise<HttpReturnType<T>> {
    let config = _.cloneDeep(
      _.defaultsDeep(option, this.option, HTTP_DEFAULT_CONFIG)
    ) as HttpSendOption

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

    /**
     * mock数据
     */
    if (config.mock && config.mock.enable) {
      const { isMatch, res } = await MockService.mock(config)
      if (config.mock.force || isMatch) {
        return res
      }
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

  private async sendByHttpMethod(httpSendOption: HttpSendOption) {
    const { method = 'GET' } = httpSendOption

    const SIMPLE_METHODS: HTTP_METHODS[] = ['GET', 'HEAD', 'DELETE', 'OPTIONS']
    if (!SIMPLE_METHODS.includes(method)) transformParamsAndHeaders(httpSendOption)
    if (SIMPLE_METHODS.includes(method)) {
      httpSendOption.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }

    if (this.cancelToken) httpSendOption.cancelToken = this.cancelToken.cancelToken

    const res: AxiosResponse<Record<string, any>> = await http.request(httpSendOption)
    return res
  }
}

// const httpService = new HttpService()
const HttpSend = <T>(
  HttpOption: HttpSendOption
): HttpReturnType<T> | Promise<HttpReturnType<T>> => {
  const { httpSend, cancelReturn } = new HttpService().preSend(HttpOption)
  return cancelReturn || httpSend(HttpOption)
}

const HttpConfig = (UserConfig: HttpSendOption) => {
  _.assign(UserConfig.mock, HTTP_DEFAULT_CONFIG.mock)
  _.assign(HTTP_DEFAULT_CONFIG, UserConfig)
}

export { HttpSend, HttpConfig }
