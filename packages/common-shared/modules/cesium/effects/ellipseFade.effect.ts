import { EllipseFadeMaterialPropetry } from '../materials/ellipseFade.material'
import Effect from './effect'

export class EllipseFadeEffect extends Effect {
  constructor(viewer: any, id: string) {
    super(viewer, id)
  }

  add(position: any, color: string, radius: number, duration: number, isedit = false) {
    super.add(position, color, radius, duration, isedit)
    let currentRadius = 1
    const entity = this.viewer.entities.add({
      id: this.id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      ellipse: {
        // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        // height: position[2],
        // extrudedHeight: position[2], // 如果这里设置高度 那么就会直接穿透 不洒在建筑物上
        semiMajorAxis: new Cesium.CallbackProperty((n: any) => {
          currentRadius += (1000 / this.duration) * 50
          if (currentRadius > this.radius) {
            currentRadius = 1
          }
          return currentRadius
        }, false),
        semiMinorAxis: new Cesium.CallbackProperty(function (n: any) {
          return currentRadius
        }, false),
        material: new EllipseFadeMaterialPropetry(
          Cesium.Color.fromCssColorString(color),
          this.duration
        ),
      },
    })
    return entity.id
  }
}
