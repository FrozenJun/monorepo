import * as L from 'leaflet'
import ArrowCircle from '../lib/Leaflet.ArrowCircle.js'

export interface ArrowCircleOption {
  latLng?: L.LatLng
  iconOptions?: {
    color?: string
    className?: string
    size?: number
    opacity?: number
    rotation?: number
  }
  iconFactory?: L.DivIcon
}

export function useArrowCircle(options: ArrowCircleOption) {
  console.log(options)
  const arrowCircle = ArrowCircle(options)
  return { arrowCircle }
}
