export enum ShapeItemType {
  circle = 'l-circle',
  polygon = 'l-polygon',
}
export type ShapeItem =
  | {
      type: ShapeItemType.circle
      shape: L.CircleMarkerOptions & { latLng: L.LatLng }
    }
  | {
      type: ShapeItemType.polygon
      shape: L.PolylineOptions & { latLngs: L.LatLng[] }
    }

export interface Marker {
  id: string | number
  latLng: L.LatLng
  [key: string]: any
  iconType?: 'person' | 'track'
}

export interface ResideMarker extends Marker {
  sort?: number
  count?: number
  unit?: string
  avgResideTime?: number
  lastResideTime?: number
  resideCount?: number
  totalResideTime?: number
  [k: string]: any
}

export interface TrackLine {
  latLngs: [number, number][]
  theme?: 'default' | 'peer'
}
export interface TrackCollection {
  device?: Marker
  imageData: {
    bigImageFileId?: string
    imageFileId?: string
    createTime?: string
    confidence?: number // 置信度
  }[]
  startTime: string
  endTime: string
}
export interface TrackPointCollection {
  index?: number // track序号，从1开始
  name?: string
  startTime?: string
  endTime?: string
  theme: 'default' | 'peer'
  collections: TrackCollection[]
  [k: string]: any
}
export interface TrackIcon {
  lineIndex?: number // 所在线路的index
  startTime?: string
  endTime?: string
  index?: string
  bounds?: L.LatLngBounds
  type?: 'default' | 'peer' | 'start' | 'end'
  theme: 'default' | 'peer'
  device: Marker // 精度最高的设备，用于打点点位
  points: TrackPointCollection[]
  [k: string]: any
}

export interface TrackCollectionLine {
  [k: string]: any
}
