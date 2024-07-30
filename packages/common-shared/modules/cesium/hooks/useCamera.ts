import {
  Camera,
  Cartesian3,
  Math as CesiumMath,
  Matrix4,
  HeadingPitchRollValues,
  HeadingPitchRange,
  EasingFunction,
} from 'cesium'
import _ from 'lodash'

export function useCamera(camera: Camera) {
  let orientationCache: HeadingPitchRollValues | undefined

  const utils = {
    camera,
    getPosition,
    panTo: setView, // 适配leaflet
    setView,
    setViewToCamera,
    lookAt,
    cacheOrientation,
    restoreOrientation,
    flyToBoundingSphere,
  }
  return utils

  function getPosition(): [number, number, number] {
    const { longitude, latitude, height } = camera.positionCartographic
    return [CesiumMath.toDegrees(longitude), CesiumMath.toDegrees(latitude), height]
  }

  /**
   * 摄像头移动至指定位置，此时地图中心是摄像头
   * 摄像头方向不变
   */
  function setView(longitude: number, latitude: number, height?: number) {
    camera.setView({
      destination: Cartesian3.fromDegrees(
        longitude,
        latitude,
        _.isNumber(height) ? height : camera.positionCartographic.height
      ),
    })

    return utils
  }
  function setViewToCamera() {
    setView(...getPosition())
    return utils
  }

  /**
   * 摄像头看向目标，此时地图中心是目标
   * 如果不传入range, 将保持当前摄像头高度不变
   */
  function lookAt(
    target: number[],
    { heading, pitch, range }: { heading?: number; pitch?: number; range?: number } = {}
  ) {
    const headingRadian = _.isNumber(heading) ? CesiumMath.toRadians(heading) : camera.heading
    const pitchRadian = _.isNumber(pitch) ? CesiumMath.toRadians(pitch) : camera.pitch

    const heightDifference = camera.positionCartographic.height - (target[2] || 0)
    const sameCameraHeightRange = heightDifference / Math.sin(-pitchRadian)

    camera.lookAt(Cartesian3.fromDegrees(target[0], target[1], target[2] || 0), {
      heading: headingRadian,
      pitch: pitchRadian,
      range: range || sameCameraHeightRange,
    })

    // 相机移动完成后解除相机锁定
    camera.lookAtTransform(Matrix4.IDENTITY)
    return utils
  }

  /**
   * 将相机移动至合适的视角看传入的多个位置
   */
  function flyToBoundingSphere(
    positions: [number, number, number?][],
    options?: {
      duration?: number
      offset?: HeadingPitchRange
      complete?: Camera.FlightCompleteCallback
      cancel?: Camera.FlightCancelledCallback
      endTransform?: Matrix4
      maximumHeight?: number
      pitchAdjustHeight?: number
      flyOverLongitude?: number
      flyOverLongitudeWeight?: number
      easingFunction?: EasingFunction.Callback
    }
  ) {
    const boundingSphere = Cesium.BoundingSphere.fromPoints(
      positions.map((i) => Cesium.Cartesian3.fromDegrees(...i))
    )
    camera.flyToBoundingSphere(boundingSphere, options)
    return utils
  }

  /**
   * 缓存当前的相机视角
   */
  function cacheOrientation() {
    orientationCache = {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    }
    return utils
  }
  function restoreOrientation() {
    if (orientationCache) {
      camera.setView({
        orientation: orientationCache,
      })
    }
    return utils
  }
}
