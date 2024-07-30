import { VcReadyObject } from 'vue-cesium/es/utils/types'
import {
  VcDrawingsProps,
  VcViewerProps,
  VcCompassProps,
  VcDistanceLegendProps,
  VcMeasurementsProps,
  VcMeasurementsRef,
} from 'vue-cesium'
import { EMapLang, EMapSource, ETileLayer } from '../../../leaflet/components/tile-layer/tileLayer'

export interface CesiumMapOption {
  id?: string // 用于标识不同地图实例的配置,默认是空字符串
  map?: VcReadyObject

  viewerOption?: VcViewerProps
  showDrawings?: boolean
  drawingsOption?: VcDrawingsProps
  showMeasurements?: boolean
  measurementsOption?: VcMeasurementsProps
  measurementsRef?: VcMeasurementsRef
  showCompass?: boolean
  compassOption?: VcCompassProps
  showDistanceLegend?: boolean
  distanceLegendOption?: VcDistanceLegendProps

  // tile图层相关
  disableOnlineSource?: boolean // 是否禁用在线地图
  mapSource?: EMapSource
  mapLang?: EMapLang
  tileType?: ETileLayer
  tilePaths?: {
    satellite2dPath?: string
    layer2dPath?: string
    satellite3dPath?: string
    layer3dPath?: string
  }
  hiddenOnlineTile?: boolean
  hiddenOfflineTile?: boolean
  tileProtocol?: 'http' | 'https' // 显式定义tile的协议，一般不需要，上位机使用
}
