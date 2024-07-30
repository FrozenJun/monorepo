import * as L from 'leaflet'
import { CoordConver } from './correction'

//坐标转换 - https://github.com/gisarmory/Leaflet.InternetMapCorrection
export function transformGps84ToGcj02() {
  _transform('gps84_To_gcj02')
}

export function transformGcj02ToGps84() {
  _transform('gcj02_To_gps84')
}

function _transform(transformMethodName) {
  const coordConver = new CoordConver()

  L.GridLayer.include({
    _setZoomTransform: function (level, _center, zoom) {
      var center = _center
      if (center != undefined) {
        center = coordConver[transformMethodName](_center.lng, _center.lat)
      }
      var scale = this._map.getZoomScale(zoom, level.zoom),
        translate = level.origin
          .multiplyBy(scale)
          .subtract(this._map._getNewPixelOrigin(center, zoom))
          .round()

      if (L.Browser.any3d) {
        L.DomUtil.setTransform(level.el, translate, scale)
      } else {
        L.DomUtil.setPosition(level.el, translate)
      }
    },
    _getTiledPixelBounds: function (_center) {
      var center = _center
      if (center != undefined) {
        center = coordConver[transformMethodName](_center.lng, _center.lat)
      }
      var map = this._map,
        mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
        scale = map.getZoomScale(mapZoom, this._tileZoom),
        pixelCenter = map.project(center, this._tileZoom).floor(),
        halfSize = map.getSize().divideBy(scale * 2)

      return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize))
    },
  })
}

export { CoordConver }
