import { reactive, ref } from 'vue'
import _ from 'lodash'

export interface ScreenRecordOption {
  notSupportCb?: () => void
  onError?: (error: Error) => void
  onStop?: (stopedItem?: IRecorderItem) => void
}
interface IRecorderItem {
  id: string
  recorder: MediaRecorder
  blob?: Blob
  startTime?: number
  endTime?: number
}

export function useScreenRecord({ notSupportCb, onError, onStop }: ScreenRecordOption = {}) {
  const inited = ref(false)
  const status = reactive<{
    recorders: IRecorderItem[]
    mediaStream: MediaStream | undefined
  }>({
    recorders: [],
    mediaStream: undefined,
  })

  return {
    status,
    startScreenRecord,
    endScreenRecord,
    start,
    stop,
    clear,
    destroy,
    isSupport,
  }

  async function startScreenRecord() {
    if (inited.value) return
    const valid = isSupport()
    if (!valid) return
    try {
      status.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })
      // 监听流停止事件（包含用户停止共享）
      if (status.mediaStream.getTracks()[0])
        status.mediaStream.getTracks()[0].onended = () => {
          endScreenRecord()
        }

      inited.value = true
    } catch (error) {
      _.isFunction(onError) && onError(error as Error)
      console.error(error)
    }
  }
  function endScreenRecord() {
    status.mediaStream?.getTracks().forEach((track) => track.stop())
    clear()
    status.mediaStream = undefined
    inited.value = false
  }

  function start(id: string) {
    if (!status.mediaStream) return
    const match = status.recorders.find((i) => i.id === id)
    if (match) {
      match.recorder.start()
    } else {
      const recorder = new MediaRecorder(status.mediaStream, {
        mimeType: 'video/webm; codecs = vp8', // 媒体格式
      })
      const recorderItem: IRecorderItem = { id, recorder, startTime: new Date().getTime() }
      recorder.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          recorderItem.blob = event.data // 存储媒体数据
        }
      }
      recorder.start()
      status.recorders.push(recorderItem)
    }
  }
  function stop(id: string) {
    const match = status.recorders.find((i) => i.id === id)
    if (match && match.recorder.state !== 'inactive') {
      match.recorder.stop()
      match.endTime = new Date().getTime()
    }
    // 下一个事件循环再去执行回调，为了保证blob已经拿到
    setTimeout(() => {
      _.isFunction(onStop) && onStop(match)
      // 在recorders中删除该记录
      destroy(id)
    }, 0)
  }
  function destroy(id: string) {
    status.recorders.splice(
      status.recorders.findIndex((i) => i.id === id),
      1
    )
  }
  function clear() {
    status.recorders.forEach((i) => stop(i.id))
    status.recorders.length = 0
  }

  function isSupport() {
    if (!navigator.mediaDevices.getDisplayMedia) {
      _.isFunction(notSupportCb) && notSupportCb()
    }
    return !!navigator.mediaDevices.getDisplayMedia
  }
}
