import './lib/jessibuca.js'
import { onMounted, onUnmounted, Ref, ref, watch, computed } from 'vue'

let loadingText = '加载中'
const lang = localStorage.getItem('language')
switch (lang) {
  case 'en-US':
    loadingText = 'Loading'
    break
  case 'ru-RU':
    loadingText = 'Загрузка'
    break
  default:
    loadingText = '加载中'
    break
}

export enum EJessibucaPerformance {
  卡顿 = 0,
  流畅 = 1,
  非常流畅 = 2,
}
// initPlugin(videoOpreateName)

export interface JessibucaOption {
  createTime?: number // 视频流开始时间戳，配合stats.ts控制视频最大延迟
  onPerformance?: (performace: EJessibucaPerformance) => void
}

export function useJessibuca(dom: Ref<Element>, options: JessibucaOption = {}) {
  let jessibuca: any | undefined
  const playing = ref(false)
  const loaded = ref(false)

  const currentUrl = ref('')

  onMounted(() => {
    init()
  })
  onUnmounted(() => {
    destroy()
  })

  /**
   * 通过createTime计算延迟
   * createTime改变的时候重置差值
   */
  // const diff = ref<number>()
  // watch(
  //   () => options.createTime,
  //   (v) => {
  //     if (v) diff.value = undefined
  //   },
  //   { immediate: true }
  // )
  const play = async (url: string) => {
    try {
      if (url) {
        if (!jessibuca) init()
        currentUrl.value = url
        jessibuca && (await jessibuca.play(url))
      }
    } catch (e) {
      console.log(e)
    }
  }
  const pause = async () => {
    try {
      jessibuca && (await jessibuca.pause())
      playing.value = false
    } catch (e) {
      console.log(e)
    }
  }
  const destroy = () => {
    if (jessibuca && jessibuca.hasLoaded()) {
      jessibuca.destroy()
      jessibuca = undefined
    }
    playing.value = false
    loaded.value = false
  }

  return {
    play,
    pause,
    destroy,
  }

  function init() {
    jessibuca = new (Jessibuca as any)({
      container: dom.value,
      videoBuffer: 0.1, // 缓存时长
      useMSE: true,
      autoWasm: true,
      isResize: true,
      hasAudio: false,
      isFlv: true,
      decoder: '/decoder.js',
      loadingText: loadingText,
      debug: false,
      showBandwidth: true, // 显示网速
      operateBtns: {
        fullscreen: true,
        screenshot: true,
        play: true,
        audio: false,
      },
      forceNoOffscreen: true,
      isNotMute: true,
      timeout: 15,
    }) as any
    // jessibuca.on('load', function () {})
    // jessibuca.on('log', function (msg: any) {})
    // jessibuca.on('record', function (msg: any) {})
    jessibuca.on('pause', function () {
      playing.value = false
      // play(currentUrl.value)
    })
    // jessibuca.on('play', function () {
    // })
    // jessibuca.on('fullscreen', function (msg: any) {})
    // jessibuca.on('mute', function (msg: any) {
    //   quieting.value = msg
    // })
    // jessibuca.on('mute', function (msg: any) {})
    // jessibuca.on('audioInfo', function (msg: any) {})
    // jessibuca.on("bps", function (bps) {
    // });
    // let _ts = 0;
    // jessibuca.on("timeUpdate", function (ts) {
    //   _ts = ts;
    // });
    // jessibuca.on('videoInfo', function (info: any) {})
    jessibuca.on('error', function (error: any) {
      console.log('error', error)
      play(currentUrl.value)
    })
    jessibuca.on('timeout', function (e) {
      console.log('timeout', e)
    })
    // jessibuca.on('start', function () {})
    jessibuca.on('stats', function (stats) {
      // console.log(stats)
      // console.log('tsDiff', stats.buf + stats.ts - lastVideoTime.value)
      // lastVideoTime.value = stats.buf + stats.ts
      // if (options.createTime) {
      //   if (!diff.value) diff.value = options.createTime + stats.ts - new Date().getTime()
      //   const currentDiff = options.createTime + stats.ts - new Date().getTime()
      //   console.log(Math.abs(diff.value - currentDiff))
      //   // 延迟大于5秒重新加载
      //   if (Math.abs(diff.value - currentDiff) > 3000) {
      //     jessibuca.pause().then(() => jessibuca.play(currentUrl.value))
      //   }
      // }
    })
    jessibuca.on('performance', function (performance: EJessibucaPerformance) {
      options.onPerformance && options.onPerformance(performance)
    })
    //   jessibuca.on('buffer', function (buffer: any) {})
    //   jessibuca.on('stats', function (stats: any) {})
    //   jessibuca.on('kBps', function (kBps: any) {})
    //   // 显示时间戳 PTS
    //   jessibuca.on('videoFrame', function () {})
    //   //
    //   jessibuca.on('metadata', function () {})
  }
}
