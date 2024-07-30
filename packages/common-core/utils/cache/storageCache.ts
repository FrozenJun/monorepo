import { cacheCipher } from './cache.constant'
import type { EncryptionParams } from '../cipher'
import { AesEncryption } from '../cipher'

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string
  storage: Storage
  hasEncrypt: boolean
  timeout?: number | null
}
export const createStorage = ({
  prefixKey = 'encryption',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!')
  }

  const encryption = new AesEncryption({ key, iv })

  /**
   * Cache class
   * Construction parameters can be passed into sessionStorage, localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    private storage: Storage
    private prefixKey?: string
    private encryption: AesEncryption
    private hasEncrypt: boolean
    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage
      this.prefixKey = prefixKey
      this.encryption = encryption
      this.hasEncrypt = hasEncrypt
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    /**
     * 设置缓存
     * @param {string} key
     * @param {*} value
     * @param {*} expire 过期时间(秒)
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: expire ? new Date().getTime() + expire * 1000 : null,
      })
      const stringifyValue = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData
      this.storage.setItem(this.getKey(key), stringifyValue)
    }

    /**
     * 读取缓存
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key))
      if (!val) return def

      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (expire && expire >= new Date().getTime()) {
          return value
        }
        this.remove(key)
      } catch (e) {
        return def
      }
    }

    /**
     * 清除指定缓存
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key))
    }

    /**
     * 清空所有缓存
     */
    clear(): void {
      this.storage.clear()
    }
  }
  return new WebStorage()
}
