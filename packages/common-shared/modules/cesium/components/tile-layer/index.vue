<script setup lang="ts">
import { ComputedRef, PropType, computed, inject } from 'vue'
import ChineseProvide from '../../../leaflet/lib/Leaflet.ChineseTmsProviders.js'
import _ from 'lodash'
import { VcImageryProviderUrltemplate, VcLayerImagery } from 'vue-cesium'
import {
  EMapLang,
  EMapSource,
  ETileLayer,
} from '../../../leaflet/components/tile-layer/tileLayer.js'
import {
  MAP_MAX_ZOOM,
  MAP_TILE_LAYER_2D_PATH,
  MAP_TILE_LAYER_SATELLITE_2D_PATH,
  MAP_TILE_LAYER_OVERLAY_3D_PATH,
  MAP_TILE_LAYER_SATELLITE_3D_PATH,
} from '../../../leaflet/constant/map.constant'

const props = defineProps({
  style: { type: String as PropType<ETileLayer>, default: ETileLayer.立体 },
  source: { type: String as PropType<EMapSource>, default: EMapSource.天地图 }, // 不要随意变更默认地图，会导致偏差
  lang: { type: String as PropType<EMapLang>, default: EMapLang.中文 },
  tileProtocol: { type: String, default: 'http' },
  disableOnlineSource: Boolean,
})

const subdomains = computed(() => {
  return props.source === EMapSource.天地图 ? '01234567' : '1234'
})
const projectionTransforms: any = computed(() => {
  return props.source === EMapSource.高德
    ? {
        from: 'GCJ02',
        to: 'WGS84',
      }
    : undefined
})

const provider = computed(() => {
  const value = _.cloneDeep(ChineseProvide)
  if (props.lang && props.lang !== EMapLang.中文) {
    value.GaoDe.Normal.Map =
      '//webrd0{s}.is.autonavi.com/appmaptile?lang=en&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
  }
  return value
})
</script>

<template>
  <!-- 在线_卫星图 -->
  <VcLayerImagery v-if="!disableOnlineSource && style === ETileLayer.立体" :sort-order="20">
    <VcImageryProviderUrltemplate
      :url="`${tileProtocol ? `${tileProtocol}:` : ''}${provider[source]['Satellite']['Annotion']}`"
      :maximumLevel="MAP_MAX_ZOOM"
      :subdomains="subdomains"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
  <VcLayerImagery v-if="!disableOnlineSource && style === ETileLayer.立体" :sort-order="10">
    <VcImageryProviderUrltemplate
      :url="`${tileProtocol ? `${tileProtocol}:` : ''}${provider[source]['Satellite']['Map']}`"
      :maximumLevel="MAP_MAX_ZOOM"
      :subdomains="subdomains"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
  <!-- 在线_道路图 -->
  <VcLayerImagery
    v-if="
      !disableOnlineSource && style === ETileLayer.普通 && provider[source]['Normal']['Annotion']
    "
    :sort-order="20"
  >
    <VcImageryProviderUrltemplate
      :url="`${tileProtocol ? `${tileProtocol}:` : ''}${provider[source]['Normal']['Annotion']}`"
      :maximumLevel="MAP_MAX_ZOOM"
      :subdomains="subdomains"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
  <VcLayerImagery v-if="!disableOnlineSource && style === ETileLayer.普通" :sort-order="10">
    <VcImageryProviderUrltemplate
      :url="`${tileProtocol ? `${tileProtocol}:` : ''}${provider[source]['Normal']['Map']}`"
      :maximumLevel="MAP_MAX_ZOOM"
      :subdomains="subdomains"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>

  <!-- 离线地图_道路图 -->
  <VcLayerImagery v-if="style === ETileLayer.普通">
    <VcImageryProviderUrltemplate
      :url="MAP_TILE_LAYER_2D_PATH"
      :subdomains="subdomains"
      :maximumLevel="MAP_MAX_ZOOM"
      :projectionTransforms="projectionTransforms"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
  <!-- 离线地图_道路图_标注，只有天地图需要 -->
  <VcLayerImagery v-if="style === ETileLayer.普通 && source === EMapSource.天地图">
    <VcImageryProviderUrltemplate
      :url="MAP_TILE_LAYER_SATELLITE_2D_PATH"
      :subdomains="subdomains"
      :maximumLevel="MAP_MAX_ZOOM"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>

  <!-- 离线地图_卫星图 -->
  <VcLayerImagery v-if="style === ETileLayer.立体">
    <VcImageryProviderUrltemplate
      :url="MAP_TILE_LAYER_SATELLITE_3D_PATH"
      :subdomains="subdomains"
      :maximumLevel="MAP_MAX_ZOOM"
      :projectionTransforms="projectionTransforms"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
  <VcLayerImagery v-if="style === ETileLayer.立体">
    <VcImageryProviderUrltemplate
      :url="MAP_TILE_LAYER_OVERLAY_3D_PATH"
      :subdomains="subdomains"
      :maximumLevel="MAP_MAX_ZOOM"
      :projectionTransforms="projectionTransforms"
    ></VcImageryProviderUrltemplate>
  </VcLayerImagery>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(cesium-tile-layer) {
}
</style>
