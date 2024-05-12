/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { SmsMemberBatchSendDto } from '../models/sms-member-batch-send-dto';
import { SmsMemberSendDto } from '../models/sms-member-send-dto';

class SmsAPI {

  /**
     * 批量发送短信给会员
     */
    smsControllerMemberBatchSend(params?: SmsMemberBatchSendDto) {
      return HttpAppSend<string>({
        url: '/api/v1/sms/member-batch-send', 
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
     * 发送短信给会员
     */
    smsControllerMemberSend(params?: SmsMemberSendDto) {
      return HttpAppSend<any>({
        url: '/api/v1/sms/member-send', 
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

export const SmsAPIService = new SmsAPI()
