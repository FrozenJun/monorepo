<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import { reactive, ref } from 'vue'
import 'leaflet-easybutton'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { MAP_TILE_LAYER_2D_PATH, INIT_ZOOM } from '../../constant/map.constant'

import 'leaflet-easybutton'

const mapOptions = reactive<Record<string, any>>({
  zoom: INIT_ZOOM,
  center: L.latLng(22.777321, 100.972344),
  maxZoom: 18,
  useGlobalLeaflet: true,
  options: {
    zoomControl: false,
  },
})

const refMapBase = ref<{ leafletObject: L.Map }>()
const mapInstance = ref<L.Map>()
function onMapReady() {
  mapInstance.value = refMapBase.value!.leafletObject
  L.easyBar([
    L.easyButton({
      states: [
        {
          stateName: 'control-active-track',
          icon: '<img src="./assets/track.png" style="width: 20px;">',
          title: '显示轨迹',
          onClick: (btn) => {},
        },
        {
          stateName: 'control-inactive-track',
          icon: '<img src="./assets/track.png" style="width: 20px;">',
          title: '显示轨迹',
          onClick: (btn) => {},
        },
      ],
    }),
  ]).addTo(mapInstance.value)
}
</script>

<template>
  <LMap class="map-base" ref="refMapBase" v-bind="mapOptions" @ready="onMapReady">
    <LTileLayer :url="MAP_TILE_LAYER_2D_PATH"></LTileLayer>
  </LMap>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-base) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
