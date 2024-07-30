import { VcReadyObject } from 'vue-cesium/es/utils/types'
import { useViewer } from './useViewer'
import { CesiumMapOption } from '../components/cesium-map/map.dto'

export type CesiumObject = ReturnType<typeof useCesium>
export function useCesium(mapOption: CesiumMapOption, readyObject: VcReadyObject) {
  const viewerObj = useViewer(readyObject.viewer)

  const vueCesium = {
    mapOption,
    readyObject,
    ...readyObject,
    ...viewerObj,
  }
  return vueCesium
}
