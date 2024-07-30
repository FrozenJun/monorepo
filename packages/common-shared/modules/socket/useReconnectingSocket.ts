import ReconnectingWebSocket, { Event, CloseEvent } from 'reconnecting-websocket'
import { onUnmounted } from 'vue'

export function useReconnectingSocket(
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
  let connected = false

  // 会自动重连，无需处理重连逻辑
  const ws = new ReconnectingWebSocket(socketPath, [], {
    maxReconnectionDelay: 20000, // 断开后最大的重连时间： 20s，每多一次重连，会增加 1.3 倍，5 * 1.3 * 1.3 * 1.3...
    minReconnectionDelay: 5000, // 断开后最短的重连时间： 5s
    maxRetries: 5,
  })

  ws.addEventListener('open', (e) => {
    console.log('连接成功')
    connected = true
    onOpen && onOpen(e)
  })
  ws.addEventListener('close', (e) => {
    console.log('连接已断开')
    connected = false
    onClose && onClose(e)
  })
  ws.addEventListener('message', (e) => {
    onMessage && onMessage(e)
  })
  ws.addEventListener('error', (e) => {
    console.log('连接 error')
    connected = false
    onError && onError(e)
  })

  onUnmounted(close)

  return {
    ws,
    send,
    close,
  }

  function send(message: string) {
    if (!connected) return console.log('socket未连接')
    ws.send(message)
  }
  function close() {
    ws.close()
  }
}
