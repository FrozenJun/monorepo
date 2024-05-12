/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { PageRequestDto } from '../models/page-request-dto';
import { PageRequestVo } from '../models/page-request-vo';
import { SmsBatchRecordVo } from '../models/sms-batch-record-vo';

class SmsBatchRecordAPI {

  /**
     * 分页
     */
    smsBatchRecordControllerPage(params?: PageRequestDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<SmsBatchRecordVo>;
}>({
        url: '/api/v1/sms-batch-record/page', 
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

export const SmsBatchRecordAPIService = new SmsBatchRecordAPI()
