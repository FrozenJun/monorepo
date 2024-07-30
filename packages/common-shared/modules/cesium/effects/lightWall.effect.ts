// eslint-disable-line no-unused-vars
/* eslint-disable no-debugger */
import { LightWallMaterialProperty } from '../materials/lightWall.material'
import { Cartesian3 } from 'cesium'

// 推动墙扩散
export class LightWallEffect {
  viewer: any
  id: string

  radius = 0
  pointDraged: any
  update_position: any
  wallHeight = 200
  position: any = undefined
  positions: any[] = []

  constructor(viewer: any, id: string) {
    this.viewer = viewer
    this.id = id
  }

  del() {
    this.viewer.entities.removeById(this.id)
  }
  add({
    positions,
    center,
    color,
    radius,
    wallHeight = 200,
  }: {
    positions?: any
    center?: any
    color: string
    radius?: number
    wallHeight?: number
  }) {
    if (positions) {
      this.positions = this.pointsToPositions(
        positions.map(({ lat, lng }) => [lng, lat]),
        0
      )
    } else if (center && radius) {
      this.positions = getCirclePositions(center.lng, center.lat, radius)
    }
    this.wallHeight = wallHeight
    this.viewer.entities.add({
      id: this.id,
      wall: {
        fill: true,
        positions: this.positions,
        minimumHeights: new Array(this.positions.length).fill(0),
        maximumHeights: new Array(this.positions.length).fill(wallHeight),
        material: new LightWallMaterialProperty(Cesium.Color.fromCssColorString(color)),
      },
    })
  }

  pointsToPositions(t: any, e: any) {
    const n: any[] = []
    return (
      t.map(function (t: any) {
        n.push(Cesium.Cartesian3.fromDegrees(t[0], t[1], e))
      }),
      n
    )
  }
}

export function getCirclePositions(lng: number, lat: number, radius: number) {
  const n: any[] = []
  for (let i = 0; i <= 360; i += 2) {
    n.push(getCirclePoint(lng, lat, i, radius))
  }
  return n.map(([lng, lat]) => Cartesian3.fromDegrees(lng, lat, 0))
}

function getCirclePoint(t: any, e: any, n: any, i: any) {
  const r = i * Math.sin((n * Math.PI) / 180)
  i *= Math.cos((n * Math.PI) / 180)
  return [
    (180 *
      (r / ((n = 6356725 + (21412 * (90 - e)) / 90) * Math.cos((e * Math.PI) / 180)) +
        (t * Math.PI) / 180)) /
      Math.PI,
    (180 * (i / n + (e * Math.PI) / 180)) / Math.PI,
  ]
}

export default LightWallEffect
