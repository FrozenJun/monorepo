/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { DeviceGetNearbyDto } from '../models/device-get-nearby-dto';
import { DeviceGetNearbyVo } from '../models/device-get-nearby-vo';

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
        
}

export const DeviceAPIService = new DeviceAPI()
