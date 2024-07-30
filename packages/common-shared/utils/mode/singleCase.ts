/**
 *
 * 创建单例
 *
 * 单例的变量名中建议加上Single，以表示单例
 */
export const getSingle = function <T extends object>(fn: (...args: any[]) => T) {
  let result: T
  return function (this: any, ...args: any[]) {
    return result || (result = Reflect.apply(fn, this, args))
  }
}

/**
 * 使函数只执行一次
 */
export const executeOnce = function <T = any>(fn: (...args: any[]) => T) {
  let result: T
  let isExecuted = false
  return function (this: any, ...args: any[]) {
    if (!isExecuted) {
      result = Reflect.apply(fn, this, args)
      isExecuted = true
    }
    return result
  }
}

/**
 * 创建缓存代理的工厂
 */
export const createProxyFactory = (fn: Function) => {
  const cache = {}
  return (...args: any[]) => {
    const argsKey = Array.prototype.join.call(args, ',')
    if (argsKey in cache) {
      return cache[argsKey]
    }
    return (cache[argsKey] = fn.apply(this, args))
  }
}

/**
 * 通用对象池
 * 无内外状态的享元模式
 */
export const objectPoolFactory = (createObjFn: Function) => {
  const objectPool: Record<string, any>[] = []

  return {
    create: function (...args: any[]) {
      const obj = objectPool.length === 0 ? createObjFn(...args) : objectPool.shift()

      return obj
    },
    recover: function (obj: Record<string, any>) {
      objectPool.push(obj)
    },
  }
}
