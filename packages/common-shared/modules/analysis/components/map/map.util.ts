import { Marker, ShapeItem, ShapeItemType, TrackCollection, TrackIcon } from './map.dto'
import * as L from 'leaflet'

export function isInsdeShape(point: L.LatLng, shape: ShapeItem, map?: L.Map) {
  switch (shape.type) {
    case ShapeItemType.circle:
      return isInsideCircle(point, shape.shape.latLng, shape.shape.radius || 0, map)
    case ShapeItemType.polygon:
      return isInsidePolygon(point, shape.shape.latLngs)
  }
}

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
  for (var i = 0; i < iCount; i++) {
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

export function isInsideCircle(point: L.LatLng, center: L.LatLng, r: number, map?: L.Map) {
  if (r === 0 || !map) return false
  return map.distance(point, center) <= r
}

export function getDurationBySeconds(secondsText?: number | string) {
  if (secondsText === 0) return '0秒'
  if (!secondsText) return ''
  const seconds = typeof secondsText === 'string' ? Number(secondsText) : secondsText
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days === 0) {
    return hours === 0
      ? minutes === 0
        ? `${seconds}秒`
        : `${minutes % 60}分钟${seconds % 60}秒`
      : `${hours}时${minutes % 60}分钟`
  } else {
    return `${days}日${hours % 24}时`
  }
}

export function trackVoToTrackIcons(data: any | undefined, obj: any): TrackIcon[] {
  if (!data) return []
  const deviceGroups = data.deviceGroups || []
  const points = (data.points || []) as any[]
  return points
    .filter((point) => {
      const devices = getPointDevices(point)
      return !!devices[0] && devices[0].location && devices[0].location.lat
    })
    .filter((point) => {
      const collections = point.collections || []
      const devices = getPointDevices(point)
      return collections.some((collection) => {
        return devices.find((device) => device.id === collection.deviceId)
      })
    })
    .map<any>((point, index) => {
      const devices = getPointDevices(point)
      // 合并相同设备的采集信息
      const collections = point.collections || []
      const deviceCollections: TrackCollection[] = []
      devices
        .filter((i) => i.location && i.location.lat && i.location.lon)
        .forEach((device) => {
          let deviceCollection: TrackCollection = {
            device: {
              latLng: L.latLng(device.location!.lat!, device.location!.lon!),
              ...device,
            } as any as Marker,
            imageData: [],
            startTime: '',
            endTime: '',
          }
          const matchCollections = collections.filter((collection) => {
            return collection.deviceId === device.id
          })
          // 过滤掉有设备但是没有数据的情况
          if (!matchCollections.length) return
          // 将其他采集到的信息合并
          deviceCollection = { ...deviceCollection, ...matchCollections[0] }
          matchCollections
            .sort((a: any, b: any) => a.collectTime - b.collectTime)
            .forEach((item, index, arr) => {
              if (index === 0) deviceCollection.startTime = item.collectTime as any
              if (index === arr.length - 1) deviceCollection.endTime = item.collectTime as any
            })
          // 第一个设备只取第一次采集时间
          deviceCollections.push(deviceCollection)
        })
      return {
        index:
          index === 0
            ? '起'
            : index === points.length - 1
            ? '终'
            : index < 9
            ? `0${index + 1}`
            : `${index + 1}`,
        type: index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'default',
        startTime: point.startTime as any,
        endTime: point.endTime as any,
        theme: 'default',
        device: deviceCollections[0] ? deviceCollections[0].device : {},
        points: [
          {
            index: index + 1,
            name: obj.name || obj.idcard || obj.imsi || obj.mac || obj.vehicle || '',
            startTime: point.startTime,
            endTime: point.endTime,
            theme: 'default',
            collections: deviceCollections,
          },
        ],
      }
    })
    .reverse()

  function getPointDevices(point: any) {
    const deviceGroup = deviceGroups.find((group) => group.id === point.groupId)
    return (deviceGroup && deviceGroup.devices) || []
  }
}

// 轨迹形成时，地图要自适应展示全部轨迹
export function flyToBoundsByTracklines(tracklines: TrackIcon[][], map?: L.Map) {
  const points: L.LatLng[] = []
  tracklines.forEach((line) => {
    line.forEach((track) => {
      points.push(track.device.latLng!)
    })
  })
  flyToBoundsByPoints(points, map)
}
export function flyToBoundsByPoints(points: L.LatLng[], map?: L.Map) {
  if (!map || !points || !points.length) return
  const cornerLT: [number, number] = [90, 180]
  const cornerRB: [number, number] = [0, 0]
  points.forEach((point) => {
    const lat = point.lat
    const lng = point.lng
    if (lat < cornerLT[0]) cornerLT[0] = lat
    if (lat > cornerRB[0]) cornerRB[0] = lat
    if (lng < cornerLT[1]) cornerLT[1] = lng
    if (lng > cornerRB[1]) cornerRB[1] = lng
  })
  map.flyToBounds(L.latLngBounds(cornerLT, cornerRB), {
    paddingTopLeft: [40, 20],
    paddingBottomRight: [40, 20],
  })
}
export function flyToBoundsByShape(shape: ShapeItem, map?: L.Map) {
  if (!map) return
  switch (shape.type) {
    case ShapeItemType.circle:
      // const circle = L.circle(shape.shape.latLng, shape.shape.radius!)
      // map.fitBounds(circle.getBounds())
      map.setView(shape.shape.latLng, 14)
      break
    default:
      map.fitBounds(shape.shape.latLngs.map(({ lat, lng }) => [lat, lng]))
  }
}

export function getPixelByMeter(meter: number, map: L.Map) {
  const bound = map.getBounds()
  const NorthWest = bound.getNorthWest()
  const NorthEast = bound.getNorthEast()
  const xMeter = map.distance(NorthWest, NorthEast)

  const size = map.getSize()
  return (size.x / xMeter) * meter
}

export function getIconByObjType(objType: OBJ_TYPE_ENUM | undefined) {
  const icons = [
    { type: OBJ_TYPE_ENUM.IMSI, icon: 'icon-IMSI' },
    { type: OBJ_TYPE_ENUM.MAC, icon: 'icon-WIFI' },
    { type: OBJ_TYPE_ENUM.人脸, icon: 'icon-renlianshibie' },
    { type: OBJ_TYPE_ENUM.车辆, icon: 'icon-cheliang-' },
  ]
  const icon = icons.find((i) => i.type === objType)
  return icon ? icon.icon : ''
}
