/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { MemberInfoVo } from '../models/member-info-vo';
import { MemberPhoneCodeLoginDto } from '../models/member-phone-code-login-dto';
import { MemberSendValidateCodeDto } from '../models/member-send-validate-code-dto';
import { MemberValidateCodeLoginDto } from '../models/member-validate-code-login-dto';
import { UserInfoVo } from '../models/user-info-vo';
import { UserLoginDto } from '../models/user-login-dto';

class AuthAPI {

  /**
     * 系统用户登录
     */
    authControllerUserLogin(params?: UserLoginDto) {
      return HttpAppSend<string>({
        url: '/api/v1/auth/user/login', 
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
     * 发送验证码
     */
    authControllerSendValidateCode(params?: MemberSendValidateCodeDto) {
      return HttpAppSend<any>({
        url: '/api/v1/auth/validate/code', 
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
     * 会员手机号快速验证码登录
     */
    authControllerMemberLogin(params?: MemberPhoneCodeLoginDto) {
      return HttpAppSend<string>({
        url: '/api/v1/auth/member/phone-code/login', 
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
     * 会员手机号验证码登录
     */
    authControllerValidateCodeLogin(params?: MemberValidateCodeLoginDto) {
      return HttpAppSend<string>({
        url: '/api/v1/auth/member/validate/code/login', 
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
     * 获取会员个人信息
     */
    authControllerGetMemberInfo(params?: {}) {
      return HttpAppSend<MemberInfoVo>({
        url: '/api/v1/auth/member/info', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 获取用户个人信息
     */
    authControllerGetUserInfo(params?: {}) {
      return HttpAppSend<UserInfoVo>({
        url: '/api/v1/auth/user/info', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
}

export const AuthAPIService = new AuthAPI()
