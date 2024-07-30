<script setup lang="ts">
import { ComputedRef, PropType, computed, inject } from 'vue'
import {
  MAP_MAX_ZOOM,
  MAP_TILE_LAYER_2D_PATH,
  MAP_TILE_LAYER_SATELLITE_2D_PATH,
  MAP_TILE_LAYER_OVERLAY_3D_PATH,
  MAP_TILE_LAYER_SATELLITE_3D_PATH,
} from '../../constant/map.constant'
import ChineseProvide from '../../lib/Leaflet.ChineseTmsProviders.js'
import { ETileLayer, EMapSource, EMapLang } from './tileLayer'
import { LTileLayer } from '@vue-leaflet/vue-leaflet'
import { MapOption } from '../map/map.dto'
import _ from 'lodash'

const props = defineProps({
  mapOption: {
    type: Object as PropType<MapOption>,
    default: () => ({}),
  },
  source: { type: String as PropType<EMapSource>, default: EMapSource.天地图 }, // 不要随意变更默认地图，会导致偏差
  lang: { type: String as PropType<EMapLang>, default: EMapLang.中文 },
})
const subdomains = computed(() => {
  return props.source === EMapSource.天地图 ? '01234567' : '1234'
})

const mapProvide = computed(() => {
  const value = _.cloneDeep(ChineseProvide)
  if (props.lang && props.lang !== EMapLang.中文) {
    value.GaoDe.Normal.Map =
      '//webrd0{s}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
  }
  return value
})
</script>

<template>
  <!-- 2d -->
  <LTileLayer
    v-if="
      !mapOption.hiddenOfflineTile &&
      mapOption?.tileType === ETileLayer.普通 &&
      props.source === EMapSource.天地图
    "
    :url="mapOption.tilePaths?.satellite2dPath || MAP_TILE_LAYER_SATELLITE_2D_PATH"
  ></LTileLayer>
  <LTileLayer
    v-if="!mapOption.hiddenOfflineTile && mapOption?.tileType === ETileLayer.普通"
    :url="mapOption.tilePaths?.layer2dPath || MAP_TILE_LAYER_2D_PATH"
  ></LTileLayer>
  <LTileLayer
    v-if="!mapOption.hiddenOnlineTile && mapOption?.tileType === ETileLayer.普通"
    :url="`${mapOption?.tileProtocol ? `${mapOption?.tileProtocol}:` : ''}${
      mapProvide[source]['Normal']['Map']
    }`"
    :subdomains="subdomains"
    :max-zoom="MAP_MAX_ZOOM"
  ></LTileLayer>
  <LTileLayer
    v-if="!mapOption.hiddenOnlineTile && mapOption?.tileType === ETileLayer.普通"
    :url="`${mapOption?.tileProtocol ? `${mapOption?.tileProtocol}:` : ''}${
      mapProvide[source]['Normal']['Annotion']
    }`"
    :subdomains="subdomains"
    :max-zoom="MAP_MAX_ZOOM"
  ></LTileLayer>
  <!-- 3d -->
  <LTileLayer
    v-if="
      (!mapOption.hiddenOfflineTile && !mapOption?.tileType) ||
      mapOption?.tileType === ETileLayer.立体
    "
    :url="mapOption.tilePaths?.satellite3dPath || MAP_TILE_LAYER_SATELLITE_3D_PATH"
  ></LTileLayer>
  <LTileLayer
    v-if="
      (!mapOption.hiddenOfflineTile && !mapOption?.tileType) ||
      mapOption?.tileType === ETileLayer.立体
    "
    :url="mapOption.tilePaths?.layer3dPath || MAP_TILE_LAYER_OVERLAY_3D_PATH"
  ></LTileLayer>
  <LTileLayer
    v-if="
      (!mapOption.hiddenOnlineTile && !mapOption?.tileType) ||
      mapOption?.tileType === ETileLayer.立体
    "
    :url="`${mapOption?.tileProtocol ? `${mapOption?.tileProtocol}:` : ''}${
      mapProvide[source]['Satellite']['Map']
    }`"
    :subdomains="subdomains"
    :max-zoom="MAP_MAX_ZOOM"
  ></LTileLayer>
  <LTileLayer
    v-if="
      (!mapOption.hiddenOnlineTile && !mapOption?.tileType) ||
      mapOption?.tileType === ETileLayer.立体
    "
    :url="`${mapOption?.tileProtocol ? `${mapOption?.tileProtocol}:` : ''}${
      mapProvide[source]['Satellite']['Annotion']
    }`"
    :subdomains="subdomains"
    :max-zoom="MAP_MAX_ZOOM"
  ></LTileLayer>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map-base) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
