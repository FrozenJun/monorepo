// 需要安装 @geoman-io/leaflet-geoman-free npm包
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { Ref, ref } from 'vue'
export interface IGeoman {
  hasControls: Ref<boolean>
  addControls: () => void
  removeControls: () => void
  setColor: (color?: string) => void
}

export const useGeoman = (map: L.Map) => {
  map.pm.setLang('zh')

  const hasControls = ref(false)

  const addControls = () => {
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawText: false,
      editControls: true,
      removalMode: false,
      rotateMode: false,
      cutPolygon: false,
      dragMode: true,
      editMode: true,
    })
    hasControls.value = true
  }
  const removeControls = () => {
    map.pm.removeControls()

    hasControls.value = false
  }

  /**
   * 在drawstart事件中使用
   */
  const setColor = (color = '#F2424C') => {
    map.pm.setGlobalOptions({
      hintlineStyle: {
        color,
        fillColor: 'F9CFCA',
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '8,8',
      },
      templineStyle: {
        color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '8,8',
      },
    })
    map.pm.applyGlobalOptions()

    map.pm.setPathOptions(
      {
        color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 1,
      },
      {
        merge: true,
      }
    )
    map.pm.Draw.setOptions({
      hintlineStyle: {
        color,
        fillColor: 'bule',
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '8,8',
      },
      templineStyle: {
        color,
        fillColor: '#greed',
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '8,8',
      },
      pathOptions: {
        color,
        fillColor: color,
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '8,8',
      },
    })
  }

  return { hasControls, addControls, removeControls, setColor }
}
