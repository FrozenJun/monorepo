import { defineStore } from 'pinia'
import { clearCache, getCache, removeCache, setCache } from '@/utils/cache'
import { UserAPIService } from '@/app/api/services/user-api'
import { useUserStore } from './user'
import { useOrgStore } from './org'
import { HideLoading, Loading, Toast } from '@/utils/propmt'

interface AuthState {
  token?: string
}
const TOKEN_KEY = 'app_adctl_token'
export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    token: undefined,
  }),
  actions: {
    setToken(token: string | undefined) {
      setCache(TOKEN_KEY, token)
      this.token = token
    },
    getToken() {
      return this.token || getCache<string>(TOKEN_KEY)
    },
    isLogin() {
      return !!this.getToken()
    },
    /**
     * @description 登录
     */
    async login() {
      try {
        const { code } = await uni.login({
          provider: 'weixin',
        })
        Loading('正在登陆中')
        const { data, e, error } = await UserAPIService.miniAppLogin({ code })
        if (!e) {
          this.setToken(data?.accessToken)
          const userStore = useUserStore()
          const orgStore = useOrgStore()
          userStore.getUserDetail()
          orgStore.getOrgDetail()
          HideLoading()
        } else {
          HideLoading()
          if (error?.errno) {
            Toast('登录失败' + error.errno)
            clearCache()
          }
        }
      } catch (err: any) {
        HideLoading()
        Promise.reject(err)
      }
    },
    /**
     * @description 登出
     */
    async loginOut(): Promise<any> {
      try {
        removeCache(TOKEN_KEY)
        this.setToken(undefined)
      } catch (err: any) {
        Promise.reject(err)
      }
    },
  },
})
