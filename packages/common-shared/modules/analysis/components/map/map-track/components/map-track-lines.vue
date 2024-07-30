<script setup lang="ts">
import { LFeatureGroup } from '@vue-leaflet/vue-leaflet'
import { computed, nextTick, PropType, ref } from 'vue'
import MapMarker from '../../map-marker/index.vue'
import { TrackIcon, TrackLine } from '../../map.dto'
import MapPopupTrack from './map-track-popup.vue'
import MapTrackLine from './map-track-line.vue'
import _ from 'lodash'
import dayjs from 'dayjs'
import L from 'leaflet'
const props = defineProps({
  maxDiff: Number, // 最大时间差，单位秒
  trackLines: {
    type: Array as PropType<TrackIcon[][]>,
    default: () => [],
  },
  map: {
    type: Object as PropType<L.Map>,
    default: () => ({}),
  },
})
const emits = defineEmits(['trackIconCheckd', 'genTrackIcons'])
const currentTrackInfo = ref()
const trackPopup = ref()
const tracks = computed(() => {
  const trackIcons: TrackIcon[] = []
  props.trackLines.forEach((track, index) => {
    // 默认第一条是主体, 剩余的是同行
    const theme = index === 0 ? 'default' : 'peer'
    track.forEach((icon) => {
      const sameDeviceIcon = trackIcons.find((item) => item.device.id === icon.device.id)
      if (sameDeviceIcon) {
        // 计算时间是否间隔在时间差内
        let isPeer = false
        if (sameDeviceIcon.lineIndex !== index && props.maxDiff) {
          const iconPoint = icon.points[0]
          /**
           * 也可以使用同行分析的segments来判断同行点
           */
          sameDeviceIcon.points.forEach((point) => {
            // 同一条线不做比较
            if (point.theme === theme) return
            const startTime1 = dayjs(iconPoint.startTime)
            const endTime1 = dayjs(iconPoint.endTime)
            const startTime2 = dayjs(point.startTime)
            const endTime2 = dayjs(point.endTime)
            const isPointPeer =
              startTime1.diff(endTime2, 'seconds') < props.maxDiff! &&
              endTime1.diff(startTime2, 'seconds') > 0 - props.maxDiff!
            if (isPointPeer) {
              if (!sameDeviceIcon.peerFlagIndex) sameDeviceIcon.peerFlagIndex = 1
              // 存在同行点时，将两个点标记成组，并将这个icon定为同行点
              if (!point.peerFlag && !iconPoint.peerFlag) {
                point.peerFlag = sameDeviceIcon.peerFlagIndex
                iconPoint.peerFlag = sameDeviceIcon.peerFlagIndex
                sameDeviceIcon.peerFlagIndex++
              } else {
                if (iconPoint.peerFlag) point.peerFlag = iconPoint.peerFlag
                if (point.peerFlag) iconPoint.peerFlag = point.peerFlag
              }
              isPeer = true
            }
          })
        }
        // 有重复到的点或者是同行点
        if (isPeer) {
          // 同行点
          sameDeviceIcon.index = '同'
          sameDeviceIcon.type = 'peer'
          sameDeviceIcon.theme = 'default' // 同行点按主体的theme
          icon.points.forEach((point) => sameDeviceIcon.points.push({ ...point, theme }))
        } else {
          if (sameDeviceIcon.type !== 'peer') {
            // 重复到的点
            if (sameDeviceIcon.index!.split(',').length < 3) {
              sameDeviceIcon.index = sameDeviceIcon.index + ',' + icon.index
            } else {
              if (
                !sameDeviceIcon.index!.endsWith('...') &&
                !sameDeviceIcon.index!.endsWith('...01')
              )
                sameDeviceIcon.index = sameDeviceIcon.index + '...'
              if (icon.index === '起') {
                sameDeviceIcon.index = sameDeviceIcon.index + icon.index
              }
            }
            sameDeviceIcon.type = 'default'
          }
          icon.points.forEach((point) => sameDeviceIcon.points.push({ ...point, theme }))
        }
      } else {
        icon.points[0].theme = theme
        // 这里cloneDeep防止数据处理改变了主体路径的数据，导致点击其它同行人后数据错乱
        trackIcons.push({ ..._.cloneDeep(icon), lineIndex: index, theme, iconType: 'track' })
      }
    })
  })
  trackIcons.forEach((icon) => {
    if (icon.type === 'peer') {
      // 删除同行点中没有peerFlag的point  并且将用一个标记index的归为一组
      const peerPoints: any[] = []
      icon.points
        .filter((point) => point.peerFlag)
        .forEach((point) => {
          const peerPoint = peerPoints.find((i) => i.index === point.peerFlag)
          if (peerPoint) {
            peerPoint.children.push(point)
          } else {
            peerPoints.push({ index: point.peerFlag, children: [point] })
          }
        })
      // 计算每个通行组的开始和结束时间
      icon.points = peerPoints.map((point) => {
        point.startTime = dayjs(
          Math.min(...point.children.map((i) => new Date(i.startTime).getTime()))
        ).format('YYYY-MM-DD HH:mm:ss')
        point.endTime = dayjs(
          Math.max(...point.children.map((i) => new Date(i.endTime).getTime()))
        ).format('YYYY-MM-DD HH:mm:ss')
        return point
      })
    }
  })
  emits('genTrackIcons', trackIcons)
  return trackIcons
})

const lines = computed<TrackLine[]>(() => {
  // 默认第一条是主体
  return props.trackLines.map((track, index) => {
    const trackLine: TrackLine = {
      latLngs: [],
      theme: index === 0 ? 'default' : 'peer',
    }
    if (!track || !track.length) return trackLine
    track.forEach((item) => {
      trackLine.latLngs.push([item.device.latLng!.lat, item.device.latLng!.lng])
    })
    // 因为数据为终点显示在前经过反转，这里需要反转回去
    trackLine.latLngs = trackLine.latLngs.reverse()
    return trackLine
  })
})
props.map.on('popupclose', (v) => {
  curIconId.value = ''
})
defineExpose({
  openTrackPopup: onTrackIconClick,
  closeTrackPopup,
})
// 当前被点击的icon
const curIconId = ref<string>()
function onTrackIconClick(icon: TrackIcon) {
  curIconId.value = icon.device.id
  currentTrackInfo.value = icon
  if (trackPopup.value && trackPopup.value.leafletObject) {
    nextTick(() => {
      trackPopup.value.leafletObject.openPopup(icon.device.latLng)
      props.map && props.map.panTo(icon.device.latLng!)
    })
  }
  emits('trackIconCheckd', icon)
}
function closeTrackPopup() {
  if (trackPopup.value && trackPopup.value.leafletObject) {
    trackPopup.value.leafletObject.closePopup()
  }
}
</script>

<template class="map-track-lines">
  <MapTrackLine v-for="(line, index) in lines" :map="map" :line="line" :key="index"></MapTrackLine>
  <MapMarker
    v-for="marker in tracks"
    :key="marker.index"
    :marker="marker"
    @click="onTrackIconClick(marker)"
    :is-active="curIconId === marker.device.id"
  ></MapMarker>
  <LFeatureGroup ref="trackPopup">
    <MapPopupTrack :max-diff="maxDiff" :popup="currentTrackInfo"></MapPopupTrack>
  </LFeatureGroup>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-track-lines) {
}
</style>
