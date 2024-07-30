import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { Stomp, StompSubscription } from '@stomp/stompjs'
import { nextTick, onUnmounted, ref } from 'vue'
import _ from 'lodash'

const SOCKET_DELAY = 500

export function useStompSocket(socketPath: string) {
  const connected = ref(false)
  const client = Stomp.over(() => new SockJS(socketPath))
  client.reconnectDelay = SOCKET_DELAY
  client.debug = () => {}
  client.connect({}, () => {
    connected.value = false
    console.log(`ws ${socketPath} connected`)
    // 重连后需要重新订阅
    subscribes.value.forEach((i) => subscribe(i.dest, i.cb))
    nextTick(() => {
      connected.value = true
    })
  })

  // 存储当前组件所有的订阅，并在组件销毁时解除订阅
  const subscribes = ref<
    { dest: string; cb: (data: any) => void; subscribe?: StompSubscription }[]
  >([])
  onUnmounted(() => {
    subscribes.value.forEach((i) => i.subscribe && i.subscribe.unsubscribe())
    client.deactivate()
  })

  return { subscribe, client }

  function subscribe(dest: string, cb: (data: any) => void) {
    if (!connected.value && !subscribes.value.find((i) => i.dest === dest)) {
      subscribes.value.push({
        dest,
        cb,
      })
      return
    }
    const mathSubscribe = subscribes.value.find((i) => i.dest === dest)
    if (mathSubscribe) {
      mathSubscribe.subscribe && mathSubscribe.subscribe.unsubscribe()
      subscribes.value = subscribes.value.filter((i) => i.dest !== dest)
    }
    const stompSubscribe = client.subscribe(dest, (e) => {
      const data = JSON.parse(e.body)
      cb(data)
    })
    subscribes.value.push({
      dest,
      cb,
      subscribe: stompSubscribe,
    })
  }
}
