import { MapOption } from '../components/map/map.dto'
import * as L from 'leaflet'
import '../lib/Leaflet.PolylineMeasure.js'

export function usePolylineMeasure(map: L.Map) {
  // 设置测量控件
  const polylineMeasure = (L.control as any)
    .polylineMeasure({
      position: 'topleft',
      unit: 'kilometres',
      showClearControl: true,
      showBearings: true,
      tooltipTextFinish:
        localStorage.language === 'en-US'
          ? 'Click left button to end drawing<br>'
          : localStorage.language === 'ru-RU'
          ? ''
          : '左键点击结束绘制<br>',
      tooltipTextDelete:
        localStorage.language === 'en-US'
          ? 'Shift + left click to delete<br>'
          : localStorage.language === 'ru-RU'
          ? ''
          : 'Shift+左键点击删除<br>',
      tooltipTextMove:
        localStorage.language === 'en-US'
          ? 'Left click to drag<br>'
          : localStorage.language === 'ru-RU'
          ? ''
          : '左键点击可拖动<br>',
      tooltipTextResume: '', // Resume好像是无效的，所以不显示
      measureControlTitleOn:
        localStorage.language === 'en-US'
          ? 'Start drawing'
          : localStorage.language === 'ru-RU'
          ? ''
          : '开始绘制',
      measureControlTitleOff:
        localStorage.language === 'en-US'
          ? 'Stop drawing'
          : localStorage.language === 'ru-RU'
          ? ''
          : '停止绘制',
    })
    .addTo(map)
  return { polylineMeasure }
}
