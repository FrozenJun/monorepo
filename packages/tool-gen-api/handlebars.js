module.exports = function (httpName = 'HttpSend') {
  return function (handlebars) {
    handlebars.registerPartial('indexImportPartial', function (importData) {
      console.log('important', importData)
      const { typeName, useAlias, qualifiedName, file } = importData
      const name = useAlias ? `as ${qualifiedName}` : ''

      if (typeName === 'R') return ''
      return `export { ${typeName} } ${name}from '${file}'\n`
    }),
      handlebars.registerPartial('customServicePartial', function (variant = {}) {
        try {
          const { options = {}, operation = {}, methodName = '', successResponse = {} } = variant
          // 解析路径上的参数,匹配{}
          const pathParamArr = operation.path.match(/{.*}/)
          const pathParams = pathParamArr ? pathParamArr.map((i) => i.slice(1, i.length - 1)) : null
          //模块名字
          const moduleName = options.output.slice(options.output.lastIndexOf('/'))
          // 参数类型
          const queryParams = (operation.parameters || [])
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
            .join('')
          const paramTypeBase = operation.requestBody && operation.requestBody.content[0].type
          const paramType =
            paramTypeBase +
            (pathParams
              ? ' & { ' + pathParams.map((i) => `${i}: string | number`).join('; ') + ' }'
              : '')
          const mediaType = operation.requestBody && operation.requestBody.content[0].mediaType
          const DATA_ARRAY_KEY = 'DATA_ARRAY'
          const isDataArray =
            paramTypeBase && (paramTypeBase.endsWith('[]') || paramTypeBase.startsWith('Array<'))
          const boydParams = operation.requestBody
            ? isDataArray
              ? `{ '${DATA_ARRAY_KEY}' : ${paramType} }`
              : paramType
            : null
          const paramsType =
            boydParams && queryParams
              ? boydParams +
                ` & {
    ${queryParams}
      }`
              : boydParams
              ? boydParams
              : queryParams
              ? `{
    ${queryParams}
      }`
              : ''

          const method = operation.method && operation.method.toUpperCase()
          const isBodyParam = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
          const paramTemp = !isBodyParam
            ? `    params,`
            : operation.parameters || pathParams
            ? `    params: 
          params &&
          Object.keys(params)
            .filter(key => ['${[
              ...(operation.parameters || []).map((i) => i.name),
              ...(pathParams || []),
            ]
              .map(String)
              .join("', '")}'].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),\n`
            : ''
          const bodyTemp = isBodyParam
            ? isDataArray
              ? `      data: params && params['${DATA_ARRAY_KEY}'],`
              : '      data: params,'
            : ''
          return `  /**
     * ${operation.spec && operation.spec.summary}
     */
    ${methodName.replace(/([a-zA-Z]*)[\d]{1,3}$/, '$1')}(params?: ${paramsType || '{}'}) {
      return ${httpName}<${successResponse ? (/^R/.test(successResponse.type) ? successResponse.type + `['data']` : successResponse.type) : 'any'}>({
        url: '${
          operation.path
        }', ${mediaType === 'multipart/form-data' ? "\n      bodyType: 'FORM_DATA'," : mediaType === 'application/json' ? "\n      bodyType: 'RAW_JSON'," : "\n      bodyType: 'X_WWW_FORM_URLENCODED',"}
    ${paramTemp}${bodyTemp}
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
