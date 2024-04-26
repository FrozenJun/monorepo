/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { WdGetPayLinkDto } from '../models/wd-get-pay-link-dto';
import { WdGetPayResultDto } from '../models/wd-get-pay-result-dto';
import { WdOrderRefundDto } from '../models/wd-order-refund-dto';
import { WdPickupCodeVerifyDto } from '../models/wd-pickup-code-verify-dto';

class WdAPI {

  /**
     * 获取支付链接
     */
    wdControllerGetPayLink(params?: WdGetPayLinkDto) {
      return HttpAppSend<string>({
        url: '/api/v1/wd/get/pay-link', 
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
     * 获取支付结果
     */
    wdControllerGetPayResult(params?: WdGetPayResultDto) {
      return HttpAppSend<boolean>({
        url: '/api/v1/wd/get/pay-result', 
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
     * 提货码校验
     */
    wdControllerVerifyPickupCode(params?: WdPickupCodeVerifyDto) {
      return HttpAppSend<any>({
        url: '/api/v1/wd/pickup-code/verify', 
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
     * 订单退款
     */
    wdControllerOrderRefund(params?: WdOrderRefundDto) {
      return HttpAppSend<any>({
        url: '/api/v1/wd/order/refund', 
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

export const WdAPIService = new WdAPI()
