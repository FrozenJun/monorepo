<script setup lang="ts">
import { TrackLine } from '../../map.dto'
import { LPolyline } from '@vue-leaflet/vue-leaflet'
import { PropType, onUnmounted, ref, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet-polylinedecorator'
import { getTrackColorByTheme } from '../../map.constant'

const props = defineProps({
  line: {
    type: Object as PropType<TrackLine>,
    default: () => ({}),
  },
  map: {
    type: Object as PropType<L.Map>,
    default: () => ({}),
  },
})
const mapTrackLine = ref<typeof LPolyline>()
const polylineDecorator = ref()

watch(
  () => props.line,
  (v) => {
    if (v && v.latLngs && mapTrackLine.value) {
      addDecorator()
    } else {
      clearDecorator()
    }
  },
  { immediate: true }
)
watch(
  mapTrackLine,
  (v) => {
    if (v && props.line.latLngs) {
      addDecorator()
    } else {
      clearDecorator()
    }
  },
  { immediate: true }
)
function addDecorator() {
  clearDecorator()
  // 处理线段，过滤重复出现的线段
  const lines: L.LatLng[][] = []
  props.line.latLngs.reduce(
    (p0, p1) => {
      if (p0[0] && p0[1]) {
        const latLng0 = L.latLng(p0[0], p0[1])
        const latLng1 = L.latLng(p1[0], p1[1])
        if (!lines.find((line) => line[0].equals(latLng0) && line[1].equals(latLng1))) {
          lines.push([latLng0, latLng1])
        }
      }
      return p1
    },
    [0, 0]
  )
  if (!polylineDecorator.value) {
    polylineDecorator.value = (L as any)
      .polylineDecorator(lines, {
        patterns: [
          {
            offset: 30, // 箭头起始位置距离线条两端的距离
            repeat: 100, // 箭头重复的间隔
            symbol: (L as any).Symbol.arrowHead({
              pixelSize: 7, // 箭头大小
              headAngle: 75, // 箭头角度
              polygon: false, //箭头是否为多边形
              pathOptions: {
                // stroke: true,
                weight: 2, //箭头粗细
                color: '#FFFFFF', //箭头颜色
              },
            }),
          },
        ],
      })
      .addTo(props.map)
  } else {
    polylineDecorator.value.setPaths(lines)
  }
}
function clearDecorator() {
  if (polylineDecorator.value) {
    polylineDecorator.value.setPaths([])
  }
}
// 组件被销毁需要请客箭头
onUnmounted(() => {
  clearDecorator()
})
</script>

<template>
  <LPolyline
    ref="mapTrackLine"
    class="map-track-line"
    :lat-lngs="props.line.latLngs"
    :color="getTrackColorByTheme(props.line.theme)"
    :weight="7"
  ></LPolyline>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-track-line) {
}
</style>
