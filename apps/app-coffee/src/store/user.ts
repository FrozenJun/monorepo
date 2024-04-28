import { defineStore } from 'pinia'
import { getCache, setCache } from '@/utils/cache'
import { AuthAPIService } from '@/app/api/services/auth-api'
import type { MemberInfoVo } from '@/app/api/models/member-info-vo'

interface UserState {
  userInfo?: Partial<MemberInfoVo>
}
const TOKEN_KEY = 'app_user'
const userInfo = getCache<MemberInfoVo>(TOKEN_KEY) || {}
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    userInfo,
  }),
  actions: {
    setUserInfo(data: MemberInfoVo | undefined) {
      setCache(TOKEN_KEY, data)
      this.userInfo = data
    },
    getUserInfo() {
      return getCache<MemberInfoVo>(TOKEN_KEY) || this.userInfo
    },

    isRegister() {
      const user = this.getUserInfo() || {}
      return !!user.id
    },
    /**
     * @description 获取用户详情
     */
    async getUserDetail() {
      const { data, e } = await AuthAPIService.authControllerGetMemberInfo()
      if (!e && data) {
        data.balance = data.balance / 100
        this.setUserInfo(data)
      }
      return { e }
    },
  },
})
