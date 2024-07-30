import { Cartesian3 } from 'cesium'

export function distance(p1: Cartesian3, p2: Cartesian3) {
  return Cartesian3.distance(p1, p2)
}

export const utilsService = {
  distance,
}
