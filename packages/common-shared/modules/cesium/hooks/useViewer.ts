import { Cartesian2 } from 'cesium'
import { useCamera } from './useCamera'

export function useViewer(viewer: Cesium.Viewer) {
  const camera = viewer.camera
  const cameraUtils = useCamera(viewer.camera)

  return {
    viewer,
    camera,
    cameraUtils,
    lockScene,
    unlockScene,
    getPositionByCartesian2,
  }

  /**
   * 将屏幕坐标转为经纬度
   */
  function getPositionByCartesian2(position: Cartesian2): [number, number] | undefined {
    const cartesian = camera.pickEllipsoid(position, viewer.scene.globe.ellipsoid)
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      return [longitude, latitude]
    } else {
      console.log('No ellipsoid picked')
    }
  }

  /**
   * 禁用相机控制函数
   */
  function lockScene() {
    viewer.scene.screenSpaceCameraController.enableRotate = false
    // viewer.scene.screenSpaceCameraController.enableZoom = false
    viewer.scene.screenSpaceCameraController.enableTranslate = false
    viewer.scene.screenSpaceCameraController.enableTilt = false
    viewer.scene.screenSpaceCameraController.enableLook = false
  }
  /**
   * 启用相机控制函数
   */
  function unlockScene() {
    viewer.scene.screenSpaceCameraController.enableRotate = true
    // viewer.scene.screenSpaceCameraController.enableZoom = true
    viewer.scene.screenSpaceCameraController.enableTranslate = true
    viewer.scene.screenSpaceCameraController.enableTilt = true
    viewer.scene.screenSpaceCameraController.enableLook = true
  }
}
