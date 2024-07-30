/**
 * 发布订阅类
 *
 * 具体使用时需要创建对应模块的发布订阅的实例
 * 推荐使用enum定义T
 */
export class ObserverCls<T extends string = string> {
  /**
   * 存放订阅的集合
   */
  private clients: Record<string, Function[]> = {}

  /**
   * 存放离线事件，使之可以先发布后订阅
   * 先发布后订阅对于同一个key只能执行一次
   */
  private offlineEvent: Record<string, any[]> = {}

  subscribe(key: T, cb: Function) {
    this.addSubscribeCb(key, cb)
    this.offlineEventTrigger(key)
  }

  unsubscribe(key: T, cb?: Function) {
    const cbs = this.clients[key]
    if (!cbs) return
    if (cb) {
      this.clients[key] = cbs.filter((_cb) => _cb !== cb)
    } else {
      cbs.length = 0
    }
  }

  trigger(key: T, ...args: any[]) {
    const cbs = this.clients[key]
    if (!cbs || !cbs.length) {
      // 还没有订阅者，放入离线事件,会覆盖上一次同名的离线事件的参数
      this.offlineEvent[key] = args
      return
    }
    cbs.forEach((cb) => Reflect.apply(cb, this, args))
  }

  /**
   * 新增订阅回调
   */
  private addSubscribeCb(key: T, cb: Function) {
    if (!this.clients[key]) {
      this.clients[key] = []
    }

    // 如果cb已经存在，则不再push
    !this.clients[key].includes(cb) && this.clients[key].push(cb)
  }

  /**
   * 离线事件手动重新发布
   */
  private offlineEventTrigger(key: T) {
    // 如果离线事件有缓存key,手动重新发布一次
    if (this.offlineEvent[key]) {
      this.trigger(key, ...this.offlineEvent[key])
      Reflect.deleteProperty(this.offlineEvent, key)
    }
  }
}
