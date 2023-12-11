import { HttpSend } from '@packages/http/index'

class RoleApi {
  /**
   * 获取用户信息
   */
  get(data?: any) {
    return HttpSend<any>({
      url: '/api/role/get',
      data,
      method: 'GET',
    })
  }
}

export const roleApiService = new RoleApi()
