import { ComputedRef, getCurrentInstance, Ref, watchEffect } from 'vue'
import _, { reject } from 'lodash'

interface UseRewriteCbOpt {
  attrs: ComputedRef<Record<string, any>>
  output: ComputedRef<Record<string, any>>
  preload?: Ref<any>
}

export const useRewriteCb = ({ attrs, output, preload }: UseRewriteCbOpt) => {
  const instance = getCurrentInstance()

  watchEffect(() => {
    _.forOwn(attrs.value, (v, k) => {
      if (k.startsWith('on') && !k.startsWith('onUpdate:') && _.isFunction(v)) {
        const fn = attrs.value[k]
        if (fn.__REWRITED__) return

        attrs.value[k] = (...args: any[]) => {
          const res = fn(...args, {
            attrs: attrs.value,
            instance,
            output: output.value,
            preload: preload?.value,
          })
          /** 如果preload传入了，清空preload */
          if (preload) preload.value = null
          /** 如果这是个async方法 */
          if (res && res.then) {
            return new Promise((resolve, reject) => {
              res.then(resolve).catch(reject)
            })
          }
        }
        attrs.value[k].__REWRITED__ = true
      }
    })
  })
}
