import { ref } from 'vue'

export function useAudio(url: string) {
  const audio = new Audio(url)
  const isAudioReady = ref(false)
  const isAudioDestroyed = ref(false)
  const isAudioError = ref(false)
  const isAudioPlaying = ref(false)
  const actions = ref<Function[]>([])

  audio.addEventListener('canplaythrough', (event) => {
    isAudioReady.value = true
    if (actions.value.length) {
      actions.value.forEach((action) => action())
    }
  })
  audio.addEventListener('error', (event) => {
    isAudioError.value = true
  })
  audio.addEventListener('ended', (event) => {
    isAudioPlaying.value = false
  })

  const play = async () => {
    if (isAudioDestroyed.value) return
    actions.value = [play]
    isAudioPlaying.value = true
    if (isAudioReady.value) {
      await audio.play()
    }
  }
  const pause = () => {
    actions.value = [pause]
    isAudioPlaying.value = false
    if (isAudioReady.value) {
      audio.pause()
    }
  }
  const destroy = () => {
    pause()
    isAudioDestroyed.value = true
  }

  return { audio, play, pause, destroy, isAudioReady, isAudioError, isAudioPlaying }
}
