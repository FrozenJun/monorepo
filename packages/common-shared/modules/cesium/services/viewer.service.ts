import { Camera, Cartesian3, Viewer, Math } from 'cesium'
import _ from 'lodash'

export class ViewerService {
  viewer: globalThis.Cesium.Viewer
  camera: Camera

  constructor(viewer: globalThis.Cesium.Viewer) {
    this.viewer = viewer
    this.camera = viewer.camera
  }

  /**
   * 摄像头移动至指定位置
   */
  panTo(longitude: number, latitude: number, height?: number) {
    this.camera.setView({
      destination: Cartesian3.fromDegrees(
        longitude,
        latitude,
        _.isNumber(height) ? height : this.camera.positionCartographic.height
      ),
    })
  }

  getCenter(): [number, number, number] {
    const center = this.camera.positionCartographic
    const longitude = Math.toDegrees(center.longitude)
    const latitude = Math.toDegrees(center.latitude)
    const height = center.height
    return [longitude, latitude, height]
  }

  panToCenter() {
    this.panTo(...this.getCenter())
  }
}
