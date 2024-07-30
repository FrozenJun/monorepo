import * as L from 'leaflet'
import '../lib/Leaflet.ChineseTmsProviders.js'
import 'leaflet-easybutton'
import { watchEffect } from 'vue'
import { MapOption } from '../components/map/map.dto'
import { ETileLayer } from '../components/tile-layer/tileLayer'
import _ from 'lodash'

export function useSatellite(map: L.Map, mapOption: MapOption) {
  // 切换图层
  const tileStateName2d = 'control-inactive-satellite'
  const tileStateName3d = 'control-active-satellite'
  const switchTileBtn = L.easyButton({
    states: [
      {
        stateName: tileStateName3d,
        icon: '<i class="iconfont icon-weixing"></i>',
        title:
          localStorage.language === 'en-US'
            ? 'Satellite Map'
            : localStorage.language === 'ru-RU'
            ? ''
            : '卫星地图',
        onClick: () => {
          mapOption && (mapOption.tileType = ETileLayer.普通)
        },
      },
      {
        stateName: tileStateName2d,
        icon: '<i class="iconfont icon-weixing"></i>',
        title:
          localStorage.language === 'en-US'
            ? 'Road Map'
            : localStorage.language === 'ru-RU'
            ? ''
            : '2D地图',
        onClick: () => {
          mapOption && (mapOption.tileType = ETileLayer.立体)
        },
      },
    ],
  })

  watchEffect(() => {
    switch (mapOption.tileType) {
      case ETileLayer.立体:
        switchTileBtn.state(tileStateName3d)

        break
      case ETileLayer.普通:
        switchTileBtn.state(tileStateName2d)
    }
  })

  L.easyBar([switchTileBtn]).addTo(map)
}
