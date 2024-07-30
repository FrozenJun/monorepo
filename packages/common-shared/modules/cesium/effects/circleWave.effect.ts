import Effect from './effect'
import { CircleWaveMaterialProperty } from '../materials/circleWave.material'
// 水波纹
export class CircleWaveEffect extends Effect {
  count = 3
  constructor(viewer: any, id: string) {
    super(viewer, id)
  }
  change_duration(d: number) {
    super.change_duration(d)
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.duration = d
  }
  change_waveCount(d: number) {
    const curEntity = this.viewer.entities.getById(this.id)
    curEntity._ellipse._material.count = d
  }
  add(position: any, color: string, radius: number, duration: number, isedit = false, count = 3) {
    super.add(position, color, radius, duration, isedit)
    this.count = count
    this.viewer.entities.add({
      id: this.id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
      ellipse: {
        // height: position[2],
        semiMinorAxis: new Cesium.CallbackProperty((n: any) => {
          return this.radius
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty((n: any) => {
          return this.radius
        }, false),
        material: new CircleWaveMaterialProperty(
          Cesium.Color.fromCssColorString(color),
          duration,
          count,
          0
        ),
      },
    })
  }
}
export default CircleWaveEffect
