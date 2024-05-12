/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { Latlng } from '../models/latlng';

class MapAPI {

  /**
     * 地址逆解析
     */
    mapControllerGeocoder(params?: Latlng) {
      return HttpAppSend<string>({
        url: '/api/v1/map/geocoder', 
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

export const MapAPIService = new MapAPI()
