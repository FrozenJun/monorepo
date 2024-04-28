import { defineStore } from 'pinia'
import { clearCache, getCache, removeCache, setCache } from '@/utils/cache'
import { useUserStore } from './user'
import { AuthAPIService } from '@/app/api/services/auth-api'
import { HideLoading, Loading, Toast } from '@/utils/toast'

interface AuthState {
  token?: string
}
const TOKEN_KEY = 'app_token'
const token = getCache<string>(TOKEN_KEY)
export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    token,
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
    async login(code: string) {
      try {
        Loading('正在登录中')
        const { data, e, error } = await AuthAPIService.authControllerMemberLogin({ code })
        if (!e) {
          this.setToken(data)
          const userStore = useUserStore()
          const { e } = await userStore.getUserDetail()
          HideLoading()
          if (!e) {
            wx.navigateBack()
            Toast('登录成功')
          }
        } else {
          HideLoading()
          if (error?.message) {
            Toast('登录失败' + error.message)
            clearCache()
          }
        }
      } catch (err: any) {
        HideLoading()
        Promise.reject(err)
      }
    },
    async phoneLogin(phone: string, code: string) {
      try {
        Loading('正在登录中')
        const { data, e, error } = await AuthAPIService.authControllerValidateCodeLogin({
          phone,
          code,
        })
        if (!e) {
          this.setToken(data)
          const userStore = useUserStore()
          const { e } = await userStore.getUserDetail()
          HideLoading()
          if (!e) {
            wx.navigateBack({ delta: 2 })
            Toast('登录成功')
          }
        } else {
          HideLoading()
          if (error?.message) {
            Toast('登录失败' + error.message)
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
