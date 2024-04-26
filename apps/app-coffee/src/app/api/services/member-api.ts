/* tslint:disable */
/* eslint-disable */
import { HttpAppSend } from '@packages/http'

import { MemberInfoVo } from '../models/member-info-vo';
import { MemberUpdateAvatarDto } from '../models/member-update-avatar-dto';
import { MemberUpdateNicknameDto } from '../models/member-update-nickname-dto';
import { MemberUpdatePhoneDto } from '../models/member-update-phone-dto';
import { MemerPageDto } from '../models/memer-page-dto';
import { PageRequestVo } from '../models/page-request-vo';

class MemberAPI {

  /**
     * 获取会员详情
     */
    memberControllerGetMemberDetail(params?: {
    
      id: string;
      }) {
      return HttpAppSend<MemberInfoVo>({
        url: '/api/v1/member/{id}', 
      bodyType: 'X_WWW_FORM_URLENCODED',
        params,
        method: 'GET',
      })
    }
        
  /**
     * 分页
     */
    memberControllerPage(params?: MemerPageDto) {
      return HttpAppSend<PageRequestVo & {
'items'?: Array<MemberInfoVo>;
}>({
        url: '/api/v1/member/page', 
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
     * 会员修改自己昵称
     */
    memberControllerUpdateNickname(params?: MemberUpdateNicknameDto) {
      return HttpAppSend<any>({
        url: '/api/v1/member/nickname', 
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
        method: 'PUT',
      })
    }
        
  /**
     * 会员修改自己头像
     */
    memberControllerUpdateAvatar(params?: MemberUpdateAvatarDto) {
      return HttpAppSend<any>({
        url: '/api/v1/member/avatar', 
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
        method: 'PUT',
      })
    }
        
  /**
     * 会员修改自己手机
     */
    memberControllerUpdatePhone(params?: MemberUpdatePhoneDto) {
      return HttpAppSend<any>({
        url: '/api/v1/member/phone', 
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
        method: 'PUT',
      })
    }
        
}

export const MemberAPIService = new MemberAPI()
