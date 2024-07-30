import { Camera } from 'cesium'
import { ref, computed, reactive } from 'vue'
import _ from 'lodash'
import { CesiumMapOption } from 'common-shared/modules/cesium/components/cesium-map/map.dto'
import { EMapSource } from 'common-shared/modules/leaflet/components/tile-layer/tileLayer'
import { CesiumObject, useCesium } from 'common-shared/modules/cesium/hooks/useCesium'
import { VcReadyObject } from 'vue-cesium/lib/utils/types.js'

interface cmapOption {
  onMapReady?: (v: VcReadyObject) => void
}
export function useCmap({ onMapReady: mapReady }: cmapOption = {}) {
  const cesiumObject = ref<CesiumObject | undefined>()

  const mapOption: CesiumMapOption = reactive({
    showMeasurements: true,
    mapSource: EMapSource.天地图,
    viewerOption: {
      sceneMode: 3,
    },
  })
  const mapInstance = computed(() => {
    return {
      mapOption,
      cesiumObject,
      map: map.value,
      camera: camera.value,
    }
  })

  const map = ref<VcReadyObject>()
  const camera = computed<Camera>(() => {
    return map.value?.viewer.camera
  })

  return {
    mapOption,
    map,
    camera,
    onMapReady,
    mapInstance,
  }

  function onMapReady(v: VcReadyObject) {
    map.value = v
    mapReady && mapReady(v)
    cesiumObject.value = useCesium(mapOption, v)
  }
}
