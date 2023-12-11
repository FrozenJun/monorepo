import qs from 'qs'
import http, { Canceler } from 'axios'
import { HttpSendOption } from './http.dto'
import _ from 'lodash'

/**
 * 获取cancel接口的方法
 */
export function getCancelToken() {
  let cancel: Canceler | undefined

  const cancelToken = {
    cancelToken: new http.CancelToken((c) => {
      cancel = c
    }),
  }
  return { cancelToken, cancel }
}

/**
 * url中有变量时，解析变量并删除params中对应的参数
 * ```javascript
 * urlVariableReplace({ url: '/test/{id}', params: { id: 1 } }) => { url: '/test/1', params: {} }
 * ```
 */
export function urlVariableReplace(option: HttpSendOption) {
  const URL_VARIABLE_REGEXP = /\{[a-zA-Z_$]([a-zA-Z0-9_$]{0,})\}/g

  if (!option.url || !option.params) return
  const matchs = option.url.match(URL_VARIABLE_REGEXP)
  if (!matchs) return
  matchs.forEach((match) => {
    const key = match.substring(1, match.length - 1)
    if (option.params && option.params[key]) {
      option.url = option.url!.replace(match, String(option.params[key]))
      Reflect.deleteProperty(option.params, key)
    }
  })
}

/**
 * 根据bodyType转换params格式、设置headers
 */
export function transformParamsAndHeaders(httpSendOption: HttpSendOption) {
  const { bodyType, params, headers, data } = httpSendOption
  switch (bodyType) {
    case 'FORM_DATA':
      httpSendOption.data = transformToFormData(data)
      break
    case 'RAW_JSON':
      _.assign(headers, {
        'Content-Type': 'application/json;charset=UTF-8',
      })
      break
    case 'X_WWW_FORM_URLENCODED':
      _.assign(headers, {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      })
      httpSendOption.data = qs.stringify(data)
  }
  return httpSendOption
}

/**
 * 转换对象为FormData格式
 */
function transformToFormData(body: Record<string, any>): FormData {
  const formData = new FormData()
  _.forOwn(body, (value, key) => {
    // 对于file类型和file列表的特殊处理
    if (_.isArray(value) && value.every(isFile)) {
      value.forEach((file: File) => formData.append(key, file, file.name))
    } else if (isFile(value)) {
      formData.append(key, value, value.name)
    } else {
      formData.append(key, value)
    }
  })
  return formData
}

function isFile(target: any) {
  return Reflect.toString.call(target) === '[object File]'
}
