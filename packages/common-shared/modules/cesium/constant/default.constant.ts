import { Cartesian3 } from 'cesium'
import {
  VcDrawingsProps,
  VcViewerProps,
  VcDistanceLegendProps,
  VcCompassProps,
  VcMeasurementsProps,
} from 'vue-cesium'

export const DEFAUTL_VIEWER_OPTION: VcViewerProps = {
  camera: {
    position: [120.08936, 30.3422, 1000],
    heading: 15, // 镜头左右方向，z轴
    pitch: -40, // 镜头上下方向，y轴
    roll: 0, // 镜头左右倾斜，x轴
  },
  selectionIndicator: false, // 禁用点击实体出现的选择高亮指示器
  infoBox: false, // 禁用点击实体弹出的infobox框
  showCredit: false, // 是否显示默认 Logo 和 加载数据版权信息。
  removeCesiumScript: false, // vc-viewer 组件销毁时是否移除CesiumJS标签。
}

export const DEFAULT_DRAWINGS_OPTION: VcDrawingsProps = {
  drawings: ['polyline', 'polygon', 'rectangle', 'circle'],
  offset: [240, 40],
}

export const DEFAULT_MEASUREMENTS_OPTION: VcMeasurementsProps = {
  measurements: ['polyline'],
  offset: [-99999, 0],
}

export const DEFAULT_COMPASS_OPTION: VcCompassProps = {
  position: 'bottom-right',
  offset: [5, 38],
}

export const DEFAULT_DISTANCE_LEGEND_OPTION: VcDistanceLegendProps = {
  position: 'bottom-right',
  offset: [10, 10],
}

// 只能配置非对象数组类的默认选项，对象数组类的默认配置单独配置一个默认选项
export const DEFAULT_CESIUM_SHALLOW_OPTION = {
  showCompass: true,
  showDistanceLegend: true,
}
