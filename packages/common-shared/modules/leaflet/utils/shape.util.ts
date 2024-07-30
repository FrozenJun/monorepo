import * as L from 'leaflet'

export function isInsidePolygon(point: L.LatLng, polygonPoints: L.LatLng[]) {
  const x = point.lng
  const y = point.lat

  let iSum = 0
  let dLon1: number
  let dLon2: number
  let dLat1: number
  let dLat2: number
  let dLon: number
  if (polygonPoints.length < 3) return false
  const iCount = polygonPoints.length
  for (let i = 0; i < iCount; i++) {
    if (i == iCount - 1) {
      dLon1 = polygonPoints[i].lng
      dLat1 = polygonPoints[i].lat
      dLon2 = polygonPoints[0].lng
      dLat2 = polygonPoints[0].lat
    } else {
      dLon1 = polygonPoints[i].lng
      dLat1 = polygonPoints[i].lat
      dLon2 = polygonPoints[i + 1].lng
      dLat2 = polygonPoints[i + 1].lat
    }
    //以下语句判断point点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
    if ((y >= dLat1 && y < dLat2) || (y >= dLat2 && y < dLat1)) {
      if (Math.abs(dLat1 - dLat2) > 0) {
        //得到 point点向左射线与边的交点的x坐标：
        dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - y)) / (dLat1 - dLat2)
        if (dLon < x) iSum++
      }
    }
  }
  return iSum % 2 !== 0
}

export function isInsideCircle(
  point: L.LatLngExpression,
  center: L.LatLngExpression,
  r: number,
  map?: L.Map
) {
  if (r === 0 || !map) return false
  return map.distance(point, center) <= r
}
