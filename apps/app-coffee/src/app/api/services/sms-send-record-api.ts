/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { PageRequestVo } from '../models/page-request-vo';
import { SmsSendRecordQueryDto } from '../models/sms-send-record-query-dto';
import { SmsSendRecordVo } from '../models/sms-send-record-vo';

class SmsSendRecordAPI {

  /**
     * 分页
     */
    smsSendRecordControllerPage(params?: SmsSendRecordQueryDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<SmsSendRecordVo>;
}>({
        url: '/api/v1/sms-send-record/page', 
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

export const SmsSendRecordAPIService = new SmsSendRecordAPI()
