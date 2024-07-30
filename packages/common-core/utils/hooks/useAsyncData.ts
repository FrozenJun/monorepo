import { Canceler } from 'axios'
import _ from 'lodash'
import { ProviderService } from '../service/provider.service'
import { COMPONENT_TYPE } from '../constants/component'
import { computed, nextTick, onMounted, onUnmounted, reactive, Ref, ref, watchEffect } from 'vue'
import { getConfig as getUserConfig } from '../config'
import { ASYNC_DATA_MISSING, ASYNC_DATA_API_INVALID } from '../constants/errors'
import { CANCEL_FLAG } from '../../http/src/http.constant'
import { HttpReturnType } from '../../http/src/http.dto'
import { CommonAdapter } from '../dtos'

const ASYNC_DATA_DEFAULT: AsyncDataAdapter = {
  mode: 'once',
}

export type AsyncDataMode = 'once' | 'paramsChange' | 'always'

export interface AsyncDataAdapter<D = any> extends Partial<CommonAdapter<any, string>> {
  api?(...args: any[]): Promise<HttpReturnType> | HttpReturnType
  params?: Record<string, any>
  /** extraParams会无视paramsHandle注入到params中 */
  extraParams?: Record<string, any>
  paramsHandle?: (params: Record<string, any>) => Record<string, any>
  /** 参数处理拦截器，参数处理将全权交于拦截器处理 */
  paramsInterceptorHandle?: (config: AsyncDataAdapter<D>) => Record<string, any>
  data?: D
  dataHandle?(data: any): D | Promise<D>
  /** 数据处理拦截器，数据处理将全权交于拦截器处理 */
  dataInterceptorHandle?(data: any, config: AsyncDataAdapter<D>): D | Promise<D>
  mode?: AsyncDataMode
  immediate?: boolean
  preventSend?: () => boolean | boolean
  loading?: boolean
  onBeforeSend?(option: AsyncDataAdapter<D>): unknown
  onAfterSend?(res: HttpReturnType, option: AsyncDataAdapter<D>): unknown
  onError?(res: HttpReturnType, option: AsyncDataAdapter<D>): unknown
  onSuccess?(res: HttpReturnType, option: AsyncDataAdapter<D>): unknown
}

export const useAsyncData = <D = any>(baseConfig?: AsyncDataAdapter<D>) => {
  const cid = Math.floor(Math.random() * Math.pow(10, 20)).toString()
  const type = COMPONENT_TYPE.asyncData

  const data: Ref<D | null> = ref(null)
  let c: Canceler | undefined
  let isRegistered = false
  let oldParam: string

  const config = _.defaults(baseConfig, getUserConfig(COMPONENT_TYPE.asyncData), ASYNC_DATA_DEFAULT)

  const computedParams = () => {
    if (config.paramsInterceptorHandle) {
      return config.paramsInterceptorHandle(config)
    }
    const params = config.paramsHandle ? config.paramsHandle(config.params || {}) : config.params
    return config.extraParams ? { ...params, ...config.extraParams } : params
  }
  const params = ref<Record<string, any>>()

  const output = {
    data,
    send,
    setParams,
    setExtraParams,
    sendAlways,
    getConfig,
    setConfig,
  }

  if (!baseConfig || !baseConfig.api) return output

  onMounted(() => {
    if (config.immediate) nextTick(send)
    register()
  })
  onUnmounted(() => {
    logout()
  })
  watchEffect(() => {
    if (config.data) data.value = config.data
  })

  return output

  async function send() {
    if (!config) return
    if (config.preventSend && config.preventSend()) {
      return
    }
    if (config.mode === 'once' && data.value) return
    const newParams = computedParams()
    if (config.mode === 'paramsChange' && oldParam === JSON.stringify(newParams)) return
    return await sendAlways()
  }

  async function sendAlways(): Promise<HttpReturnType> {
    const {
      api,
      onBeforeSend,
      onAfterSend,
      onError,
      onSuccess,
      dataHandle,
      dataInterceptorHandle,
    } = config
    if (!api) return { e: true, error: new Error(ASYNC_DATA_MISSING) }
    /** 如果c存在，说明之前调的接口未结束，执行c()可以abort之前的接口请求 */
    c && c()

    // 每次发送前计算
    params.value = computedParams()
    const { extra } = api({ [CANCEL_FLAG]: true, ..._.cloneDeep(params.value) }) as HttpReturnType
    const { cancel, httpSend } = extra || {}
    /** api可能并不是HttpSend方法,只是个默认值 */
    if (!httpSend) return { e: true, error: new Error(ASYNC_DATA_API_INVALID) }
    c = cancel
    config.loading = true
    _.isFunction(onBeforeSend) && onBeforeSend(config)
    const res = await httpSend()
    // 请求被关闭不需要结束loading状态，因为新的请求已经发出
    if (!res?.error?.__CANCEL__) config.loading = false
    _.isFunction(onAfterSend) && onAfterSend(res, config)
    c = undefined
    if (res.e) {
      _.isFunction(onError) && onError(res, config)
      return res
    }
    oldParam = JSON.stringify(params.value)
    _.isFunction(onSuccess) && onSuccess(res, config)
    if (dataInterceptorHandle) {
      data.value = await dataInterceptorHandle(res.data, config)
      config.data = data.value
      return res
    }
    data.value = dataHandle ? await dataHandle(res.data) : res.data
    config.data = data.value
    return res
  }

  function getConfig<T extends keyof AsyncDataAdapter<D>>(key: T): AsyncDataAdapter<D>[T] {
    if (!config) return
    return config[key]
  }
  function setConfig<T extends keyof AsyncDataAdapter<D>>(key: T, value: AsyncDataAdapter<D>[T]) {
    if (!config) return
    config[key] = value
  }
  function setParams(
    value: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  ) {
    if (!config) return
    if (_.isFunction(value)) {
      config.params = reactive(value(config.params))
    } else {
      config.params = value
    }
  }
  function setExtraParams(
    value: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  ) {
    if (!config) return
    if (_.isFunction(value)) {
      config.extraParams = reactive(value(config.extraParams))
    } else {
      config.extraParams = value
    }
  }

  function register() {
    if (isRegistered || !_.isString(config.n)) return
    ProviderService.register({
      cid,
      name: config.n,
      type,
      output: computed<any>(() => ({
        setParams,
        setExtraParams,
        send: sendAlways,
      })).value,
    })
    isRegistered = true
  }
  function logout() {
    isRegistered && ProviderService.logout(cid)
  }
}
