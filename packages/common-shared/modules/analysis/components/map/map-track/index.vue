<script setup lang="ts">
import MapTrackLines from './components/map-track-lines.vue'
import MapBase from '../map-base/index.vue'
import { TrackIcon } from '../map.dto'
import { PropType, ref } from 'vue'
import L from 'leaflet'
const props = defineProps({
  maxDiff: Number, // 最大时间差，单位秒
  tracks: {
    type: Array as PropType<TrackIcon[][]>,
    default: () => [],
  },
})
const emits = defineEmits(['mapReady', 'trackIconCheckd', 'genTrackIcons'])
function onTrackIconCheckd(trackIcon: TrackIcon) {
  emits('trackIconCheckd', trackIcon)
}
const trackLines = ref()
function openTrackPopup(icon: TrackIcon) {
  trackLines.value && trackLines.value.openTrackPopup(icon)
}
function closeTrackPopup() {
  trackLines.value && trackLines.value.closeTrackPopup()
}
function onGenTrackIcons(tracks: TrackIcon[]) {
  emits('genTrackIcons', tracks)
}
defineExpose({
  openTrackPopup,
  closeTrackPopup,
})
const map = ref<L.Map>()
function onMapReady(v: L.Map) {
  map.value = v
  emits('mapReady', v)
}
</script>

<template>
  <MapBase @map-ready="onMapReady">
    <MapTrackLines
      ref="trackLines"
      :track-lines="tracks"
      :max-diff="maxDiff"
      :map="map"
      @track-icon-checkd="onTrackIconCheckd"
      @gen-track-icons="onGenTrackIcons"
    ></MapTrackLines>
  </MapBase>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-track) {
}
</style>
