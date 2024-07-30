import { Dayjs } from 'dayjs'
import { EFusionTypes } from './fusion.constant'
import { PersonVehicle } from '@/api/modules/ams/models/person-vehicle'
import { PersonElectronicGoods } from '@/api/modules/ams/models/person-electronic-goods'
import { HttpReturnType } from 'common-core/http/src/http.dto'

export interface FusionObj {
  subjectId: string
  subjectType: string
  avatarUrl?: string
  name?: string
  idcard?: string
  mac?: string
  phone?: string
  imsi?: string
  vehicle?: string
  id?: string
  vehicles?: Array<PersonVehicle>
  electronicGoodsList?: Array<PersonElectronicGoods>
}

export interface FusionControlModels {
  obj?: FusionObj
  type: EFusionTypes
  times: [Dayjs, Dayjs] | undefined
  deviceTypes?: string[]
  timeOffset?: number
  minPeerCount?: number
  minSimilarity?: number
  dataType?: string
}

export interface FusionBaseOption {
  api(...args: any[]): Promise<HttpReturnType> | HttpReturnType
  paramsHandle?: (models: FusionControlModels, obj?: FusionObj) => Record<string, any>
  dataHandle?(data: any): any | Promise<any>
}

export interface FusionPeerTrackOption extends FusionBaseOption {
  accompanyApi(...args: any[]): Promise<HttpReturnType> | HttpReturnType
  accompanyDataHandle?(data: any): any | Promise<any>
  accompanyparamsHandle?: (params?: Record<string, any>) => Record<string, any>
  // 同行信息是否分页
  usePagination: boolean
}

export interface FusionResideOption extends FusionBaseOption {
  // 落脚点列表信息是否分页
  usePagination: boolean
  // 落脚点只展示时长信息
  onlyShowTime: boolean
  // 落脚点次数api
  collectApi?(...args: any[]): Promise<HttpReturnType> | HttpReturnType
  // 落脚点时长api
  intervalApi?(...args: any[]): Promise<HttpReturnType> | HttpReturnType
}
export interface FusionOption {
  track: FusionBaseOption
  peer: FusionPeerTrackOption
  reside: FusionResideOption
}
