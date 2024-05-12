/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { DeviceCreateDto } from '../models/device-create-dto';
import { DeviceGetNearbyDto } from '../models/device-get-nearby-dto';
import { DeviceGetNearbyVo } from '../models/device-get-nearby-vo';
import { DevicePageDto } from '../models/device-page-dto';
import { DeviceUpdateDto } from '../models/device-update-dto';
import { DeviceVo } from '../models/device-vo';
import { PageRequestVo } from '../models/page-request-vo';

class DeviceAPI {

  /**
     * 获取附近的设备
     */
    deviceControllerGetNearby(params?: DeviceGetNearbyDto) {
      return HttpAppSend<DeviceGetNearbyVo>({
        url: '/api/v1/device/get/nearby', 
      bodyType: 'RAW_JSON',
        params: 
          params &&
          Object.keys(params)
            .filter(key => [''].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'POST',
      })
    }
        
  /**
     * 分页
     */
    deviceControllerPage(params?: DevicePageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<DeviceVo>;
}>({
        url: '/api/v1/device/page', 
      bodyType: 'RAW_JSON',
        params: 
          params &&
          Object.keys(params)
            .filter(key => [''].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'POST',
      })
    }
        
  /**
     * 添加设备
     */
    deviceControllerCreate(params?: DeviceCreateDto) {
      return HttpAppSend<any>({
        url: '/api/v1/device', 
      bodyType: 'RAW_JSON',
        params: 
          params &&
          Object.keys(params)
            .filter(key => [''].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'POST',
      })
    }
        
  /**
     * 编辑设备
     */
    deviceControllerUpdate(params?: DeviceUpdateDto & { id: string | number } & {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/device/{id}', 
      bodyType: 'RAW_JSON',
        params: 
          params &&
          Object.keys(params)
            .filter(key => ['id', 'id'].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'PUT',
      })
    }
        
  /**
     * 删除设备
     */
    deviceControllerDelete(params?: {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/device/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params: 
          params &&
          Object.keys(params)
            .filter(key => ['id', 'id'].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'DELETE',
      })
    }
        
}

export const DeviceAPIService = new DeviceAPI()
