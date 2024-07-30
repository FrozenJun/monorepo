import * as L from 'leaflet'

/**
 * 已知两点计算角度
 */
export function getAngleByPoints(sPoint: L.LatLng, ePoint: L.LatLng, map: L.Map) {
  const start = map.latLngToContainerPoint(sPoint)
  const end = map.latLngToContainerPoint(ePoint)
  const x = end.x - start.x
  const y = end.y - start.y

  const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
  // 如果是负数，加上360
  return angle < 0 ? angle + 360 : angle
}

/**
 * 已知一点、角度与距离计算另一个坐标
 *
 * @param {*} lng 经度 113.3960698
 * @param {*} lat 纬度 22.941386
 * @param {*} brng 方位角 45 ---- 正北方：000°或360° 正东方：090° 正南方：180° 正西方：270°
 * @param {*} dist 90000距离(米)
 *
 * 1、角度转换为弧度公式：弧度=角度×(π ÷度180 )
 * 2、弧度转换为角度公式： 角度=弧度×（180÷π）
 */
export function getPointByPointAndAngle(lng: number, lat: number, brng: number, dist: number) {
  //大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
  const a = 6378137
  const b = 6356752.3142
  const f = 1 / 298.257223563

  const lon1 = lng * 1
  const lat1 = lat * 1
  const s = dist
  const alpha1 = brng * (Math.PI / 180) //mapNumberUtil.rad(brng);
  const sinAlpha1 = Math.sin(alpha1)
  const cosAlpha1 = Math.cos(alpha1)

  //var tanU1 = (1 - f) * Math.tan(mapNumberUtil.rad(lat1));
  const tanU1 = (1 - f) * Math.tan(lat1 * (Math.PI / 180))
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1)
  const sinU1 = tanU1 * cosU1
  const sigma1 = Math.atan2(tanU1, cosAlpha1)
  const sinAlpha = cosU1 * sinAlpha1
  const cosSqAlpha = 1 - sinAlpha * sinAlpha
  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b)
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)))
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)))

  let sigma = s / (b * A)
  let sigmaP = 2 * Math.PI
  let cos2SigmaM: any
  let sinSigma: any
  let cosSigma: any
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    cos2SigmaM = Math.cos(2 * sigma1 + sigma)
    sinSigma = Math.sin(sigma)
    cosSigma = Math.cos(sigma)
    const deltaSigma =
      B *
      sinSigma *
      (cos2SigmaM +
        (B / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            (B / 6) *
              cos2SigmaM *
              (-3 + 4 * sinSigma * sinSigma) *
              (-3 + 4 * cos2SigmaM * cos2SigmaM)))
    sigmaP = sigma
    sigma = s / (b * A) + deltaSigma
  }

  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1
  const lat2 = Math.atan2(
    sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
  )
  const lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1)
  const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha))
  const L =
    lambda -
    (1 - C) *
      f *
      sinAlpha *
      (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))

  // const revAz = Math.atan2(sinAlpha, -tmp) // final bearing

  const lngLatObj = { lng: lon1 + L * (180 / Math.PI), lat: lat2 * (180 / Math.PI) }
  return lngLatObj
}

// 转换角度到弧度
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusKm = 6371 // 地球半径（千米）
  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceKm = earthRadiusKm * c
  return distanceKm
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}
