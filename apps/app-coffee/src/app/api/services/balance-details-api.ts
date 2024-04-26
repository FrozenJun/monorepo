/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { BalanceDetailsMemberPageDto } from '../models/balance-details-member-page-dto';
import { BalanceDetailsUserPageDto } from '../models/balance-details-user-page-dto';
import { BalanceDetailsVo } from '../models/balance-details-vo';
import { PageRequestVo } from '../models/page-request-vo';

class BalanceDetailsAPI {

  /**
     * 分页(小程序调用)
     */
    balanceDetailsControllerMemberPage(params?: BalanceDetailsMemberPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<BalanceDetailsVo>;
}>({
        url: '/api/v1/balance-details/member/page', 
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
    balanceDetailsControllerUserPage(params?: BalanceDetailsUserPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<BalanceDetailsVo>;
}>({
        url: '/api/v1/balance-details/user/page', 
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

export const BalanceDetailsAPIService = new BalanceDetailsAPI()
