import { ComputedRef, onMounted, onUnmounted, SetupContext, watch } from 'vue'
import { COMPONENT_TYPE } from '../constants/component'
import { ProviderService } from '../service/provider.service'
import _ from 'lodash'

interface ProviderOpt {
  attrs: ComputedRef<Record<string, any>>
  ctx: SetupContext<any>
  output: ComputedRef<Record<string, any>>
  type: COMPONENT_TYPE
}

let cidCount = 0
export const useProvider = ({ attrs, output, type, ctx }: ProviderOpt) => {
  /** 确保注册后一定会被注销 */
  let isRegister = false

  /**
   * 随机生成20位数字的组件id,作为该组件的唯一标识,用于注销组件
   */
  // const cid = Math.floor(Math.random() * Math.pow(10, 20)).toString()
  const cid = cidCount.toString()
  cidCount += 1

  onMounted(() => {
    if (attrs.value.__INNER__) {
      ctx.emit('output-change', output.value)
      /** 如果显式定义了n，无论是否是内部组件均注册组件 */
      if (_.isString(attrs.value.n)) register()
    } else {
      register()
    }
  })
  onUnmounted(() => {
    isRegister && logout()
  })
  watch(
    () => output.value,
    () => {
      if (!isRegister) return
      if (attrs.value.__INNER__) {
        ctx.emit('output-change', output.value)
        /** 如果显式定义了n，无论是否是内部组件均注册组件 */
        if (_.isString(attrs.value.n)) register()
      } else {
        register()
      }
    }
  )

  /**
   * 注册组件
   */
  function register() {
    isRegister = true
    ProviderService.register({
      cid,
      name: attrs.value.n || '',
      type,
      output: output.value,
    })
  }

  /**
   * 注销组件
   */
  function logout() {
    ProviderService.logout(cid)
  }
}
