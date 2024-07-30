import SockJS from 'sockjs-client/dist/sockjs.min.js'
import _ from 'lodash'

export function useSocket(
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
  const ws = new SockJS(socketPath)

  ws.onopen = function (e) {
    _.isFunction(onOpen) && onOpen(e)
  }
  ws.onerror = function (e: any) {
    console.log('websocket error 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
    console.log(e)
    _.isFunction(onError) && onError(e)
    // if (e.code != 1005 && e.code != 1000) reconnect(socketPath)
  }

  ws.onmessage = function (e) {
    _.isFunction(onMessage) && onMessage(e)
  }

  ws.onclose = function (e) {
    _.isFunction(onClose) && onClose(e)
    // if (e.code != 1005 && e.code != 1000) reconnect(socketPath)
  }
}
