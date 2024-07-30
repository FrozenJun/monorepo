import RotateRadar from '../lib/Leaflet.RotateRadar.js'
import _ from 'lodash'

export interface RotateRadarOption {
  radius: number
  angle: number
  direction: number
  location: string // Longitude dimension of sector start position,like: '22.777321, 100.972344'
  config: {
    step?: number //The refresh distance of each frame of radar scanning animation. The unit is meter.
    // 雷达动画区样式配置
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
  }
}
export function useRotateRadar(options: RotateRadarOption) {
  const rotateRadarLayer = new RotateRadar(
    options,
    _.defaultsDeep(options.config, {
      step: 3,
      animat: {
        weight: 0,
        opacity: 0,
      },
      online: {
        weight: 0,
        opacity: 0,
        fillOpacity: 0,
      },
    })
  ) as L.LayerGroup

  return { rotateRadarLayer }
}
