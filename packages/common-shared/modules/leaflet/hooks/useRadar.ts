import Radar from '../lib/Leaflet.Radar.js'
import _ from 'lodash'

export interface RadarOption {
  hidden?: boolean
  radius: number
  angle: number
  direction: number
  location: string // Longitude dimension of sector start position,like: '22.777321, 100.972344'
  position?: number[]
  config: {
    step?: number //The refresh distance of each frame of radar scanning animation. The unit is meter.
    online?: {
      // 雷达动画区样式配置
      color?: string
      weight?: number
      opacity?: number
      fillColor?: string
      fillOpacity?: number
      isFill?: boolean
    }
  }
}
export function useRadar(options: RadarOption) {
  const radarLayer = Radar(
    options,
    _.defaultsDeep(options.config, {
      step: 12,
    })
  ) as L.LayerGroup
  return { radarLayer }
}
