/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { PickupCodeGiftDto } from '../models/pickup-code-gift-dto';
import { PickupCodeVo } from '../models/pickup-code-vo';

class PickupCodeAPI {

  /**
     * 赠送提货码
     */
    pickupCodeControllerGift(params?: PickupCodeGiftDto) {
      return HttpAppSend<any>({
        url: '/api/v1/pickup-code/gift', 
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
     * 会员未使用的提货码
     */
    pickupCodeControllerGetMemberUnused(params?: {}) {
      return HttpAppSend<Array<PickupCodeVo>>({
        url: '/api/v1/pickup-code/member/unused', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
}

export const PickupCodeAPIService = new PickupCodeAPI()
