import {
  COMPONENT_TYPE,
  COMPONENT_METHODS,
  COMPONENT_DATAS,
  ComponentMethods,
} from '../constants/component'
import _ from 'lodash'

export interface ProviderItem {
  /** 组件唯一id */
  cid: string
  /** 组件名称 */
  name: string
  /** 组件类型 */
  type: COMPONENT_TYPE
  /** 组件输出 */
  output: Record<string, any>
}

const isEmitName = (name: COMPONENT_METHODS | EmitName): name is EmitName =>
  !!(name as EmitName).type
interface EmitName<T extends COMPONENT_METHODS = COMPONENT_METHODS> {
  type: T
  name: string
}

const isReveiceName = (name: COMPONENT_DATAS | ReveiceName): name is ReveiceName =>
  !!(name as ReveiceName).type
interface ReveiceName<T extends COMPONENT_DATAS = COMPONENT_DATAS> {
  type: T
  name: string
}

class ProviderServiceClass {
  providers: ProviderItem[] = []

  /**
   * 注册组件
   * @param provider 组件提供者
   */
  register(provider: ProviderItem) {
    // provider.output = cloneDeep(provider.output)
    const oldProvider = this.providers.find((item) => item.cid === provider.cid)
    if (oldProvider) {
      oldProvider.output = provider.output
    } else {
      this.providers.push(provider)
    }
  }

  /**
   * 注销组件
   * @param cid 组件的id
   */
  logout(cid: string) {
    this.providers = this.providers.filter((provider) => provider.cid !== cid)
  }

  /**
   * 触发组件提供的方法
   * @param emitName 触发组件方法的名称
   * @param preload 传递给方法的数据
   * @param componentName 组件的名称，默认’‘
   */
  emit<T extends COMPONENT_METHODS>(emitName: T | EmitName<T>, preload?: ComponentMethods[T]) {
    let componentName = ''
    let methodName = ''
    if (isEmitName(emitName)) {
      componentName = emitName.name
      methodName = emitName.type
    } else {
      methodName = emitName
    }
    const methodConfig = this.parseName(methodName)
    if (!methodConfig) return
    const matchOutputs = this.providers.filter((provider) => {
      return (
        provider.output &&
        _.isFunction(provider.output[methodConfig.outputName]) &&
        methodConfig.type === provider.type &&
        componentName === provider.name
      )
    })
    if (matchOutputs.length) {
      matchOutputs.forEach((matchOutput) =>
        matchOutput.output[methodConfig.outputName].call(undefined, preload)
      )
    } else {
      console.warn(`==========Failed to find ${methodName} method==========`)
      // console.warn('可能原因：组件未引入、组件名称(n)未匹配、组件未被渲染等')
    }
  }

  /**
   * 接收组件提供的数据
   * @param reveiceName 接受组件数据的名称
   * @param isGetAllMatchData 是否返回全部匹配的数据，默认false
   */
  reveice<T extends COMPONENT_DATAS>(reveiceName: T | ReveiceName<T>): any[] {
    let componentName = ''
    let dataName = ''
    if (isReveiceName(reveiceName)) {
      componentName = reveiceName.name
      dataName = reveiceName.type
    } else {
      dataName = reveiceName
    }
    const dataConfig = this.parseName(dataName, 'this')
    if (!dataConfig) return []
    const matchOutputs = this.providers.filter((provider) => {
      return (
        provider.output &&
        provider.output.data &&
        dataConfig.type === provider.type &&
        componentName === provider.name
      )
    })
    if (matchOutputs.length) {
      const outputs = matchOutputs.map((matchOutput) => matchOutput.output.data)
      return outputs
    } else {
      console.warn(`==========Failed to find ${dataName} data==========`)
      // console.warn('可能原因：组件未引入、组件名称(n)未匹配、组件未被渲染等')
      return []
    }
  }

  private parseName(name: string, defaultOutputName = '') {
    const names = name.split('-')
    return {
      type: names[0] as COMPONENT_TYPE,
      outputName: names[1] || defaultOutputName,
    }
  }
}

export const ProviderService = new ProviderServiceClass()

export const emit = ProviderService.emit.bind(ProviderService)
export const reveice = ProviderService.reveice.bind(ProviderService)
