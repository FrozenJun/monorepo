<script setup lang="ts">
import './cesium-init'
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
import { VcReadyObject } from 'vue-cesium/es/utils/types'
import {
  VcViewer,
  VcConfigProvider,
  VcDrawings,
  VcMeasurements,
  VcCompass,
  VcDistanceLegend,
} from 'vue-cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import 'vue-cesium/dist/index.css'
import TileLayer from '../tile-layer/index.vue'
import { CesiumMapOption } from './map.dto'
import {
  DEFAULT_CESIUM_SHALLOW_OPTION,
  DEFAULT_DISTANCE_LEGEND_OPTION,
  DEFAULT_DRAWINGS_OPTION,
  DEFAULT_COMPASS_OPTION,
  DEFAUTL_VIEWER_OPTION,
  DEFAULT_MEASUREMENTS_OPTION,
} from '../../constant/default.constant'
import { useDispatchEvent } from './useDispatchEvent'
import * as Cesium from 'cesium'

/**
 * 使用vue-cesium必须将Cesium赋值到window上，否则无法加载自定义材质
 */
if (!(window as any).Cesium) (window as any).Cesium = { ...Cesium }

// 地图初始化参数
const props = defineProps({
  mapOption: {
    type: Object as PropType<CesiumMapOption>,
    default: () => ({}),
  },
})

const mapOption = computed(() => {
  return _.defaults(props.mapOption, DEFAULT_CESIUM_SHALLOW_OPTION)
})
const viewerOption = computed(() => {
  return _.defaults(mapOption.value.viewerOption, DEFAUTL_VIEWER_OPTION)
})
const drawingsOption = computed(() => {
  return _.defaults(mapOption.value.drawingsOption, DEFAULT_DRAWINGS_OPTION)
})
const measurementsOption = computed(() => {
  return _.defaults(mapOption.value.measurementsOption, DEFAULT_MEASUREMENTS_OPTION)
})
const compassOption = computed(() => {
  return _.defaults(mapOption.value.compassOption, DEFAULT_COMPASS_OPTION)
})
const showCompass = computed(
  () => mapOption.value.showCompass && viewerOption.value.sceneMode === 3
)
const distanceLegendOption = computed(() => {
  return _.defaults(mapOption.value.distanceLegendOption, DEFAULT_DISTANCE_LEGEND_OPTION)
})

// 地图初始化完成回调
const refMap = ref()
const map = ref<VcReadyObject>()
const measurementsRef = ref()
provide('vcReadyObjectRef', map)

const isMapReady = ref(false)
const readyEmit = defineEmits(['mapReady'])
function onMapReady(v: VcReadyObject) {
  if (!refMap.value) return // 可能还未创建就被销毁，此时refMap.value还是空值
  map.value = v
  mapOption.value.map = v
  if (measurementsRef.value) mapOption.value.measurementsRef = measurementsRef.value

  // 冒泡cesium中接收到的鼠标事件
  useDispatchEvent(v.viewer, refMap.value)

  readyEmit('mapReady', map.value)
  isMapReady.value = true
}
</script>

<template>
  <div class="cesium-map">
    <VcConfigProvider>
      <VcViewer ref="refMap" v-bind="viewerOption" @ready="onMapReady">
        <VcCompass v-if="showCompass" v-bind="compassOption"></VcCompass>
        <VcDistanceLegend
          v-if="mapOption.showDistanceLegend"
          v-bind="distanceLegendOption"
        ></VcDistanceLegend>

        <TileLayer
          :style="mapOption.tileType"
          :source="mapOption.mapSource"
          :lang="mapOption.mapLang"
          :tileProtocol="mapOption.tileProtocol"
          :disableOnlineSource="mapOption.disableOnlineSource"
        ></TileLayer>

        <VcMeasurements
          v-if="mapOption.showMeasurements"
          ref="measurementsRef"
          v-bind="measurementsOption"
        ></VcMeasurements>
        <VcDrawings v-if="mapOption.showDrawings" v-bind="drawingsOption"></VcDrawings>
        <!-- Map加载完毕后再渲染内部子元素 -->
        <slot v-if="isMapReady"></slot>
      </VcViewer>
    </VcConfigProvider>
  </div>
</template>

<style lang="scss">
@import 'common-core/styles/export.scss';

@include b(cesium-map) {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;

  .vc-distance-legend {
    min-height: 24px;
    background: transparent !important;
    label {
      font-size: 16px;
    }
    &:before {
      display: none;
    }
  }
}
</style>
