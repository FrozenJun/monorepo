/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { BalanceComboBuyDto } from '../models/balance-combo-buy-dto';
import { BalanceComboCreateDto } from '../models/balance-combo-create-dto';
import { BalanceComboUpdateDto } from '../models/balance-combo-update-dto';
import { BalanceComboVo } from '../models/balance-combo-vo';
import { WepayAppCallParam } from '../models/wepay-app-call-param';

class BalanceComboAPI {

  /**
     * 获取所有余额充值套餐
     */
    balanceComboControllerGetAll(params?: {}) {
      return HttpAppSend<Array<BalanceComboVo>>({
        url: '/api/v1/balance-combo', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 添加余额充值套餐
     */
    balanceComboControllerCreate(params?: BalanceComboCreateDto) {
      return HttpAppSend<any>({
        url: '/api/v1/balance-combo', 
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
     * 编辑余额充值套餐
     */
    balanceComboControllerUpdate(params?: BalanceComboUpdateDto & { id: string | number } & {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/balance-combo/{id}', 
      bodyType: 'RAW_JSON',
        params: 
          params &&
          Object.keys(params)
            .filter(key => ['id', 'id'].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'PUT',
      })
    }
        
  /**
     * 删除余额充值套餐
     */
    balanceComboControllerDelete(params?: {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/balance-combo/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params: 
          params &&
          Object.keys(params)
            .filter(key => ['id', 'id'].includes(key))
            .reduce((obj, i) => {
              obj[i] = params[i]
              return obj
            }, {}),
      data: params,
        method: 'DELETE',
      })
    }
        
  /**
     * undefined
     */
    balanceComboControllerOrderPaid(params?: {}) {
      return HttpAppSend<any>({
        url: '/api/v1/balance-combo/wepay-paid', 
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
     * 购买余额充值套餐
     */
    balanceComboControllerBuy(params?: BalanceComboBuyDto) {
      return HttpAppSend<WepayAppCallParam>({
        url: '/api/v1/balance-combo/buy', 
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

export const BalanceComboAPIService = new BalanceComboAPI()
