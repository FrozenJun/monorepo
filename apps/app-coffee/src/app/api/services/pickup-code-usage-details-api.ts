/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { PageRequestVo } from '../models/page-request-vo';
import { PickupCodeUsageDetailsMemberPageDto } from '../models/pickup-code-usage-details-member-page-dto';
import { PickupCodeUsageDetailsUserPageDto } from '../models/pickup-code-usage-details-user-page-dto';
import { PickupCodeUsageDetailsVo } from '../models/pickup-code-usage-details-vo';

class PickupCodeUsageDetailsAPI {

  /**
     * 分页(小程序调用)
     */
    pickupCodeUsageDetailsControllerMemberPage(params?: PickupCodeUsageDetailsMemberPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<PickupCodeUsageDetailsVo>;
}>({
        url: '/api/v1/pickup-code-usage-details/member/page', 
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
     * 分页(管理后台调用)
     */
    pickupCodeUsageDetailsControllerUserPage(params?: PickupCodeUsageDetailsUserPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<PickupCodeUsageDetailsVo>;
}>({
        url: '/api/v1/pickup-code-usage-details/user/page', 
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

export const PickupCodeUsageDetailsAPIService = new PickupCodeUsageDetailsAPI()
