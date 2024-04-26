/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { ConsumptionRecordMemberPageDto } from '../models/consumption-record-member-page-dto';
import { ConsumptionRecordMemberVo } from '../models/consumption-record-member-vo';
import { ConsumptionRecordUserPageDto } from '../models/consumption-record-user-page-dto';
import { ConsumptionRecordUserVo } from '../models/consumption-record-user-vo';
import { PageRequestVo } from '../models/page-request-vo';

class ConsumptionRecordAPI {

  /**
     * 分页(小程序调用)
     */
    consumptionRecordControllerMemberPage(params?: ConsumptionRecordMemberPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<ConsumptionRecordMemberVo>;
}>({
        url: '/api/v1/consumption-record/member/page', 
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
    consumptionRecordControllerUserPage(params?: ConsumptionRecordUserPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<ConsumptionRecordUserVo>;
}>({
        url: '/api/v1/consumption-record/user/page', 
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

export const ConsumptionRecordAPIService = new ConsumptionRecordAPI()
