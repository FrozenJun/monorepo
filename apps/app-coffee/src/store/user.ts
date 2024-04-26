import { defineStore } from 'pinia'
import { getCache, setCache } from '@/utils/cache'
import { UserDetailAPIService } from '@/app/api/services/user-detail-api'
import type { UserDetailVo } from '@/app/api/models/user-detail-vo'

interface UserState {
  userInfo?: UserDetailVo
}
const TOKEN_KEY = 'app_adctl_user'
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    userInfo: {},
  }),
  actions: {
    setUserInfo(data: UserDetailVo | undefined) {
      setCache(TOKEN_KEY, data)
      this.userInfo = data
    },
    getUserInfo() {
      return getCache<UserDetailVo>(TOKEN_KEY) || {}
    },

    isRegister() {
      const user = this.getUserInfo() || {}
      return !!user.createTime
    },
    /**
     * @description 获取用户详情
     */
    async getUserDetail() {
      const { data, e } = await UserDetailAPIService.getCurrentUserDetail()
      if (!e) {
        this.setUserInfo(data || {})
      }
    },
  },
})
