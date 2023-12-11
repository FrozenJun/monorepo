import { HttpReturnType, HttpSendOption, HTTP_METHODS } from '../http.dto'
import { MockRule } from './mock.dto'
import _ from 'lodash'

const DEFAULT_RETURN = {
  e: false,
  data: undefined,
  httpStatus: 200,
}

interface MockReturnType {
  isMatch: boolean
  res: HttpReturnType
}

class MockServiceClass {
  async mock(option: HttpSendOption): Promise<MockReturnType> {
    const { mock, method, url } = option
    if (!mock) return { isMatch: false, res: DEFAULT_RETURN }

    const defaultReturn = {
      e: true,
      httpStatus: 404,
    }

    const data = mock.data
    if (!data) return { isMatch: false, res: defaultReturn }
    const matchRule = this.matchMockData(data, url, method)
    if (!matchRule || !matchRule.res) {
      if (mock.log) {
        console.log(
          `%c${method}->${url}->未被mock匹配，${mock.force ? '返回404' : '发送真实请求'}`,
          'background:#000;color:#ccba50'
        )
      }
      return { isMatch: false, res: defaultReturn }
    }

    const resData = _.isFunction(matchRule.res)
      ? matchRule.res(option)
      : mock.copy
      ? _.cloneDeep(matchRule.res)
      : matchRule.res
    const res = {
      e: false,
      data: resData,
      httpStatus: 200,
    }
    if (mock.log) {
      console.log(
        `%cMocked API: ${matchRule.method}->${matchRule.url}`,
        'background:#000;color:#ccba50'
      )
      console.log('params->', option.params, 'res->', matchRule.res)
    }
    return { isMatch: true, res: await this.delay(res, mock.delay) }
  }

  matchMockData(data: Record<string, any>, url?: string, method?: HTTP_METHODS) {
    let matchRule: MockRule | undefined
    Object.keys(data).forEach((key: string) => {
      const rules = data[key]
      if (!rules) return
      Object.keys(rules).forEach((ruleKey: string) => {
        const value = rules[ruleKey]
        const rule = this.parseRule(ruleKey, value)
        if (
          ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH', 'OPTIONS'].indexOf(rule.method) === -1
        ) {
          throw Error(`method of ${key}-${ruleKey} is not valid`)
        }
        if (rule.method === method && rule.url === url) {
          matchRule = rule
        }
      })
    })
    return matchRule
  }

  async delay(data: any, delay?: number) {
    if (delay) {
      return new Promise((resolve) => _.delay(() => resolve(data), delay))
    } else {
      return data
    }
  }

  private parseRule(key: string, res: any) {
    let method = 'GET'
    let url = key

    if (key.indexOf(' ') > -1) {
      const splited = key.split(' ')
      method = splited[0]
      url = splited[1]
    }

    return {
      url,
      res,
      method: method.toUpperCase(),
    }
  }

  private outputError(error: any) {
    const filePath = error.message.split(': ')[0]
    const errors = error.stack
      .split('\n')
      .filter((line: string) => line.trim().indexOf('at ') !== 0)
      .map((line: string) => line.replace(`${filePath}: `, ''))
    errors.splice(1, 0, [''])

    console.group()
    console.warn(`==========Failed to parse mock config.==========`)
    console.log(errors.join('\n'))
    console.groupEnd()

    throw error
  }
}

export const MockService = new MockServiceClass()
