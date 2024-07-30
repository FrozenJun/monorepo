<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import '../../styles/control.scss'
import { LMap, LControlZoom } from '@vue-leaflet/vue-leaflet'
import * as L from 'leaflet'
import _ from 'lodash'
import {
  computed,
  isReactive,
  nextTick,
  PropType,
  provide,
  reactive,
  ref,
  toRaw,
  watch,
  watchEffect,
} from 'vue'
import { DEFAULT_MAP_OPTION } from '../../constant/map.constant'
import TileLayer from '../tile-layer/index.vue'
import { MapOption } from './map.dto'
import { usePolylineMeasure } from '../../hooks/usePolylineMeasure'
import { useSatellite } from '../../hooks/useSatellite'
import { ShapeItem, ShapeItemType } from './map.dto'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

// 地图初始化参数
const mapProps = defineProps({
  mapOption: {
    type: Object as PropType<MapOption>,
    validator: (value: unknown) => {
      return isReactive(value) // 必须是一个响应式对象
    },
    default: () => reactive({}),
  },
  canDraw: {
    type: Boolean,
    default: false,
  },
  shapes: {
    type: Array as PropType<ShapeItem[]>,
    default: () => [],
  },
  provideName: {
    type: String,
    default: 'mapStatus',
  },
})
const mapProvide = computed<MapOption>(() => {
  return mapProps.mapOption
})
/**
 * TODO 这里有很大的问题， 同页面多个地图会导致实例错乱
 */
provide(mapProps.provideName, mapProvide)
const lMapOptions = ref<Record<string, any>>({
  useGlobalLeaflet: true,
  options: {},
})
watchEffect(() => {
  if (!mapProps.mapOption.mapOption) mapProps.mapOption.mapOption = {}
  const options = _.defaults(mapProps.mapOption.mapOption, DEFAULT_MAP_OPTION)
  lMapOptions.value = {
    useGlobalLeaflet: true,
    ...options,
    options,
  }
})

// 地图初始化完成回调
const refMap = ref()
const map = ref<L.Map>()
const isMapReady = ref(false)
const readyEmit = defineEmits(['mapReady'])
function onMapReady() {
  if (!refMap.value) return // 可能还未创建就被销毁，此时refMap.value还是空值
  isMapReady.value = true
  map.value = refMap.value.leafletObject
  mapProps.mapOption.map = map.value
  mapProps.mapOption.mapOption?.center && map.value?.setView(mapProps.mapOption.mapOption.center)

  watch(
    () => mapProps.canDraw,
    (v) => {
      if (!map.value) return
      if (v) {
        map.value.pm.setLang('zh')
        mapProps.mapOption.pm?.renderDelay ? nextTick(addPmControl) : addPmControl()
        map.value.pm.setPathOptions(
          {
            color: '#F2424C',
            fillColor: '#F2424C',
            fillOpacity: 0.4,
            weight: 1,
          },
          {
            merge: true,
          }
        )
        map.value.pm.Draw.setOptions({
          hintlineStyle: {
            color: '#F2424C',
            fillColor: 'bule',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
          templineStyle: {
            color: '#F2424C',
            fillColor: '#greed',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
          pathOptions: {
            color: '#F2424C',
            fillColor: '#F2424C',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
        })
        map.value.pm.enableDraw('Polygon', {
          snappable: true,
          snapDistance: 20,
          hintlineStyle: {
            color: '#F2424C',
            fillColor: 'bule',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
          templineStyle: {
            color: '#F2424C',
            fillColor: 'greed',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
        })
        map.value.pm.enableDraw('Circle', {
          hintlineStyle: {
            color: '#F2424C',
            fillColor: '#F9CFCA',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
          templineStyle: {
            color: '#F2424C',
            fillColor: '#F2424C',
            fillOpacity: 0.4,
            weight: 1,
            dashArray: '8,8',
          },
        })
        map.value.pm.disableDraw()
      } else {
        map.value.pm.removeControls()
      }
    },
    {
      immediate: true,
    }
  )
  watch(
    () => mapProps.shapes,
    (v) => {
      if (v && v.length) {
        // 计算第一个中心点，地图移到该点
        const first = v[v.length - 1] || {}
        const getPointsCenter = (points: L.LatLng[]) => {
          const lats = points.map((point) => point.lat).sort()
          const lngs = points.map((point) => point.lng).sort()
          return new L.LatLng(
            (lats[0] + (lats.at(-1) || 0)) / 2,
            (lngs[0] + (lngs.at(-1) || 0)) / 2
          )
        }
        let center: L.LatLng | undefined = undefined
        switch (first.type) {
          case ShapeItemType.circle:
            center = first.shape.latLng
            break
          case ShapeItemType.polygon:
            center = getPointsCenter(first.shape.latLngs)
            break
          case ShapeItemType.rectangle:
            center = getPointsCenter(first.shape.latLngs)
        }
        if (center) {
          map.value?.setView(center)
        }
      }
    },
    {
      deep: true,
    }
  )
  readyEmit('mapReady', map.value)
}
function addPmControl() {
  map.value?.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawPolyline: false,
    drawCircleMarker: false,
    drawText: false,
    editControls: true,
    removalMode: false,
    rotateMode: false,
    cutPolygon: false,
    dragMode: false,
    editMode: false,
    ...mapProps.mapOption.pm?.control,
  })
}
// control功能
const isSatelliteInit = ref(false) // 防止多次实例化
// 默认展示卫星图
watchEffect(() => {
  if (
    !isMapReady.value ||
    isSatelliteInit.value === true ||
    (mapProps.mapOption.controls && mapProps.mapOption.controls.satellite === false)
  )
    return
  useSatellite(map.value!, mapProps.mapOption)
  isSatelliteInit.value = true
})
// 默认不展示测距
const isMeasureInit = ref(false) // 防止多次实例化
watchEffect(() => {
  if (
    isMapReady.value &&
    mapProps.mapOption.controls &&
    !isMeasureInit.value &&
    mapProps.mapOption.controls.measure === true
  ) {
    const { polylineMeasure } = usePolylineMeasure(toRaw(map.value!))
    if (mapProps.mapOption.controls) {
      mapProps.mapOption.controls.polylineMeasure = polylineMeasure
    } else {
      mapProps.mapOption.controls = { polylineMeasure }
    }

    isMeasureInit.value = true
  }
})
</script>

<template>
  <!-- 还没有创建成功就删除组件，LMap的onBeforeUnmount会报错，注意避免这种情况 -->
  <LMap
    class="map"
    ref="refMap"
    v-bind="lMapOptions"
    @ready="onMapReady"
    :class="mapOption.dark && 'is-dark'"
  >
    <TileLayer
      :map-option="mapProvide"
      :source="mapOption.mapSource"
      :lang="mapOption.mapLang"
    ></TileLayer>
    <!-- Map加载完毕后再渲染内部子元素 -->
    <slot v-if="isMapReady"></slot>
  </LMap>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(map) {
  width: 100%;
  height: 100%;
  z-index: 0;
  @include when(dark) {
    .leaflet-layer img {
      -webkit-filter: invert(100%) sepia(120%) saturate(355%) hue-rotate(165deg) brightness(50%) !important;
      -ms-filter: invert(100%) sepia(120%) saturate(355%) hue-rotate(165deg) brightness(50%) !important;
      -moz-filter: invert(100%) sepia(120%) saturate(355%) hue-rotate(165deg) brightness(50%) !important;
      filter: invert(100%) sepia(120%) saturate(355%) hue-rotate(165deg) brightness(50%) !important;
    }
  }
}
</style>
