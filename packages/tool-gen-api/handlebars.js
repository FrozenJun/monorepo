const DATA_ARRAY_KEY = 'DATA_ARRAY'

module.exports = function (httpName = 'HttpSend') {
  return function (handlebars) {
    handlebars.registerPartial('indexImportPartial', genImport),
      handlebars.registerPartial('customServicePartial', function (variant = {}) {
        try {
          const { operation = {}, methodName = '', successResponse = {} } = variant

          const paths = getPathParams(operation.path)
          // 存在相同名属性时，parameters优先与paths
          const querys = operation.parameters || []
          const params = [
            ...querys,
            ...paths
              .filter((i) => !querys.find((j) => j.name === i))
              .map((i) => ({ name: i, type: 'string | number' })),
          ]
          const queryParams = getQueryParams(params)
          const body = getBodyParams(operation.requestBody)
          const paramsType = getParamsType(body.params, queryParams) || '{}'

          const mediaType = operation.requestBody?.content[0].mediaType
          const method = operation.method?.toUpperCase()
          const isBodyMathod = ['POST', 'PUT', 'PATCH'].includes(method)
          const paramTemp = !isBodyMathod ? `params,` : ''
          const bodyTemp = isBodyMathod
            ? body.isDataArray
              ? `data: params && params['${DATA_ARRAY_KEY}'],`
              : 'data: params,' // 存在paths时需要全部传入，在url处理时提取DATA_ARRAY
            : ''
          // 路径参数对象，仅在存在请求体并且请求体是数组时需要
          const pathTemp =
            isBodyMathod && body.isDataArray && paths.length
              ? `
      pathParams: params,`
              : ''

          // 从字符串的末尾移除一个由1到3个数字组成的子字符串，同时保留该子字符串前面的字母部分,应对java方法的重载
          const name = methodName.replace(/([a-zA-Z]*)[\d]{1,3}$/, '$1')
          const resType = getResponseType(successResponse?.type)

          return `  /**
   * ${operation.spec?.summary}
   */
  ${name}(params?: ${paramsType}) {
    return ${httpName}<${resType}>({
      url: '${operation.path}', 
      ${
        mediaType === 'multipart/form-data'
          ? "bodyType: 'FORM_DATA',"
          : mediaType === 'application/json'
          ? "bodyType: 'RAW_JSON',"
          : "bodyType: 'X_WWW_FORM_URLENCODED',"
      }
      ${paramTemp}${bodyTemp}${pathTemp}
      method: '${method}',${
            methodName.toLowerCase().includes('export') || methodName.includes('downloadFile')
              ? `
      onResponse(res) {
        return {
          data: res.data,
          e: false,
        }
      },
      responseType: 'blob'`
              : ''
          }
    })
  }
      `
        } catch (e) {
          console.error(e)
        }
      })
  }
}

/**
 * params参数类型
 */
function getParamsType(bodyParams, queryParams) {
  return [bodyParams, queryParams].filter(Boolean).join(' & ')
}
// 解析路径上的参数,匹配{}，可能有多个,非贪婪匹配
function getPathParams(path) {
  const pathParamArr = path.match(/{.*?}/g)
  return pathParamArr ? pathParamArr.map((i) => i.slice(1, i.length - 1)) : []
}
function getQueryParams(paramsList) {
  if (!paramsList.length) return ''
  return `{
  ${paramsList
    .map(({ name = '', type = '', tsComments = '', required = false }) => {
      // 排除VERSION
      if (name === 'VERSION') {
        return ''
      }
      // 防止name为 XXX[0].XXX 时报错
      if (name.includes('.')) name = `'${name}'`
      return `${tsComments.trim() ? '\n    ' + tsComments.trim() : ''}
    ${name}${required ? '' : '?'}: ${type};`
    })
    .join('')}
  }`
}
function getBodyParams(requestBody) {
  if (!requestBody) return ''
  const type = requestBody.content[0].type
  // body直接是一个数组的情况
  const isDataArray = type && (type.endsWith('[]') || type.startsWith('Array<'))
  return {
    params: isDataArray ? `{ '${DATA_ARRAY_KEY}' : ${type} }` : type,
    isDataArray,
  }
}

function getResponseType(type) {
  if (!type) return 'any'
  if (type.startsWith('R') || type.includes('Result')) return `${type}['data']`
  return type
}

/**
 * import代码
 */
function genImport({ typeName, useAlias, qualifiedName, file }) {
  const name = useAlias ? `as ${qualifiedName}` : ''

  if (typeName === 'R') return ''
  return `export { ${typeName} } ${name}from '${file}'\n`
}
