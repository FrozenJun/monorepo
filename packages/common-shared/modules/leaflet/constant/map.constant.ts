import * as L from 'leaflet'

/** 地图瓦片地址*/
export const MAP_TILE_LAYER_2D_PATH = '/public/map/2d/{z}/{x}/{y}.png'
export const MAP_TILE_LAYER_SATELLITE_2D_PATH = '/public/map/2d/satellite/{z}/{x}/{y}.jpg'
export const MAP_TILE_LAYER_OVERLAY_3D_PATH = '/public/map/3d/overlay/{z}/{x}/{y}.png'
export const MAP_TILE_LAYER_SATELLITE_3D_PATH = '/public/map/3d/satellite/{z}/{x}/{y}.jpg'

/** 雷达默认转角 */
export const MAP_ROTATE_RADAR_DIRECTION = 0
export const MAP_ROTATE_RADAR_ANGEL = 180

/** 最大放大倍数*/
export const MAP_MAX_ZOOM = 18

/** 默认初始化放大倍数*/
export const INIT_ZOOM = 18

/** 地图中心点 */
// export const MAP_CENTER = L.latLng(24.945940, 102.707886) // 昆明会展
// export const MAP_CENTER = L.latLng(24.98740294, 102.67415211) // 昆明1903
export const MAP_CENTER = L.latLng(30.253083, 120.215512) // 杭州
// export const MAP_CENTER = L.latLng(30.342541254953613, 120.08917693893585) // 公司
// export const MAP_CENTER = L.latLng(24.436227169082585, 98.59490219055176) // 德宏
// export const MAP_CENTER = L.latLng(23.36422, 103.3756) // 红河

/**
 * 虚线样式
 */
export const MAP_CIRCLE_DASH_ARRAY = [15, 10, 5, 10]

export const MAP_CIRCLE_WEIGHT = 2

/**
 * 地图默认配置
 */
export const DEFAULT_MAP_OPTION: L.MapOptions = {
  zoom: INIT_ZOOM,
  center: MAP_CENTER,
  maxZoom: MAP_MAX_ZOOM,
  zoomAnimation: true,
  fadeAnimation: true,
}
