/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { PickupCodeComboBuyDto } from '../models/pickup-code-combo-buy-dto';
import { PickupCodeComboCreateDto } from '../models/pickup-code-combo-create-dto';
import { PickupCodeComboUpdateDto } from '../models/pickup-code-combo-update-dto';
import { PickupCodeComboVo } from '../models/pickup-code-combo-vo';
import { WepayAppCallParam } from '../models/wepay-app-call-param';

class PickupCodeComboAPI {

  /**
     * 获取所有提货码套餐
     */
    pickupCodeComboControllerGetAll(params?: {}) {
      return HttpAppSend<Array<PickupCodeComboVo>>({
        url: '/api/v1/pickup-code-combo', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 添加提货码套餐
     */
    pickupCodeComboControllerCreate(params?: PickupCodeComboCreateDto) {
      return HttpAppSend<any>({
        url: '/api/v1/pickup-code-combo', 
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
     * 编辑提货码套餐
     */
    pickupCodeComboControllerUpdate(params?: PickupCodeComboUpdateDto & { id: string | number } & {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/pickup-code-combo/{id}', 
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
     * 删除提货码套餐
     */
    pickupCodeComboControllerDelete(params?: {
    
      id: string;
      }) {
      return HttpAppSend<any>({
        url: '/api/v1/pickup-code-combo/{id}', 
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
    pickupCodeComboControllerOrderPaid(params?: {}) {
      return HttpAppSend<any>({
        url: '/api/v1/pickup-code-combo/wepay-paid', 
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
     * 购买提货码套餐
     */
    pickupCodeComboControllerBuy(params?: PickupCodeComboBuyDto) {
      return HttpAppSend<WepayAppCallParam>({
        url: '/api/v1/pickup-code-combo/buy', 
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

export const PickupCodeComboAPIService = new PickupCodeComboAPI()
