/**
 * 坐标转换工具
 */

import { Cartesian3, Cartographic, Math } from 'cesium'

/**
 * [lng, lat, height] => Cartesian3
 */
export function positionToCartesian3(position: number[]) {
  // 使用Cesium.Cartesian3.fromDegrees将经纬度和高度转换为Cartesian3
  const cartesianPosition = Cartesian3.fromDegrees(position[0], position[1], position[2])
}

export function Cartesian3ToPostion(cartesian: Cartesian3) {
  const cartographic = Cartographic.fromCartesian(cartesian)
  return [
    Math.toDegrees(cartographic.longitude),
    Math.toDegrees(cartographic.latitude),
    cartographic.height,
  ]
}
