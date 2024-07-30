<script setup lang="ts">
import { LFeatureGroup } from '@vue-leaflet/vue-leaflet'
import { PropType, ref } from 'vue'
import { ResideMarker } from '../map.dto'
import MapBase from '@/components/map/map-base/index.vue'
import MapPopupReside from './components/map-popup-reside.vue'
import MapPopupResideTime from './components/map-popup-reside-time.vue'
import MapResideMarker from './components/map-reside-marker.vue'
import { FusionResideOption } from '../../../views/fusion-analysis/fusion.dto'

const props = defineProps({
  resideIcons: {
    type: Array as PropType<ResideMarker[]>,
    default: () => [],
  },
  dataType: String,
  waypointParams: {
    type: Object,
    default: () => ({}),
  },
  resideOption: {
    type: Object as PropType<FusionResideOption>,
    default: () => ({}),
  },
})
const emits = defineEmits(['mapReady', 'resideIconCheckd'])
const currentReside = ref<ResideMarker>()
const residePopup = ref()
const residePopupTime = ref()
const map = ref<L.Map>()
function onMapReady(v: L.Map) {
  map.value = v
  emits('mapReady', v)
  map.value.on('popupclose', (v) => {
    curIconId.value = ''
  })
}
// 当前被点击的icon
const curIconId = ref<string>()
function onResideClick(icon: ResideMarker) {
  curIconId.value = icon.id
  currentReside.value = icon

  if (props.resideOption.onlyShowTime) {
    residePopupTime.value?.leafletObject?.openPopup(icon.latLng)
  } else {
    residePopup.value?.leafletObject?.openPopup(icon.latLng)
  }
  map.value && map.value.panTo(icon.latLng)

  emits('resideIconCheckd', icon)
}
function closeResidePopup() {
  if (residePopup.value && residePopup.value.leafletObject) {
    residePopup.value.leafletObject.closePopup()
  }
}
defineExpose({
  openResidePopup: onResideClick,
  closeResidePopup,
})
</script>

<template>
  <MapBase @map-ready="onMapReady">
    <LFeatureGroup ref="residePopup">
      <MapPopupReside
        :info="currentReside"
        :waypointParams="waypointParams"
        :dataType="dataType"
        :reside-option="resideOption"
      >
      </MapPopupReside>
    </LFeatureGroup>
    <LFeatureGroup ref="residePopupTime">
      <MapPopupResideTime :info="currentReside"> </MapPopupResideTime>
    </LFeatureGroup>
    <MapResideMarker
      v-for="icon in props.resideIcons"
      :key="icon.id"
      :icon="icon"
      @click="onResideClick(icon)"
      :is-active="curIconId === icon.id"
    ></MapResideMarker>
  </MapBase>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-foothold) {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
