import { Viewer } from 'cesium'

export function useInit(viewer: Viewer) {
  // 设置开启深度检测,不能下到地下
  viewer.scene.globe.depthTestAgainstTerrain = true

  removeJagged(viewer)
}

// 消除锯齿
function removeJagged(viewer: any) {
  viewer.scene.postProcessStages.fxaa.enabled = false
  viewer.scene.fxaa = false
  const supportsImageRenderingPixelated = viewer.cesiumWidget._supportsImageRenderingPixelated
  if (supportsImageRenderingPixelated) {
    let vtxf_dpr = window.devicePixelRatio
    while (vtxf_dpr >= 2.0) {
      vtxf_dpr /= 2.0
    }
    viewer.resolutionScale = vtxf_dpr
  }
}
