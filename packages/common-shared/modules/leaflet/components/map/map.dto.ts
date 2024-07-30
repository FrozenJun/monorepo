import { EMapSource, ETileLayer, EMapLang } from './../tile-layer/tileLayer'
import * as L from 'leaflet'

export interface MapOption {
  id?: string // 用于标识不同地图实例的配置,默认是空字符串
  map?: L.Map
  mapOption?: L.MapOptions
  tileType?: ETileLayer
  tilePaths?: {
    satellite2dPath?: string
    layer2dPath?: string
    satellite3dPath?: string
    layer3dPath?: string
  }
  hiddenOnlineTile?: boolean
  hiddenOfflineTile?: boolean
  mapSource?: EMapSource
  mapLang?: EMapLang
  controls?: {
    satellite?: boolean
    measure?: boolean
    polylineMeasure?: any // polylineMeasure插件返回的实例
  }
  pm?: {
    control?: Record<string, any>
    renderDelay?: boolean
  } // 绘制插件配置
  tileProtocol?: 'http' | 'https' // 显式定义tile的协议，一般不需要，上位机使用
  // 是否是深色地图
  dark?: boolean
}

export enum ShapeItemType {
  circle = 'l-circle',
  polygon = 'l-polygon',
  rectangle = 'l-rectangle',
}
export type ShapeItem =
  | {
      type: ShapeItemType.circle
      shape: L.CircleMarkerOptions & { latLng: L.LatLng }
    }
  | {
      type: ShapeItemType.polygon
      shape: L.PolylineOptions & { latLngs: L.LatLng[] }
    }
  | {
      type: ShapeItemType.rectangle
      shape: L.RendererOptions & { latLngs: L.LatLng[] }
    }
