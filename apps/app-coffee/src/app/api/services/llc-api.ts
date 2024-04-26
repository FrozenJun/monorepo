/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { LlcGetPayLinkDto } from '../models/llc-get-pay-link-dto';
import { LlcGetPayResultDto } from '../models/llc-get-pay-result-dto';
import { LlcOrderRefundDto } from '../models/llc-order-refund-dto';
import { LlcPickupCodeOrderCompletedNotifyDto } from '../models/llc-pickup-code-order-completed-notify-dto';
import { LlcPickupCodeOrderRefundDto } from '../models/llc-pickup-code-order-refund-dto';
import { LlcPickupCodeVerifyDto } from '../models/llc-pickup-code-verify-dto';

class LlcAPI {

  /**
     * 获取支付链接
     */
    llcControllerGetPayLink(params?: LlcGetPayLinkDto) {
      return HttpAppSend<string>({
        url: '/api/v1/llc/get/pay-link', 
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
    llcControllerGetPayResult(params?: LlcGetPayResultDto) {
      return HttpAppSend<string>({
        url: '/api/v1/llc/get/pay-result', 
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
    llcControllerVerifyPickupCode(params?: LlcPickupCodeVerifyDto) {
      return HttpAppSend<any>({
        url: '/api/v1/llc/pickup-code/verify', 
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
     * 提货码订单制作完成通知
     */
    llcControllerPickupCodeOrderCompleted(params?: LlcPickupCodeOrderCompletedNotifyDto) {
      return HttpAppSend<any>({
        url: '/api/v1/llc/pickup-code-order/completed', 
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
     * 提货码订单退款
     */
    llcControllerPickupCodeOrderRefund(params?: LlcPickupCodeOrderRefundDto) {
      return HttpAppSend<any>({
        url: '/api/v1/llc/pickup-code-order/refund', 
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
    llcControllerOrderRefund(params?: LlcOrderRefundDto) {
      return HttpAppSend<any>({
        url: '/api/v1/llc/order/refund', 
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

export const LlcAPIService = new LlcAPI()
