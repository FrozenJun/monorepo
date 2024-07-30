import _ from 'lodash'
import { Ref, ref } from 'vue'

export function useOriginSocket(
  socketPath: string,
  {
    onOpen,
    onClose,
    onMessage,
    onError,
  }: {
    onOpen?(ev: Event): void
    onClose?(ev: CloseEvent): void
    onMessage?(ev: MessageEvent): void
    onError?(ev: Event): void
  }
) {
  const ws: Ref<WebSocket> = ref(socketInit())
  let limitConnect = 10 // 重连次数
  let timeConnect = 0
  let isReconnecting = false

  return { ws }

  function socketInit() {
    const ws = new WebSocket(socketPath)
    ws.onopen = function (e) {
      limitConnect = 10
      timeConnect = 0
      _.isFunction(onOpen) && onOpen(e)
    }
    ws.onerror = function (e) {
      _.isFunction(onError) && onError(e)
      reconnect()
    }

    ws.onmessage = function (e) {
      _.isFunction(onMessage) && onMessage(e)
    }

    ws.onclose = function (e) {
      _.isFunction(onClose) && onClose(e)
      reconnect()
    }
    return ws
  }

  function reconnect() {
    if (isReconnecting) return
    if (limitConnect > 0) {
      limitConnect--
      timeConnect++
      isReconnecting = true
      console.log(`第${timeConnect}次重连`)
      setTimeout(() => {
        isReconnecting = false
        ws.value = socketInit()
      }, 200)
    } else {
      console.log('超过重连次数，连接已超时')
    }
  }
}
