import Map from './components/map/index.vue'
import * as L from 'leaflet'

/**
 * fix: https://salesforce.stackexchange.com/questions/180977/leaflet-error-when-zoom-after-close-popup-in-lightning-component
 */
;(L.Popup.prototype as any)._animateZoom = function (this: any, e) {
  if (!this._map) {
    return
  }
  const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
    anchor = this._getAnchor()
  L.DomUtil.setPosition(this._container, pos.add(anchor))
}
export { Map }
