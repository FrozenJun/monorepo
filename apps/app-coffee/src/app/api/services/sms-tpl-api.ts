/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { SmsTplVo } from '../models/sms-tpl-vo';

class SmsTplAPI {

  /**
     * 获取所有短信模版
     */
    smsTplControllerGetAll(params?: {}) {
      return HttpAppSend<Array<SmsTplVo>>({
        url: '/api/v1/sms-tpl', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 获取短信模版详情
     */
    smsTplControllerGetDetail(params?: {
    
      id: string;
      }) {
      return HttpAppSend<SmsTplVo>({
        url: '/api/v1/sms-tpl/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
}

export const SmsTplAPIService = new SmsTplAPI()
