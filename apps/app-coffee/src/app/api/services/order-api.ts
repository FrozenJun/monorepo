/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { OrderBalancePayDto } from '../models/order-balance-pay-dto';
import { OrderDetailVo } from '../models/order-detail-vo';
import { OrderMemberPageDto } from '../models/order-member-page-dto';
import { OrderMemberVo } from '../models/order-member-vo';
import { OrderRefundRecordVo } from '../models/order-refund-record-vo';
import { OrderUserPageDto } from '../models/order-user-page-dto';
import { OrderUserVo } from '../models/order-user-vo';
import { OrderWepayDto } from '../models/order-wepay-dto';
import { PageRequestVo } from '../models/page-request-vo';
import { WepayAppCallParam } from '../models/wepay-app-call-param';

class OrderAPI {

  /**
     * 获取订单详情
     */
    orderControllerGetOrderDetail(params?: {
    
      id: string;
      }) {
      return HttpAppSend<OrderDetailVo>({
        url: '/api/v1/order/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 获取订单退款记录
     */
    orderControllerGetRefundRecords(params?: {
    
      id: string;
      }) {
      return HttpAppSend<Array<OrderRefundRecordVo>>({
        url: '/api/v1/order/refund-record/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * undefined
     */
    orderControllerWepayPaid(params?: {}) {
      return HttpAppSend<any>({
        url: '/api/v1/order/wepay-paid', 
      bodyType: 'X_WWW_FORM_URLENCODED',
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
     * 获取微信支付参数
     */
    orderControllerGetWepayParam(params?: OrderWepayDto) {
      return HttpAppSend<WepayAppCallParam>({
        url: '/api/v1/order/get/wepay-param', 
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
     * 余额支付
     */
    orderControllerBalancePay(params?: OrderBalancePayDto) {
      return HttpAppSend<any>({
        url: '/api/v1/order/balance-pay', 
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
     * 分页(小程序调用)
     */
    orderControllerMemberPage(params?: OrderMemberPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<OrderMemberVo>;
}>({
        url: '/api/v1/order/member/page', 
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
    orderControllerUserPage(params?: OrderUserPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<OrderUserVo>;
}>({
        url: '/api/v1/order/user/page', 
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

export const OrderAPIService = new OrderAPI()
