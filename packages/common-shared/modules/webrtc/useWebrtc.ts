import { onUnmounted, Ref } from 'vue'
import { HttpSend } from 'common-core/http'

/**
 * 自动播放需要video设置autoplay与muted
 */
export function useWebrtc(video: Ref<HTMLAudioElement>) {
  const rtcConnection = new RTCPeerConnection()
  const remoteStream = new MediaStream()

  onUnmounted(() => {
    rtcConnection.close()
  })

  return {
    init,
  }

  async function init(url: string) {
    rtcConnection.ontrack = (ev: RTCTrackEvent) => {
      remoteStream.addTrack(ev.track)
      video.value.srcObject = remoteStream
    }

    rtcConnection.addTransceiver('video', { direction: 'recvonly' })

    // 创建Offer并设置本地描述
    const offer = await rtcConnection.createOffer()
    await rtcConnection.setLocalDescription(offer)

    const { e, data } = await HttpSend<any>({
      url,
      method: 'POST',
      bodyType: 'CUSTOM',
      headers: {
        'Content-Type': 'text/plain',
      },
      data: rtcConnection.localDescription?.sdp,
      onResponse(res) {
        return { e: false, data: res.data }
      },
    })
    if (e) return
    await rtcConnection.setRemoteDescription(new RTCSessionDescription(data))
  }
}
