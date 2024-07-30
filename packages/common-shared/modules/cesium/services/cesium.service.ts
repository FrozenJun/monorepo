import { VcReadyObject } from 'vue-cesium/es/utils/types'
import { ViewerService } from './viewer.service'

/**
 * 复杂页面下，子组件需要共享主地图实例时，可以使用该服务创建服务实例
 *
 * 基于vue-cesium的readyObjec对象
 */
export class VueCesiumService {
  readyObject: VcReadyObject | undefined
  viewer: ViewerService | undefined

  init(obj: VcReadyObject) {
    this.readyObject = obj
    this.viewer = new ViewerService(obj.viewer)
  }
}
