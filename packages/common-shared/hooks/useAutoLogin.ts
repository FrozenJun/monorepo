/**
 * 解析路径上的用户名密码，自动登录
 */

export interface IAutoLoginOption {
  username: string
  password: string
}

export function useAutoLogin() {
  return { encryption, autoLogin }

  function autoLogin(
    route: any,
    login: (username: string, password: string) => void | Promise<void>
  ) {
    const { username = '', password = '' } = decrypt(route?.query?.auth)
    if (!username || !password) return
    login && login(username, password)
  }

  /**
   * 加密
   */
  function encryption({ username, password }: IAutoLoginOption) {
    return window.btoa(`${username}___${password}`)
  }

  /**
   * 解密
   */
  function decrypt(auth: string) {
    if (!auth) return {}
    console.log(auth)
    const [username, password] = window.atob(auth).split('___')
    return { username, password }
  }
}
